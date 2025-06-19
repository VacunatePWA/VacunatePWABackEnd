import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: 'Admin',
      description: 'Administrador del sistema',
    },
    {
      name: 'Tutor',
      description: 'Usuario tutor (padre, madre o responsable del menor)',
    },
    {
      name: 'Enfermero',
      description: 'Personal de enfermería',
    },
    {
      name: 'Doctor',
      description: 'Personal médico',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: role.description,
      },
    });
  }

  console.log('Roles creados o actualizados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
