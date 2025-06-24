import { PrismaClient } from '@prisma/client';
import { sendEmail } from './src/utils/email.service.js';

const prisma = new PrismaClient();

async function testEmailNotifications() {
  console.log('🧪 Iniciando test de notificaciones de vacunas...');

  try {
    // Obtener todos los tutores con email
    const tutors = await prisma.user.findMany({
      where: { 
        active: true,
        email: { not: "" },
        role: {
          name: 'tutor'
        }
      },
      include: {
        guardianChildren: {
          where: { active: true },
          include: {
            child: {
              select: {
                firstName: true,
                lastName: true,
                birthDate: true
              }
            }
          }
        }
      }
    });

    console.log(`📧 Encontrados ${tutors.length} tutores con email`);

    let emailsSent = 0;
    const emailResults: Array<{
      tutor: string;
      email: string;
      status: string;
      error?: string;
      children: number;
    }> = [];

    for (const tutor of tutors) {
      // Información del primer hijo para el ejemplo
      const firstChild = tutor.guardianChildren[0]?.child;
      const childName = firstChild ? `${firstChild.firstName} ${firstChild.lastName}` : 'Su hijo/a';
      const childAge = firstChild ? Math.floor((Date.now() - new Date(firstChild.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 1;

      try {
        await sendEmail({
          to: tutor.email,
          subject: '🧪 [PRUEBA] Recordatorio de Vacunación - Sistema Vacúnate RD',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">💉 Vacúnate RD - PRUEBA</h1>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <div style="background: #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                  <h3 style="margin: 0; color: #d63031;">🧪 ESTO ES UNA PRUEBA DEL SISTEMA</h3>
                  <p style="margin: 5px 0 0 0; color: #2d3436;">Este correo es solo para verificar que las notificaciones funcionan correctamente</p>
                </div>
                
                <h2 style="color: #28a745;">⏰ Recordatorio de Vacunación</h2>
                
                <p>Hola <strong>${tutor.firstName} ${tutor.lastName}</strong>,</p>
                
                <p>Este es un correo de <strong>PRUEBA</strong> del sistema de notificaciones automáticas de Vacúnate RD.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <h3 style="margin-top: 0; color: #333;">📋 Datos de Prueba</h3>
                  <p><strong>Tutor:</strong> ${tutor.firstName} ${tutor.lastName}</p>
                  <p><strong>Email:</strong> ${tutor.email}</p>
                  <p><strong>Paciente ejemplo:</strong> ${childName}</p>
                  <p><strong>Edad aproximada:</strong> ${childAge} años</p>
                  <p><strong>Hijos registrados:</strong> ${tutor.guardianChildren.length}</p>
                </div>
                
                <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #bee5eb;">
                  <h4 style="margin-top: 0; color: #0c5460;">ℹ️ Información del Test</h4>
                  <p>Si recibes este correo, significa que:</p>
                  <ul>
                    <li>✅ Tu email está correctamente configurado en el sistema</li>
                    <li>✅ El servicio de envío de correos funciona</li>
                    <li>✅ Recibirás notificaciones reales cuando sea necesario</li>
                  </ul>
                </div>
                
                <p style="font-weight: bold; color: #28a745;">
                  🎉 ¡El sistema de notificaciones está funcionando correctamente!
                </p>
                
                <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                  🤖 Este es un correo automático de prueba generado el ${new Date().toLocaleString('es-DO')}.<br>
                  💙 Sistema Vacúnate RD - Manteniendo a nuestros niños protegidos.
                </p>
              </div>
            </div>
          `,
        });

        emailsSent++;
        emailResults.push({
          tutor: `${tutor.firstName} ${tutor.lastName}`,
          email: tutor.email,
          status: '✅ ENVIADO',
          children: tutor.guardianChildren.length
        });
        
        console.log(`✅ Email enviado a ${tutor.firstName} ${tutor.lastName} (${tutor.email})`);
        
        // Pequeña pausa entre envíos para no saturar el servidor
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error(`❌ Error enviando a ${tutor.email}:`, error);
        emailResults.push({
          tutor: `${tutor.firstName} ${tutor.lastName}`,
          email: tutor.email,
          status: '❌ ERROR',
          error: errorMessage,
          children: tutor.guardianChildren.length
        });
      }
    }

    console.log('\n📊 RESUMEN DEL TEST:');
    console.log(`📧 Correos enviados exitosamente: ${emailsSent}/${tutors.length}`);
    console.log('\n📋 Detalle por usuario:');
    
    emailResults.forEach(result => {
      console.log(`${result.status} ${result.tutor} (${result.email}) - ${result.children} hijos`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });

    // Enviar también el correo real del sistema para comparar
    console.log('\n🩹 Ejecutando también el sistema real de notificaciones...');
    const { checkUpcomingVaccines } = await import('./src/jobs/vaccineNotifier.js');
    await checkUpcomingVaccines();

  } catch (error) {
    console.error('❌ Error general en el test:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🏁 Test de correos finalizado.');
  }
}

// Ejecutar el test
testEmailNotifications().catch(console.error);
