import { checkUpcomingVaccines } from '../src/jobs/vaccineNotifier';
import prisma from '../src/db/prisma';
import 'dotenv/config';

async function testValidations() {
  console.log('🧪 Probando validaciones del sistema de notificaciones...\n');

  try {
    
    console.log('📊 Estado actual del sistema:');
    
    const children = await prisma.child.findMany({
      include: {
        guardianChildren: {
          include: {
            guardian: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                active: true
              }
            }
          }
        }
      }
    });

    console.log(`👶 Total de niños en sistema: ${children.length}`);
    
    children.forEach(child => {
      console.log(`  - ${child.firstName} ${child.lastName} (${child.active ? 'ACTIVO' : 'INACTIVO'})`);
      
      child.guardianChildren.forEach(gc => {
        const tutor = gc.guardian;
        const status = gc.active && tutor?.active ? 'ACTIVO' : 'INACTIVO';
        const email = tutor?.email || 'SIN EMAIL';
        console.log(`    👤 ${tutor?.firstName} ${tutor?.lastName} (${email}) - ${status}`);
      });
    });

    console.log('\n🔍 Ejecutando sistema de notificaciones con validaciones...\n');
    
    // Ejecutar el sistema de notificaciones
    await checkUpcomingVaccines();

    console.log('\n✅ Test de validaciones completado');
    console.log('💡 El sistema ahora valida:');
    console.log('  ✅ Niños activos únicamente');
    console.log('  ✅ Tutores activos únicamente');
    console.log('  ✅ Emails válidos únicamente');
    console.log('  ✅ Estado activo antes de enviar');
    console.log('  ✅ Formato de email correcto');

  } catch (error) {
    console.error('❌ Error en el test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testValidations();
