const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanTestData() {
  try {
    console.log('🧹 Limpiando datos de prueba...');

    // Buscar y eliminar el niño de prueba extraño
    const testChild = await prisma.child.findFirst({
      where: {
        OR: [
          { firstName: { contains: 'tuntun' } },
          { firstName: { contains: 'Sahur' } },
          { firstName: { contains: 'Lalalala' } }
        ]
      }
    });

    if (testChild) {
      console.log(`❌ Encontrado niño de prueba: ${testChild.firstName} ${testChild.lastName}`);
      
      // Eliminar relaciones del niño
      await prisma.guardianChild.deleteMany({
        where: { childId: testChild.idChild }
      });
      
      // Eliminar registros de vacunas del niño
      await prisma.record.deleteMany({
        where: { childId: testChild.idChild }
      });
      
      // Eliminar citas del niño
      await prisma.appointment.deleteMany({
        where: { childId: testChild.idChild }
      });
      
      // Finalmente eliminar el niño
      await prisma.child.delete({
        where: { idChild: testChild.idChild }
      });
      
      console.log('✅ Niño de prueba eliminado completamente');
    } else {
      console.log('ℹ️ No se encontraron niños de prueba extraños');
    }

    // Mostrar relaciones actuales limpias
    console.log('\n📊 Relaciones actuales después de la limpieza:');
    const relations = await prisma.guardianChild.findMany({
      where: { active: true },
      include: {
        guardian: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            identification: true
          }
        },
        child: {
          select: {
            firstName: true,
            lastName: true,
            identification: true
          }
        }
      }
    });

    relations.forEach(rel => {
      console.log(`👤 ${rel.guardian.firstName} ${rel.guardian.lastName} (${rel.guardian.identification}) -> 👶 ${rel.child.firstName} ${rel.child.lastName} (${rel.relationship})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanTestData();
