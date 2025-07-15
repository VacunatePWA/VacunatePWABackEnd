import prisma from './src/db/prisma';
import { sendEmail } from './src/utils/email.service';
import 'dotenv/config';

async function notifyServiceActive() {
  console.log('📢 Enviando notificación de servicio activo a todos los tutores...\n');

  try {
    const tutors = await prisma.user.findMany({
      where: {
        active: true,
        role: {
          name: 'Tutor'
        },
        email: {
          not: ''
        }
      },
      select: {
        idUser: true,
        firstName: true,
        lastName: true,
        email: true
      },
      distinct: ['email']
    });

    console.log(`👥 Encontrados ${tutors.length} tutores con email válido\n`);

    if (tutors.length === 0) {
      console.log('❌ No se encontraron tutores con emails válidos');
      return;
    }

    let emailsSent = 0;
    const errors = [];

    for (const tutor of tutors) {
      console.log(`📧 Enviando a: ${tutor.email} (${tutor.firstName} ${tutor.lastName})`);

      try {
        await sendEmail({
          to: tutor.email,
          subject: '🎉 ¡Vacúnate RD está activo! - Sistema de recordatorios automáticos',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">💉 Vacúnate RD</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Sistema de Recordatorios de Vacunación</p>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #28a745; text-align: center;">🎉 ¡El servicio está activo!</h2>
                
                <p>Hola <strong>${tutor.firstName}</strong>,</p>
                
                <p>Nos complace informarte que el <strong>Sistema de Recordatorios Automáticos de Vacunación</strong> 
                de Vacúnate RD ya está <span style="color: #28a745; font-weight: bold;">completamente operativo</span>.</p>
                
                <div style="background: white; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #28a745;">
                  <h3 style="margin-top: 0; color: #333;">📋 ¿Qué significa esto para ti?</h3>
                  <ul style="color: #555; line-height: 1.6;">
                    <li><strong>Recordatorios automáticos:</strong> Recibirás notificaciones por email cuando se acerque la fecha de vacunación de tus niños</li>
                    <li><strong>Alertas tempranas:</strong> Te avisaremos 3 días antes de cada vacuna programada</li>
                    <li><strong>Notificaciones urgentes:</strong> Si hay vacunas vencidas, recibirás alertas prioritarias</li>
                    <li><strong>Información detallada:</strong> Cada correo incluirá el nombre de la vacuna, fecha y datos del niño</li>
                  </ul>
                </div>

                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #1976d2;">⏰ Horario de notificaciones</h3>
                  <p style="margin-bottom: 0; color: #555;">
                    Las notificaciones se envían <strong>todos los días a las 8:00 AM</strong>, 
                    revisando automáticamente el estado de vacunación de todos los niños registrados.
                  </p>
                </div>

                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #f57600;">📧 Información importante</h3>
                  <ul style="margin-bottom: 0; color: #555;">
                    <li>Revisa tu bandeja de entrada y carpeta de spam regularmente</li>
                    <li>Agrega <strong>${process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@vacunate.do'}</strong> a tus contactos</li>
                    <li>Si no recibes notificaciones, verifica que tu email esté actualizado en el sistema</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                    <strong>✅ Sistema activo desde: ${new Date().toLocaleDateString('es-DO', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</strong>
                  </div>
                </div>
                
                <p style="font-weight: bold; color: #28a745; text-align: center;">
                  💙 Mantener las vacunas al día protege la salud de tus niños
                </p>
                
                <p style="font-size: 14px; color: #6c757d; margin-top: 30px; text-align: center;">
                  Este correo ha sido enviado desde el Sistema Vacúnate RD.<br>
                  Si tienes preguntas, contacta al administrador del sistema.<br><br>
                  <strong>¡Gracias por confiar en Vacúnate RD!</strong>
                </p>
              </div>
            </div>
          `,
        });

        emailsSent++;
        console.log(`   ✅ Enviado exitosamente\n`);

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        const errorMsg = `Error enviando a ${tutor.email}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        console.log(`   ❌ ${errorMsg}\n`);
      }
    }

    console.log('📊 RESUMEN DEL ENVÍO:');
    console.log(`✅ Correos enviados exitosamente: ${emailsSent}`);
    console.log(`❌ Errores: ${errors.length}`);
    console.log(`📧 Total de tutores notificados: ${emailsSent}/${tutors.length}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 ERRORES ENCONTRADOS:');
      errors.forEach(error => console.log(`  - ${error}`));
    }

    if (emailsSent > 0) {
      console.log('\n🎉 ¡Notificación masiva completada exitosamente!');
      console.log('💌 Todos los tutores han sido informados que el servicio está activo');
    }

  } catch (error) {
    console.error('❌ Error general en el envío masivo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

notifyServiceActive();
