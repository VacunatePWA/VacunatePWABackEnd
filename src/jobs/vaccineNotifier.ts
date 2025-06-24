import prisma from '../db/prisma';
import { differenceInMonths, addDays, differenceInDays } from 'date-fns';
import { sendEmail } from '../utils/email.service';

/**
 * Busca niños que necesiten una vacuna próximamente y notifica a sus tutores.
 */
export const checkUpcomingVaccines = async () => {
  console.log('🩹 Ejecutando tarea de notificación de vacunas...');

  try {
    const children = await prisma.child.findMany({
      where: { active: true },
      include: {
        guardianChildren: {
          where: { active: true },
          include: {
            guardian: {
              select: {
                idUser: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
        },
        records: {
          where: { active: true },
          include: {
            vaccine: true,
          },
        },
      },
    });

    const vaccineSchemas = await prisma.vaccineSchema.findMany({
      where: { active: true },
      include: { vaccine: true },
      orderBy: { age: 'asc' }
    });

    const notificationsSent = [];

    for (const child of children) {
      const childBirthDate = new Date(child.birthDate);
      const currentDate = new Date();
      const ageInMonths = differenceInMonths(currentDate, childBirthDate);
      const appliedVaccineIds = new Set(child.records.map(r => r.vaccineId));

      console.log(`👶 Revisando ${child.firstName} ${child.lastName} (${ageInMonths} meses)`);

      // Buscar próxima vacuna pendiente
      const nextVaccine = vaccineSchemas.find(schema => 
        !appliedVaccineIds.has(schema.vaccine.idVaccine) && schema.age >= ageInMonths
      );

      if (nextVaccine) {
        // Calcular cuando le toca la vacuna
        const vaccineDate = addDays(childBirthDate, nextVaccine.age * 30); // Aproximadamente 30 días por mes
        const daysUntilVaccine = differenceInDays(vaccineDate, currentDate);

        console.log(`💉 Próxima vacuna: ${nextVaccine.vaccine.name} en ${daysUntilVaccine} días`);

        // Notificar si faltan 3 días o menos (incluyendo vencidas)
        if (daysUntilVaccine <= 3) {
          const urgencyLevel = daysUntilVaccine < 0 ? 'VENCIDA' : 
                              daysUntilVaccine === 0 ? 'HOY' : 
                              daysUntilVaccine === 1 ? 'MAÑANA' : 
                              `${daysUntilVaccine} DÍAS`;

          // Notificar a TODOS los tutores activos
          for (const guardianChild of child.guardianChildren) {
            if (guardianChild.guardian?.email) {
              const tutor = guardianChild.guardian;
              const relationshipLabel = guardianChild.relationship === 'FATHER' ? 'padre' :
                                     guardianChild.relationship === 'MOTHER' ? 'madre' : 'tutor';

              console.log(`📧 Notificando a ${tutor.email} (${relationshipLabel}) sobre vacuna ${urgencyLevel}`);

              try {
                await sendEmail({
                  to: tutor.email,
                  subject: `${urgencyLevel === 'VENCIDA' ? '🚨 URGENTE' : '⏰'} Vacunación ${urgencyLevel} - ${child.firstName}`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">💉 Vacúnate RD</h1>
                      </div>
                      
                      <div style="padding: 30px; background: #f8f9fa;">
                        <h2 style="color: ${urgencyLevel === 'VENCIDA' ? '#dc3545' : '#28a745'};">
                          ${urgencyLevel === 'VENCIDA' ? '🚨 Vacuna VENCIDA' : 
                            urgencyLevel === 'HOY' ? '⏰ Vacuna HOY' : 
                            `⏰ Vacuna en ${urgencyLevel}`}
                        </h2>
                        
                        <p>Hola <strong>${tutor.firstName}</strong>,</p>
                        
                        <p>Como ${relationshipLabel} de <strong>${child.firstName} ${child.lastName}</strong>, 
                        te recordamos que ${urgencyLevel === 'VENCIDA' ? 'tenía programada' : 'tiene programada'} 
                        la vacuna <strong>${nextVaccine.vaccine.name}</strong> 
                        ${urgencyLevel === 'HOY' ? 'para hoy' : 
                          urgencyLevel === 'MAÑANA' ? 'para mañana' :
                          urgencyLevel === 'VENCIDA' ? 'y ya está vencida' :
                          `en ${urgencyLevel.toLowerCase()}`}.</p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                          <h3 style="margin-top: 0; color: #333;">📋 Detalles de la Vacuna</h3>
                          <p><strong>Paciente:</strong> ${child.firstName} ${child.lastName}</p>
                          <p><strong>Edad actual:</strong> ${ageInMonths} meses</p>
                          <p><strong>Vacuna:</strong> ${nextVaccine.vaccine.name}</p>
                          <p><strong>Marca:</strong> ${nextVaccine.vaccine.brand}</p>
                          <p><strong>Estado:</strong> <span style="color: ${urgencyLevel === 'VENCIDA' ? '#dc3545' : '#28a745'};">${urgencyLevel}</span></p>
                        </div>
                        
                        <p style="font-weight: bold; color: #dc3545;">
                          ${urgencyLevel === 'VENCIDA' ? 
                            '⚠️ Por favor, agenda una cita URGENTE en tu centro de salud más cercano.' :
                            '📅 Por favor, agenda una cita pronto en tu centro de salud más cercano.'}
                        </p>
                        
                        <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                          💙 Este es un recordatorio automático del sistema de Vacúnate RD.<br>
                          Mantener las vacunas al día protege la salud de ${child.firstName}.
                        </p>
                      </div>
                    </div>
                  `,
                });

                notificationsSent.push({
                  tutor: `${tutor.firstName} ${tutor.lastName} (${tutor.email})`,
                  child: `${child.firstName} ${child.lastName}`,
                  vaccine: nextVaccine.vaccine.name,
                  urgency: urgencyLevel,
                  relationship: relationshipLabel
                });
              } catch (emailError) {
                console.error(`❌ Error enviando correo a ${tutor.email}:`, emailError);
              }
            }
          }
        }
      }
    }

    console.log(`✅ Notificaciones enviadas: ${notificationsSent.length}`);
    if (notificationsSent.length > 0) {
      console.log('📧 Resumen de notificaciones:');
      notificationsSent.forEach(notif => {
        console.log(`  - ${notif.tutor} (${notif.relationship}) -> ${notif.child} - ${notif.vaccine} (${notif.urgency})`);
      });
    }

  } catch (error) {
    console.error('❌ Error en la tarea de notificación de vacunas:', error);
  } finally {
    console.log('🏁 Tarea de notificación de vacunas finalizada.');
  }
}; 