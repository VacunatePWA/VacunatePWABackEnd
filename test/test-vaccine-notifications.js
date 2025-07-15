import prisma from '../src/db/prisma';
import { sendEmail } from '../src/utils/email.service';
import { differenceInMonths, addDays, differenceInDays } from 'date-fns';
import 'dotenv/config';

console.log('💉 Test de Notificaciones de Vacunas - Vacúnate RD');
console.log('==================================================');

async function testVaccineNotifications() {
  try {
    // Simular que todos los niños necesitan una vacuna en 3 días
    console.log('🧪 Simulando notificaciones de vacunas próximas...');
    
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

    console.log(`👶 Encontrados ${children.length} niños activos`);
    console.log(`💉 Encontrados ${vaccineSchemas.length} esquemas de vacunas`);

    if (children.length === 0) {
      console.log('❌ No hay niños para notificar');
      return;
    }

    if (vaccineSchemas.length === 0) {
      console.log('❌ No hay esquemas de vacunas configurados');
      return;
    }

    let notificationsSent = 0;

    
    for (const child of children) {
      const appliedVaccineIds = new Set(child.records.map(r => r.vaccineId));
      
      
      const nextVaccine = vaccineSchemas.find(schema => 
        !appliedVaccineIds.has(schema.vaccine.idVaccine)
      );

      if (nextVaccine && child.guardianChildren.length > 0) {
        console.log(`\n👶 ${child.firstName} ${child.lastName}:`);
        console.log(`   💉 Vacuna pendiente: ${nextVaccine.vaccine.name}`);
        console.log(`   👥 Tutores: ${child.guardianChildren.length}`);

        // Notificar a todos los tutores del niño
        for (const guardianChild of child.guardianChildren) {
          if (guardianChild.guardian?.email) {
            const tutor = guardianChild.guardian;
            const relationshipLabel = guardianChild.relationship === 'FATHER' ? 'padre' :
                                   guardianChild.relationship === 'MOTHER' ? 'madre' : 'tutor';

            console.log(`   📧 Enviando a: ${tutor.firstName} ${tutor.lastName} (${tutor.email}) - ${relationshipLabel}`);

            try {
              await sendEmail({
                to: tutor.email,
                subject: `⏰ PRUEBA: Vacuna próxima en 3 días - ${child.firstName}`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                      <h1 style="color: white; margin: 0;">💉 Vacúnate RD</h1>
                      <p style="color: #f8f9fa; margin: 5px 0 0 0; font-size: 14px;">🧪 SIMULACIÓN DE NOTIFICACIÓN</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8f9fa;">
                      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                        <p style="margin: 0; color: #856404; font-weight: bold;">
                          🧪 ESTO ES UNA PRUEBA - No es una notificación real
                        </p>
                      </div>
                      
                      <h2 style="color: #28a745;">⏰ Vacuna próxima en 3 días</h2>
                      
                      <p>Hola <strong>${tutor.firstName}</strong>,</p>
                      
                      <p>Como ${relationshipLabel} de <strong>${child.firstName} ${child.lastName}</strong>, 
                      te recordamos que tiene programada la vacuna <strong>${nextVaccine.vaccine.name}</strong> 
                      en 3 días.</p>
                      
                      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <h3 style="margin-top: 0; color: #333;">📋 Detalles de la Vacuna (SIMULACIÓN)</h3>
                        <p><strong>Paciente:</strong> ${child.firstName} ${child.lastName}</p>
                        <p><strong>Vacuna:</strong> ${nextVaccine.vaccine.name}</p>
                        <p><strong>Marca:</strong> ${nextVaccine.vaccine.brand}</p>
                        <p><strong>Tu relación:</strong> ${relationshipLabel}</p>
                        <p><strong>Estado:</strong> <span style="color: #28a745;">Simulación - 3 días</span></p>
                      </div>
                      
                      <p style="font-weight: bold; color: #28a745;">
                        📅 Por favor, agenda una cita pronto en tu centro de salud más cercano.
                      </p>
                      
                      <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #0c5460;">
                          ℹ️ <strong>Esta es una simulación</strong> para probar el sistema de notificaciones.
                          En una situación real, recibirías este tipo de notificación cuando realmente
                          falten 3 días para una vacuna programada.
                        </p>
                      </div>
                      
                      <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                        🤖 Este es un correo de prueba del sistema de Vacúnate RD.<br>
                        Fecha de la prueba: ${new Date().toLocaleString('es-DO')}
                      </p>
                    </div>
                  </div>
                `,
              });

              console.log(`      ✅ Enviado exitosamente`);
              notificationsSent++;
            } catch (error) {
              console.log(`      ❌ Error: ${error.message}`);
            }
          }
        }
      }
    }

    console.log('\n📊 Resumen de la simulación:');
    console.log(`  📧 Notificaciones enviadas: ${notificationsSent}`);
    console.log(`  👶 Niños procesados: ${children.length}`);

    if (notificationsSent > 0) {
      console.log('\n🎉 ¡Simulación completada!');
      console.log('💡 Todos los tutores deberían haber recibido notificaciones de prueba.');
    } else {
      console.log('\n⚠️  No se enviaron notificaciones. Revisa la configuración.');
    }

  } catch (error) {
    console.error('❌ Error en la simulación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la simulación
testVaccineNotifications();
