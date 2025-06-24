import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRelations() {
  console.log('🔍 Verificando relaciones entre tutores y niños...\n');
  
  // Obtener Luis Pérez
  const luisPerez = await prisma.user.findFirst({
    where: { email: 'luis.perez@email.com' },
    include: {
      guardianChildren: {
        include: {
          child: true
        }
      }
    }
  });

  console.log('👤 Luis Pérez:', luisPerez?.firstName, luisPerez?.lastName);
  console.log('📧 Email:', luisPerez?.email);
  console.log('🆔 ID:', luisPerez?.idUser);
  console.log('👶 Niños asignados:', luisPerez?.guardianChildren?.map(gc => 
    `${gc.child.firstName} ${gc.child.lastName} (${gc.relationship}) - Active: ${gc.active}`
  ));
  
  console.log('\n📅 Citas en el sistema:');
  
  const appointments = await prisma.appointment.findMany({
    where: { active: true },
    include: {
      child: {
        include: {
          guardianChildren: {
            include: {
              guardian: true
            }
          }
        }
      },
      user: true,
      clinic: true
    },
    orderBy: { createdAt: 'desc' }
  });

  appointments.forEach((appointment, index) => {
    console.log(`\n📋 Cita ${index + 1}:`);
    console.log(`  👶 Niño: ${appointment.child.firstName} ${appointment.child.lastName}`);
    console.log(`  👤 Usuario de la cita: ${appointment.user.firstName} ${appointment.user.lastName} (${appointment.user.email})`);
    console.log(`  🏥 Centro: ${appointment.clinic.name}`);
    console.log(`  📅 Fecha: ${appointment.date}`);
    console.log(`  🔗 Guardianes del niño:`, appointment.child.guardianChildren.map(gc => 
      `${gc.guardian.firstName} ${gc.guardian.lastName} (${gc.guardian.email}) - Active: ${gc.active}`
    ));
    console.log(`  ✅ ¿Luis Pérez es guardián?: ${appointment.child.guardianChildren.some(gc => gc.guardian.email === 'luis.perez@email.com' && gc.active)}`);
  });

  console.log('\n🎯 Citas que debería ver Luis Pérez:');
  const luisAppointments = appointments.filter(appointment => {
    // Citas donde Luis es el usuario directo
    const isDirectUser = appointment.user.email === 'luis.perez@email.com';
    
    // Citas donde Luis es guardián del niño
    const isGuardian = appointment.child.guardianChildren.some(gc => 
      gc.guardian.email === 'luis.perez@email.com' && gc.active
    );
    
    return isDirectUser || isGuardian;
  });

  luisAppointments.forEach((appointment, index) => {
    console.log(`  ${index + 1}. ${appointment.child.firstName} ${appointment.child.lastName} - ${appointment.clinic.name}`);
  });

  await prisma.$disconnect();
}

checkRelations().catch(console.error);
