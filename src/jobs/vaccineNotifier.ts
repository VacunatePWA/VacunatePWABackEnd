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
      where: { 
        active: true // ✅ Solo niños activos
      },
      include: {
        guardianChildren: {
          where: { 
            active: true, // ✅ Solo relaciones activas
            guardian: {
              active: true // ✅ Solo tutores activos
            }
          },
          include: {
            guardian: {
              select: {
                idUser: true,
                firstName: true,
                lastName: true,
                email: true,
                active: true // ✅ Incluir estado del tutor
              }
            }
          },
        },
        records: {
          where: { active: true }, // ✅ Solo registros de vacunas activos
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
      // ✅ Validación adicional: verificar que el niño esté activo
      if (!child.active) {
        console.log(`⚠️ Saltando ${child.firstName} ${child.lastName} - niño inactivo`);
        continue;
      }

      const childBirthDate = new Date(child.birthDate);
      const currentDate = new Date();
      const ageInMonths = differenceInMonths(currentDate, childBirthDate);
      const appliedVaccineIds = new Set(child.records.map(r => r.vaccineId));

      console.log(`👶 Revisando ${child.firstName} ${child.lastName} (${ageInMonths} meses) - Estado: ${child.active ? 'ACTIVO' : 'INACTIVO'}`);

      // ✅ Validar que tenga tutores activos antes de continuar
      const activeTutors = child.guardianChildren.filter(gc => 
        gc.active && gc.guardian && gc.guardian.active && gc.guardian.email
      );

      if (activeTutors.length === 0) {
        console.log(`⚠️ Saltando ${child.firstName} ${child.lastName} - sin tutores activos con email`);
        continue;
      }

      
      const nextVaccine = vaccineSchemas.find(schema => 
        !appliedVaccineIds.has(schema.vaccine.idVaccine) && schema.age >= ageInMonths
      );

      if (nextVaccine) {
        
        const vaccineDate = addDays(childBirthDate, nextVaccine.age * 30); // Aproximadamente 30 días por mes
        const daysUntilVaccine = differenceInDays(vaccineDate, currentDate);

        console.log(`💉 Próxima vacuna: ${nextVaccine.vaccine.name} en ${daysUntilVaccine} días`);

        // Notificar si faltan 3 días o menos (incluyendo vencidas)
        if (daysUntilVaccine <= 3) {
          const urgencyLevel = daysUntilVaccine < 0 ? 'VENCIDA' : 
                              daysUntilVaccine === 0 ? 'HOY' : 
                              daysUntilVaccine === 1 ? 'MAÑANA' : 
                              `${daysUntilVaccine} DÍAS`;

          // ✅ Notificar solo a tutores activos con email válido
          for (const guardianChild of activeTutors) {
            const tutor = guardianChild.guardian;
            
            // ✅ Validación final antes de enviar email
            if (!tutor || !tutor.active || !tutor.email || tutor.email.trim() === '') {
              console.log(`⚠️ Saltando notificación - tutor inválido o sin email`);
              continue;
            }

            const relationshipLabel = guardianChild.relationship === 'FATHER' ? 'padre' :
                                   guardianChild.relationship === 'MOTHER' ? 'madre' : 'tutor';

            console.log(`📧 Notificando a ${tutor.email} (${relationshipLabel}) sobre vacuna ${urgencyLevel} para ${child.firstName} ${child.lastName} (ACTIVO)`);

            try {
              // ✅ Validación final: confirmar que el niño sigue activo antes de enviar
              const childStillActive = await prisma.child.findUnique({
                where: { idChild: child.idChild },
                select: { active: true }
              });

              if (!childStillActive?.active) {
                console.log(`⚠️ Cancelando notificación - el niño ${child.firstName} ${child.lastName} ya no está activo`);
                continue;
              }

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

/**
 * Función específica para notificar SOLO vacunas vencidas al iniciar el backend.
 * Esta función se ejecuta al startup del servidor para alertar sobre vacunas atrasadas.
 */
export const notifyOverdueVaccinesOnStartup = async () => {
  console.log('🚨 Ejecutando notificación de vacunas VENCIDAS al iniciar el backend...');

  try {
    
    const children = await prisma.child.findMany({
      where: { 
        active: true // ✅ Solo niños activos
      },
      include: {
        guardianChildren: {
          where: { 
            active: true, // ✅ Solo relaciones activas
            guardian: {
              active: true // ✅ Solo tutores activos
            }
          },
          include: {
            guardian: {
              select: {
                idUser: true,
                firstName: true,
                lastName: true,
                email: true,
                active: true
              }
            }
          },
        },
        records: {
          where: { active: true }, // ✅ Solo registros de vacunas activos
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

    const overdueNotificationsSent = [];

    for (const child of children) {
      // ✅ Validación adicional: verificar que el niño esté activo
      if (!child.active) {
        console.log(`⚠️ Saltando ${child.firstName} ${child.lastName} - niño inactivo`);
        continue;
      }

      const childBirthDate = new Date(child.birthDate);
      const currentDate = new Date();
      const ageInMonths = differenceInMonths(currentDate, childBirthDate);
      const appliedVaccineIds = new Set(child.records.map(r => r.vaccineId));

      console.log(`👶 Revisando vacunas vencidas para ${child.firstName} ${child.lastName} (${ageInMonths} meses)`);

      // ✅ Validar que tenga tutores activos antes de continuar
      const activeTutors = child.guardianChildren.filter(gc => 
        gc.active && gc.guardian && gc.guardian.active && gc.guardian.email
      );

      if (activeTutors.length === 0) {
        console.log(`⚠️ Saltando ${child.firstName} ${child.lastName} - sin tutores activos con email`);
        continue;
      }

      
      const overdueVaccines = [];
      
      for (const schema of vaccineSchemas) {
        // Si ya tiene aplicada esta vacuna, saltar
        if (appliedVaccineIds.has(schema.vaccine.idVaccine)) {
          continue;
        }

        
        const vaccineDate = addDays(childBirthDate, schema.age * 30);
        const daysUntilVaccine = differenceInDays(vaccineDate, currentDate);

        // Solo procesar vacunas VENCIDAS (días negativos)
        if (daysUntilVaccine < 0) {
          overdueVaccines.push({
            vaccine: schema.vaccine,
            daysPastDue: Math.abs(daysUntilVaccine),
            expectedAge: schema.age
          });
        }
      }

      // Si tiene vacunas vencidas, notificar a todos los tutores activos
      if (overdueVaccines.length > 0) {
        console.log(`🚨 ${child.firstName} ${child.lastName} tiene ${overdueVaccines.length} vacuna(s) vencida(s)`);

        for (const guardianChild of activeTutors) {
          const tutor = guardianChild.guardian;
          
          // ✅ Validación final antes de enviar email
          if (!tutor || !tutor.active || !tutor.email || tutor.email.trim() === '') {
            console.log(`⚠️ Saltando notificación - tutor inválido o sin email`);
            continue;
          }

          const relationshipLabel = guardianChild.relationship === 'FATHER' ? 'padre' :
                                 guardianChild.relationship === 'MOTHER' ? 'madre' : 'tutor';

          console.log(`📧 Notificando vacunas VENCIDAS a ${tutor.email} (${relationshipLabel}) para ${child.firstName} ${child.lastName}`);

          try {
            // ✅ Validación final: confirmar que el niño sigue activo antes de enviar
            const childStillActive = await prisma.child.findUnique({
              where: { idChild: child.idChild },
              select: { active: true }
            });

            if (!childStillActive?.active) {
              console.log(`⚠️ Cancelando notificación - el niño ${child.firstName} ${child.lastName} ya no está activo`);
              continue;
            }

            
            const vaccinesList = overdueVaccines.map(v => 
              `<li><strong>${v.vaccine.name}</strong> (${v.vaccine.brand}) - Vencida hace ${v.daysPastDue} días</li>`
            ).join('');

            await sendEmail({
              to: tutor.email,
              subject: `🚨 URGENTE: ${overdueVaccines.length} vacuna(s) vencida(s) - ${child.firstName}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🚨 Vacúnate RD - ALERTA</h1>
                  </div>
                  
                  <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #dc3545;">
                      🚨 Vacunas VENCIDAS Detectadas
                    </h2>
                    
                    <p>Hola <strong>${tutor.firstName}</strong>,</p>
                    
                    <p>Como ${relationshipLabel} de <strong>${child.firstName} ${child.lastName}</strong>, 
                    te informamos que detectamos <strong>${overdueVaccines.length} vacuna(s) vencida(s)</strong> 
                    que requieren atención URGENTE.</p>
                    
                    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                      <h3 style="margin-top: 0; color: #856404;">📋 Vacunas Vencidas</h3>
                      <p><strong>Paciente:</strong> ${child.firstName} ${child.lastName}</p>
                      <p><strong>Edad actual:</strong> ${ageInMonths} meses</p>
                      <ul style="color: #856404;">
                        ${vaccinesList}
                      </ul>
                    </div>
                    
                    <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                      <p style="font-weight: bold; color: #721c24; margin: 0;">
                        ⚠️ ACCIÓN REQUERIDA: Por favor, agenda una cita URGENTE en tu centro de salud más cercano 
                        para ponerse al día con estas vacunas vencidas.
                      </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                      💙 Este es un recordatorio automático del sistema de Vacúnate RD al iniciar el servidor.<br>
                      Mantener las vacunas al día es crucial para proteger la salud de ${child.firstName}.
                    </p>
                  </div>
                </div>
              `,
            });

            overdueNotificationsSent.push({
              tutor: `${tutor.firstName} ${tutor.lastName} (${tutor.email})`,
              child: `${child.firstName} ${child.lastName}`,
              overdueCount: overdueVaccines.length,
              relationship: relationshipLabel
            });

          } catch (emailError) {
            console.error(`❌ Error enviando correo de vacunas vencidas a ${tutor.email}:`, emailError);
          }
        }
      }
    }

    console.log(`✅ Notificaciones de vacunas VENCIDAS enviadas: ${overdueNotificationsSent.length}`);
    if (overdueNotificationsSent.length > 0) {
      console.log('📧 Resumen de notificaciones de vacunas VENCIDAS:');
      overdueNotificationsSent.forEach(notif => {
        console.log(`  - ${notif.tutor} (${notif.relationship}) -> ${notif.child} - ${notif.overdueCount} vacuna(s) vencida(s)`);
      });
    } else {
      console.log('✅ No se encontraron vacunas vencidas para notificar.');
    }

  } catch (error) {
    console.error('❌ Error en la notificación de vacunas vencidas al startup:', error);
  } finally {
    console.log('🏁 Notificación de vacunas vencidas al startup finalizada.');
  }
};