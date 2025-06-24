import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testChildUpdate() {
  try {
    console.log('🧪 Probando actualización de niño...');

    // Buscar un niño existente
    const existingChild = await prisma.child.findFirst({
      where: { active: true },
      include: {
        guardianChildren: {
          where: { active: true },
          include: {
            guardian: {
              select: {
                firstName: true,
                lastName: true,
                identification: true
              }
            }
          }
        }
      }
    });

    if (!existingChild) {
      console.log('❌ No se encontraron niños para probar');
      return;
    }

    console.log(`👶 Niño encontrado: ${existingChild.firstName} ${existingChild.lastName}`);
    console.log(`🆔 Cédula actual: ${existingChild.identification}`);
    console.log('👥 Tutores actuales:');
    
    existingChild.guardianChildren.forEach(gc => {
      console.log(`  - ${gc.guardian.firstName} ${gc.guardian.lastName} (${gc.relationship})`);
    });

    // Probar actualización
    const updatedChild = await prisma.child.update({
      where: { idChild: existingChild.idChild },
      data: {
        identification: '99999999999', // Cédula de prueba
        city: 'Ciudad Actualizada',
        municipality: 'Municipio Actualizado'
      }
    });

    console.log('✅ Actualización exitosa');
    console.log(`🆔 Nueva cédula: ${updatedChild.identification}`);
    console.log(`🏙️ Nueva ciudad: ${updatedChild.city}`);
    console.log(`🏘️ Nuevo municipio: ${updatedChild.municipality}`);

    // Revertir los cambios
    await prisma.child.update({
      where: { idChild: existingChild.idChild },
      data: {
        identification: existingChild.identification,
        city: existingChild.city,
        municipality: existingChild.municipality
      }
    });

    console.log('🔄 Cambios revertidos correctamente');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testChildUpdate();
