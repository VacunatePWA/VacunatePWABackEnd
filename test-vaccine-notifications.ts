import prisma from './src/db/prisma';
import { sendEmail } from './src/utils/email.service';
import 'dotenv/config';

async function testVaccineNotifications() {
  console.log('🧪 Probando sistema de notificaciones de vacunas...\n');

  try {
    // Obtener todos los tutores con sus niños
    const tutorsWithChildren = await prisma.guardianChild.findMany({
      where: { active: true },
      include: {
        guardian: {
          select: {
            idUser: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        child: {
          select: {
            idChild: true,
            firstName: true,
            lastName: true,
            birthDate: true
          }
        }
      }
    });

    console.log(`👥 Encontrados ${tutorsWithChildren.length} relaciones tutor-niño activas\n`);

    // Obtener una vacuna de ejemplo para el test
    const testVaccine = await prisma.vaccine.findFirst({
      where: { active: true }
    });

    if (!testVaccine) {
      console.log('❌ No se encontraron vacunas en el sistema');
      return;
    }

    console.log(`💉 Usando vacuna de prueba: ${testVaccine.name} (${testVaccine.brand})\n`);

    let emailsSent = 0;
    const errors = [];

    for (const relation of tutorsWithChildren) {
      const tutor = relation.guardian;
      const child = relation.child;
      
      if (!tutor?.email) {
        console.log(`⚠️ Tutor ${tutor?.firstName} ${tutor?.lastName} no tiene email configurado`);
        continue;
      }

      console.log(`📧 Enviando correo de prueba a: ${tutor.email}`);
      console.log(`   Tutor: ${tutor.firstName} ${tutor.lastName}`);
      console.log(`   Niño: ${child.firstName} ${child.lastName}`);

      try {
        await sendEmail({
          to: tutor.email,
          subject: '🧪 TEST - Recordatorio de Vacunación - Vacúnate RD',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">💉 Vacúnate RD - TEST</h1>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                  <h3 style="color: #856404; margin: 0;">🧪 ESTE ES UN CORREO DE PRUEBA</h3>
                  <p style="color: #856404; margin: 5px 0 0 0;">Sistema de notificaciones funcionando correctamente</p>
                </div>

                <h2 style="color: #28a745;">⏰ Recordatorio de Vacunación</h2>
                
                <p>Hola <strong>${tutor.firstName}</strong>,</p>
                
                <p>Este es un correo de prueba del sistema de notificaciones de Vacúnate RD.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <h3 style="margin-top: 0; color: #333;">📋 Información del Test</h3>
                  <p><strong>Tutor:</strong> ${tutor.firstName} ${tutor.lastName}</p>
                  <p><strong>Email:</strong> ${tutor.email}</p>
                  <p><strong>Niño asociado:</strong> ${child.firstName} ${child.lastName}</p>
                  <p><strong>Fecha de nacimiento:</strong> ${new Date(child.birthDate).toLocaleDateString('es-DO')}</p>
                  <p><strong>Vacuna de ejemplo:</strong> ${testVaccine.name} (${testVaccine.brand})</p>
                  <p><strong>Fecha del test:</strong> ${new Date().toLocaleString('es-DO')}</p>
                </div>
                
                <p style="font-weight: bold; color: #28a745;">
                  ✅ Si recibes este correo, el sistema de notificaciones está funcionando correctamente.
                </p>
                
                <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                  🧪 Este es un correo de prueba del sistema Vacúnate RD.<br>
                  No requiere ninguna acción de tu parte.
                </p>
              </div>
            </div>
          `,
        });

        emailsSent++;
        console.log(`   ✅ Correo enviado exitosamente\n`);

      } catch (error) {
        const errorMsg = `Error enviando a ${tutor.email}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        console.log(`   ❌ ${errorMsg}\n`);
      }
    }

    console.log('📊 RESUMEN DEL TEST:');
    console.log(`✅ Correos enviados exitosamente: ${emailsSent}`);
    console.log(`❌ Errores: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 ERRORES ENCONTRADOS:');
      errors.forEach(error => console.log(`  - ${error}`));
    }

    if (emailsSent === 0) {
      console.log('\n💡 POSIBLES CAUSAS:');
      console.log('  - No hay tutores con emails configurados');
      console.log('  - Configuración de email incorrecta');
      console.log('  - Problemas de conectividad');
    }

  } catch (error) {
    console.error('❌ Error general en el test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testVaccineNotifications();
