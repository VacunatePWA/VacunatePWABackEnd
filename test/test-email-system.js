import { sendEmail } from '../src/utils/email.service';
import prisma from '../src/db/prisma';
import 'dotenv/config';

console.log('🧪 Test de sistema de correo - Vacúnate RD');
console.log('================================================');


console.log('📧 Configuración de correo:');
console.log(`  HOST: ${process.env.EMAIL_HOST || 'No configurado'}`);
console.log(`  PORT: ${process.env.EMAIL_PORT || 'No configurado'}`);
console.log(`  USER: ${process.env.EMAIL_USER || 'No configurado'}`);
console.log(`  PASS: ${process.env.EMAIL_PASS ? '[CONFIGURADO]' : 'No configurado'}`);
console.log(`  FROM: ${process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'No configurado'}`);
console.log('');

async function testEmailSystem() {
  try {
    // 1. Obtener todos los tutores del sistema
    console.log('👥 Obteniendo tutores del sistema...');
    const tutors = await prisma.user.findMany({
      where: {
        active: true,
        role: {
          name: 'TUTOR'
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

    console.log(`✅ Encontrados ${tutors.length} tutores activos`);
    
    if (tutors.length === 0) {
      console.log('❌ No hay tutores para enviar correos de prueba');
      return;
    }

    // 2. Enviar correo de prueba a cada tutor
    console.log('🚀 Enviando correos de prueba...');
    let successCount = 0;
    let errorCount = 0;

    for (const tutor of tutors) {
      const childrenNames = tutor.guardianChildren
        .map(gc => `${gc.child.firstName} ${gc.child.lastName}`)
        .join(', ');

      console.log(`📧 Enviando a: ${tutor.firstName} ${tutor.lastName} (${tutor.email})`);
      console.log(`   Niños a cargo: ${childrenNames || 'Ninguno'}`);

      try {
        await sendEmail({
          to: tutor.email,
          subject: '🧪 Test de Sistema de Notificaciones - Vacúnate RD',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">💉 Vacúnate RD</h1>
                <p style="color: #f8f9fa; margin: 5px 0 0 0;">Sistema de Notificaciones</p>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #28a745;">🧪 Correo de Prueba</h2>
                
                <p>Hola <strong>${tutor.firstName} ${tutor.lastName}</strong>,</p>
                
                <p>Este es un correo de prueba para verificar que el sistema de notificaciones 
                de Vacúnate RD está funcionando correctamente.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                  <h3 style="margin-top: 0; color: #333;">👤 Tu información en el sistema</h3>
                  <p><strong>Nombre:</strong> ${tutor.firstName} ${tutor.lastName}</p>
                  <p><strong>Email:</strong> ${tutor.email}</p>
                  <p><strong>Niños a cargo:</strong> ${childrenNames || 'Ninguno registrado'}</p>
                  <p><strong>Fecha de prueba:</strong> ${new Date().toLocaleString('es-DO')}</p>
                </div>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #1976d2;">
                    ℹ️ <strong>Información:</strong> Este sistema te notificará automáticamente 
                    cuando sea momento de vacunar a tus niños, 3 días antes de la fecha programada.
                  </p>
                </div>
                
                <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                  🤖 Este es un mensaje automático del sistema de pruebas.<br>
                  Si recibes este correo, el sistema está funcionando correctamente.
                </p>
              </div>
            </div>
          `,
        });

        console.log(`   ✅ Enviado exitosamente`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log('');
    console.log('📊 Resumen del test:');
    console.log(`  ✅ Correos enviados exitosamente: ${successCount}`);
    console.log(`  ❌ Errores: ${errorCount}`);
    console.log(`  📧 Total de tutores: ${tutors.length}`);

    if (successCount > 0) {
      console.log('');
      console.log('🎉 ¡El sistema de correo está funcionando!');
      console.log('💡 Todos los tutores deberían haber recibido un correo de prueba.');
    } else {
      console.log('');
      console.log('⚠️  No se pudo enviar ningún correo. Revisa la configuración.');
    }

  } catch (error) {
    console.error('❌ Error general en el test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el test
testEmailSystem();
