import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Definición de vacunas
const vaccines = [
  {
    name: 'BCG',
    brand: 'BCG Vaccine',
    description: 'Vacuna contra la tuberculosis'
  },
  {
    name: 'Hepatitis B',
    brand: 'Hepatitis B Vaccine', 
    description: 'Vacuna contra la Hepatitis B'
  },
  {
    name: 'Rotavirus',
    brand: 'Rotavirus Vaccine',
    description: 'Vacuna contra el Rotavirus'
  },
  {
    name: 'IPV',
    brand: 'Inactivated Polio Vaccine',
    description: 'Vacuna inactivada contra la Poliomielitis'
  },
  {
    name: 'Neumococo',
    brand: 'Pneumococcal Vaccine',
    description: 'Vacuna contra el Neumococo'
  },
  {
    name: 'Pentavalente',
    brand: 'Pentavalent Vaccine',
    description: 'Vacuna Pentavalente (DPT + HepB + Hib)'
  },
  {
    name: 'bOPV',
    brand: 'Bivalent Oral Polio Vaccine',
    description: 'Vacuna Oral Bivalente contra la Poliomielitis'
  },
  {
    name: 'SRP',
    brand: 'MMR Vaccine',
    description: 'Vacuna contra Sarampión, Rubéola y Paperas'
  },
  {
    name: 'OPV',
    brand: 'Oral Polio Vaccine',
    description: 'Vacuna Oral contra la Poliomielitis'
  },
  {
    name: 'DPT',
    brand: 'DPT Vaccine',
    description: 'Vacuna contra Difteria, Pertussis y Tétanos'
  }
];

// Mapeo de nombres de vacunas a sus IDs existentes
const vaccineIds = {
  'BCG': 'a029b525-6d4d-4df4-bb9e-5f78c633cd73',
  'Hepatitis B': 'e35189d4-b9de-4aad-9264-5b6564a9c269',
  'Rotavirus': '6e7b9182-9f01-41fe-b805-fe84aa0f72fd',
  'IPV': '8987af68-cffc-4655-85d5-0f036fe29a31',
  'Neumococo': 'e2c74689-c78c-47b3-9702-f3fa7e09afb8',
  'Pentavalente': '9fbcfc43-70f5-48c2-97b0-3ae124012c3b',
  'bOPV': '71a3f353-4ffa-4ad9-9fe9-6ff7caadef51',
  'SRP': '0a074102-ba90-4f50-a4e3-4e82770adef1',
  'OPV': 'e22d0b07-b961-497c-b299-7747974048ef',
  'DPT': '9cf439d7-9f96-4239-8a37-53c9022abff7'
};

const esquema = [
  {
    edad: 'Al nacer',
    edad_meses: 0,
    vacunas_aplicar: [
      {
        nombre_vacuna: 'BCG',
        enfermedades_previene: ['Formas graves de la Tuberculosis'],
        dosis: 'Dosis única',
        numero_dosis: 1,
      },
      {
        nombre_vacuna: 'Hepatitis B',
        enfermedades_previene: ['Infección por Hepatitis B en el recién nacido'],
        dosis: 'Dosis única',
        numero_dosis: 1,
      },
    ],
  },
  {
    edad: '2 meses',
    edad_meses: 2,
    vacunas_aplicar: [
      {
        nombre_vacuna: 'Rotavirus',
        enfermedades_previene: ['Diarreas graves producidas por Rotavirus'],
        dosis: '1era dosis',
        numero_dosis: 1,
      },
      {
        nombre_vacuna: 'IPV',
        enfermedades_previene: ['Poliomielitis'],
        dosis: '1era dosis',
        numero_dosis: 1,
      },
      {
        nombre_vacuna: 'Neumococo',
        enfermedades_previene: ['Enfermedades graves producidas por el Neumococo en menores de 5 años'],
        dosis: '1era dosis',
        numero_dosis: 1,
      },
      {
        nombre_vacuna: 'Pentavalente',
        enfermedades_previene: [
          'Difteria',
          'Tétanos',
          'Tos Ferina',
          'Hepatitis B',
          'Enfermedades graves producidas por Haemophilus influenzae B',
        ],
        dosis: '1era dosis',
        numero_dosis: 1,
      },
    ],
  },
  {
    edad: '4 meses',
    edad_meses: 4,
    vacunas_aplicar: [
      {
        nombre_vacuna: 'Rotavirus',
        enfermedades_previene: ['Diarreas graves producidas por Rotavirus'],
        dosis: '2da dosis',
        numero_dosis: 2,
      },
      {
        nombre_vacuna: 'bOPV',
        enfermedades_previene: ['Poliomielitis'],
        dosis: '2da dosis',
        numero_dosis: 2,
      },
      {
        nombre_vacuna: 'Neumococo',
        enfermedades_previene: ['Enfermedades graves producidas por el Neumococo en menores de 5 años'],
        dosis: '2da dosis',
        numero_dosis: 2,
      },
      {
        nombre_vacuna: 'Pentavalente',
        enfermedades_previene: [
          'Difteria',
          'Tétanos',
          'Tos Ferina',
          'Hepatitis B',
          'Enfermedades graves producidas por Haemophilus influenzae B',
        ],
        dosis: '2da dosis',
        numero_dosis: 2,
      },
    ],
  },
  {
    edad: '6 meses',
    edad_meses: 6,
    vacunas_aplicar: [
      {
        nombre_vacuna: 'IPV',
        enfermedades_previene: ['Poliomielitis'],
        dosis: '3era dosis',
        numero_dosis: 3,
      },
      {
        nombre_vacuna: 'Pentavalente',
        enfermedades_previene: [
          'Difteria',
          'Tétanos',
          'Tos Ferina',
          'Hepatitis B',
          'Enfermedades graves producidas por Haemophilus influenzae B',
        ],
        dosis: '3era dosis',
        numero_dosis: 3,
      },
    ],
  },
  {
    edad: '12 meses',
    edad_meses: 12,
    vacunas_aplicar: [
      {
        nombre_vacuna: 'SRP',
        enfermedades_previene: ['Sarampión', 'Rubéola', 'Paperas'],
        dosis: '1era dosis',
        numero_dosis: 1,
      },
      {
        nombre_vacuna: 'Neumococo',
        enfermedades_previene: ['Enfermedades graves producidas por el neumococo en menores de 5 años'],
        dosis: 'Refuerzo',
        numero_dosis: 'R1',
      },
    ],
  },
  {
    edad: '18 meses',
    edad_meses: 18,
    vacunas_aplicar: [
      {
        nombre_vacuna: 'SRP',
        enfermedades_previene: ['Sarampión', 'Rubéola', 'Paperas'],
        dosis: '2da dosis',
        numero_dosis: 2,
      },
      {
        nombre_vacuna: 'OPV',
        enfermedades_previene: ['Poliomielitis'],
        dosis: '1er refuerzo',
        numero_dosis: 'R1',
      },
      {
        nombre_vacuna: 'DPT',
        enfermedades_previene: ['Difteria', 'Tétanos', 'Tos Ferina'],
        dosis: '1er refuerzo',
        numero_dosis: 'R1',
      },
    ],
  },
  {
    edad: '4 años',
    edad_meses: 48,
    vacunas_aplicar: [
      {
        nombre_vacuna: 'OPV',
        enfermedades_previene: ['Poliomielitis'],
        dosis: '2do refuerzo',
        numero_dosis: 'R2',
      },
      {
        nombre_vacuna: 'DPT',
        enfermedades_previene: ['Difteria', 'Tétanos', 'Tos Ferina'],
        dosis: '2do refuerzo',
        numero_dosis: 'R2',
      },
    ],
  },
];

async function main() {
  console.log('🚀 Iniciando seed completo...');

  
  console.log('📋 Creando vacunas...');
  const vaccineIds: Record<string, string> = {};

  for (const vaccine of vaccines) {
    const existingVaccine = await prisma.vaccine.findFirst({
      where: { name: vaccine.name }
    });

    if (!existingVaccine) {
      const createdVaccine = await prisma.vaccine.create({
        data: vaccine
      });
      vaccineIds[vaccine.name] = createdVaccine.idVaccine;
      console.log(`✓ Vacuna creada: ${vaccine.name}`);
    } else {
      vaccineIds[vaccine.name] = existingVaccine.idVaccine;
      console.log(`- Vacuna ya existe: ${vaccine.name}`);
    }
  }

  // Después crear los esquemas de vacunación
  console.log('📅 Creando esquemas de vacunación...');

  for (const etapa of esquema) {
    console.log(`Procesando etapa: ${etapa.edad}`);
    
    for (const vacuna of etapa.vacunas_aplicar) {
      const vaccineId = vaccineIds[vacuna.nombre_vacuna as keyof typeof vaccineIds];
      
      if (!vaccineId) {
        console.warn(`ID de vacuna no encontrado para: ${vacuna.nombre_vacuna}`);
        continue;
      }

      
      const esquemaExistente = await prisma.vaccineSchema.findFirst({
        where: {
          idVaccine: vaccineId,
          name: vacuna.dosis,
          age: etapa.edad_meses,
        }
      });

      if (!esquemaExistente) {
        await prisma.vaccineSchema.create({
          data: {
            idVaccine: vaccineId,
            name: vacuna.dosis,
            age: etapa.edad_meses,
            Description: vacuna.enfermedades_previene.join(', '),
            Doses: typeof vacuna.numero_dosis === 'number' ? vacuna.numero_dosis : 0,
          },
        });
        console.log(`✓ Esquema creado: ${vacuna.nombre_vacuna} - ${vacuna.dosis} (${etapa.edad})`);
      } else {
        console.log(`- Esquema ya existe: ${vacuna.nombre_vacuna} - ${vacuna.dosis} (${etapa.edad})`);
      }
    }
  }

  
  console.log('🏥 Creando centros médicos...');
  const clinics = [
    {
      name: 'Hospital Materno Infantil San Lorenzo de Los Mina',
      shortName: 'HMISLM',
      street: 'Av. Las Américas, Los Mina',
      city: 'Santo Domingo Este',
      municipality: 'Santo Domingo Este',
      phone: '809-568-1234',
      director: 'Dr. Manuel García',
      latitude: 18.4774,
      longitude: -69.8541,
      email: 'info@hmislm.gob.do',
      website: 'https://hmislm.gob.do'
    },
    {
      name: 'Centro de Salud Villa Mella',
      shortName: 'CSVM',
      street: 'Calle Principal, Villa Mella',
      city: 'Santo Domingo Norte',
      municipality: 'Santo Domingo Norte',
      phone: '809-568-5678',
      director: 'Dra. Carmen Rosario',
      latitude: 18.5089,
      longitude: -69.9478,
      email: 'villamella@sns.gob.do'
    },
    {
      name: 'Hospital Regional Dr. Antonio Musa',
      shortName: 'HRAM',
      street: 'Av. Independencia, San Pedro de Macorís',
      city: 'San Pedro de Macorís',
      municipality: 'San Pedro de Macorís',
      phone: '809-529-1234',
      director: 'Dr. Luis Santana',
      latitude: 18.4539,
      longitude: -69.2975,
      email: 'info@hram.gob.do'
    },
    {
      name: 'Centro de Salud La Romana',
      shortName: 'CSLR',
      street: 'Calle Duarte, La Romana',
      city: 'La Romana',
      municipality: 'La Romana',
      phone: '809-556-7890',
      director: 'Dra. María Torres',
      latitude: 18.4267,
      longitude: -68.9728,
      email: 'laromana@sns.gob.do'
    },
    {
      name: 'Hospital Regional José María Cabral y Báez',
      shortName: 'HRJMCB',
      street: 'Av. 27 de Febrero, Santiago',
      city: 'Santiago',
      municipality: 'Santiago',
      phone: '809-575-1234',
      director: 'Dr. Rafael Núñez',
      latitude: 19.4511,
      longitude: -70.6970,
      email: 'info@hrjmcb.gob.do',
      website: 'https://hrjmcb.gob.do'
    },
    {
      name: 'Centro de Salud Puerto Plata',
      shortName: 'CSPP',
      street: 'Calle José del Carmen Ariza, Puerto Plata',
      city: 'Puerto Plata',
      municipality: 'Puerto Plata',
      phone: '809-586-9876',
      director: 'Dr. Pedro Valdez',
      latitude: 19.7933,
      longitude: -70.6872,
      email: 'puertoplata@sns.gob.do'
    }
  ];

  const clinicIds: string[] = [];
  for (const clinic of clinics) {
    const existingClinic = await prisma.clinic.findFirst({
      where: { name: clinic.name }
    });

    if (!existingClinic) {
      const createdClinic = await prisma.clinic.create({
        data: clinic
      });
      clinicIds.push(createdClinic.idClinic);
      console.log(`✓ Centro médico creado: ${clinic.name}`);
    } else {
      clinicIds.push(existingClinic.idClinic);
      console.log(`- Centro médico ya existe: ${clinic.name}`);
    }
  }

  
  console.log('👥 Obteniendo roles...');
  const adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
  const doctorRole = await prisma.role.findFirst({ where: { name: 'Doctor' } });
  const guardianRole = await prisma.role.findFirst({ where: { name: 'Tutor' } });

  if (!adminRole || !doctorRole || !guardianRole) {
    console.error('❌ Los roles no están creados. Ejecuta primero el seed de roles.');
    return;
  }

  
  console.log('👤 Creando usuarios...');
  const securePassword = Bun.password.hashSync('password123');
  
  const users = [
    // Administradores
    {
      firstName: 'María',
      lastName: 'González',
      email: 'admin@vacunate.do',
      password: securePassword,
      identification: '00101234567',
      identificationType: 'IDCARD' as const,
      phone: '809-123-4567',
      city: 'Santo Domingo',
      municipality: 'Distrito Nacional',
      roleId: adminRole.idRole
    },
    // Doctores
    {
      firstName: 'Dr. Carlos',
      lastName: 'Rodríguez',
      email: 'carlos.rodriguez@vacunate.do',
      password: securePassword,
      identification: '00102345678',
      identificationType: 'IDCARD' as const,
      phone: '809-234-5678',
      city: 'Santo Domingo Este',
      municipality: 'Santo Domingo Este',
      roleId: doctorRole.idRole
    },
    {
      firstName: 'Dra. Ana',
      lastName: 'Martínez',
      email: 'ana.martinez@vacunate.do',
      password: securePassword,
      identification: '00103456789',
      identificationType: 'IDCARD' as const,
      phone: '809-345-6789',
      city: 'Santiago',
      municipality: 'Santiago',
      roleId: doctorRole.idRole
    },
    // Tutores/Padres
    {
      firstName: 'Luis',
      lastName: 'Pérez',
      email: 'luis.perez@email.com',
      password: securePassword,
      identification: '00104567890',
      identificationType: 'IDCARD' as const,
      phone: '809-456-7890',
      city: 'Santo Domingo Norte',
      municipality: 'Santo Domingo Norte',
      roleId: guardianRole.idRole
    },
    {
      firstName: 'Carmen',
      lastName: 'López',
      email: 'carmen.lopez@email.com',
      password: securePassword,
      identification: '00105678901',
      identificationType: 'IDCARD' as const,
      phone: '809-567-8901',
      city: 'San Pedro de Macorís',
      municipality: 'San Pedro de Macorís',
      roleId: guardianRole.idRole
    },
    {
      firstName: 'Roberto',
      lastName: 'Fernández',
      email: 'roberto.fernandez@email.com',
      password: securePassword,
      identification: '00106789012',
      identificationType: 'IDCARD' as const,
      phone: '809-678-9012',
      city: 'La Romana',
      municipality: 'La Romana',
      roleId: guardianRole.idRole
    },
    {
      firstName: 'Patricia',
      lastName: 'Jiménez',
      email: 'patricia.jimenez@email.com',
      password: securePassword,
      identification: '00107890123',
      identificationType: 'IDCARD' as const,
      phone: '809-789-0123',
      city: 'Puerto Plata',
      municipality: 'Puerto Plata',
      roleId: guardianRole.idRole
    }
  ];

  const userIds: string[] = [];
  const guardianIds: string[] = [];
  const doctorIds: string[] = [];

  for (const user of users) {
    const existingUser = await prisma.user.findFirst({
      where: { email: user.email }
    });

    if (!existingUser) {
      const createdUser = await prisma.user.create({
        data: user
      });
      userIds.push(createdUser.idUser);
      
      if (user.roleId === guardianRole.idRole) {
        guardianIds.push(createdUser.idUser);
      } else if (user.roleId === doctorRole.idRole) {
        doctorIds.push(createdUser.idUser);
      }
      
      console.log(`✓ Usuario creado: ${user.firstName} ${user.lastName} (${user.email})`);
    } else {
      userIds.push(existingUser.idUser);
      
      if (user.roleId === guardianRole.idRole) {
        guardianIds.push(existingUser.idUser);
      } else if (user.roleId === doctorRole.idRole) {
        doctorIds.push(existingUser.idUser);
      }
      
      console.log(`- Usuario ya existe: ${user.firstName} ${user.lastName} (${user.email})`);
    }
  }

  // Asociar doctores con clínicas
  console.log('🏥 Asociando doctores con clínicas...');
  for (let i = 0; i < doctorIds.length && i < clinicIds.length; i++) {
    const doctorId = doctorIds[i];
    const clinicId = clinicIds[i];
    
    if (!doctorId || !clinicId) continue;

    const existingAssociation = await prisma.userClinic.findFirst({
      where: {
        userId: doctorId,
        clinicId: clinicId
      }
    });

    if (!existingAssociation) {
      await prisma.userClinic.create({
        data: {
          userId: doctorId,
          clinicId: clinicId
        }
      });
      console.log(`✓ Doctor asociado con clínica`);
    }
  }

  
  console.log('👶 Creando niños...');
  const children = [
    {
      firstName: 'Sebastián',
      lastName: 'Pérez',
      identification: '03100012345',
      identificationType: 'IDCARD' as const,
      birthDate: new Date('2023-01-15'),
      gender: 'MALE' as const,
      nationality: 'Dominicana',
      city: 'Santo Domingo Norte',
      municipality: 'Santo Domingo Norte',
      guardianId: guardianIds[0]
    },
    {
      firstName: 'Isabella',
      lastName: 'López',
      identification: '03100023456',
      identificationType: 'IDCARD' as const,
      birthDate: new Date('2022-08-22'),
      gender: 'FEMALE' as const,
      nationality: 'Dominicana',
      city: 'San Pedro de Macorís',
      municipality: 'San Pedro de Macorís',
      guardianId: guardianIds[1]
    },
    {
      firstName: 'Diego',
      lastName: 'Fernández',
      identification: '03100034567',
      identificationType: 'IDCARD' as const,
      birthDate: new Date('2023-11-05'),
      gender: 'MALE' as const,
      nationality: 'Dominicana',
      city: 'La Romana',
      municipality: 'La Romana',
      guardianId: guardianIds[2]
    },
    {
      firstName: 'Sofía',
      lastName: 'Jiménez',
      identification: '03100045678',
      identificationType: 'IDCARD' as const,
      birthDate: new Date('2022-03-18'),
      gender: 'FEMALE' as const,
      nationality: 'Dominicana',
      city: 'Puerto Plata',
      municipality: 'Puerto Plata',
      guardianId: guardianIds[3]
    },
    {
      firstName: 'Mateo',
      lastName: 'Pérez',
      identification: '03100056789',
      identificationType: 'IDCARD' as const,
      birthDate: new Date('2024-06-10'),
      gender: 'MALE' as const,
      nationality: 'Dominicana',
      city: 'Santo Domingo Norte',
      municipality: 'Santo Domingo Norte',
      guardianId: guardianIds[0]
    }
  ];

  const childIds: string[] = [];

  for (const child of children) {
    const existingChild = await prisma.child.findFirst({
      where: {
        firstName: child.firstName,
        lastName: child.lastName,
        birthDate: child.birthDate
      }
    });

    if (!existingChild) {
      const { guardianId, ...childData } = child;
      const createdChild = await prisma.child.create({
        data: childData
      });
      childIds.push(createdChild.idChild);

      
      if (guardianId) {
        await prisma.guardianChild.create({
          data: {
            guardianId: guardianId,
            childId: createdChild.idChild,
            relationship: 'FATHER' as const
          }
        });
      }

      console.log(`✓ Niño creado: ${child.firstName} ${child.lastName}`);
    } else {
      childIds.push(existingChild.idChild);
      console.log(`- Niño ya existe: ${child.firstName} ${child.lastName}`);
    }
  }

  
  console.log('📅 Creando citas médicas...');
  const appointments = [
    {
      childId: childIds[0],
      userId: doctorIds[0] || guardianIds[0],
      clinicId: clinicIds[1],
      date: new Date('2025-07-15T09:00:00Z'),
      notes: 'Vacunación rutinaria - 18 meses',
      state: 'PENDING' as const
    },
    {
      childId: childIds[1],
      userId: doctorIds[1] || guardianIds[1],
      clinicId: clinicIds[2],
      date: new Date('2025-07-20T10:30:00Z'),
      notes: 'Vacunación rutinaria - 4 años',
      state: 'CONFIRMED' as const
    },
    {
      childId: childIds[2],
      userId: doctorIds[0] || guardianIds[2],
      clinicId: clinicIds[3],
      date: new Date('2025-07-25T11:00:00Z'),
      notes: 'Vacunación rutinaria - 12 meses',
      state: 'PENDING' as const
    },
    {
      childId: childIds[3],
      userId: doctorIds[1] || guardianIds[3],
      clinicId: clinicIds[5],
      date: new Date('2025-08-01T08:30:00Z'),
      notes: 'Vacunación rutinaria - 4 años',
      state: 'PENDING' as const
    },
    {
      childId: childIds[4],
      userId: doctorIds[0] || guardianIds[0],
      clinicId: clinicIds[1],
      date: new Date('2025-08-05T14:00:00Z'),
      notes: 'Vacunación rutinaria - 2 meses',
      state: 'CONFIRMED' as const
    }
  ];

  for (const appointment of appointments) {
    if (!appointment.childId || !appointment.userId || !appointment.clinicId) {
      console.log(`- Saltando cita por datos faltantes`);
      continue;
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        childId: appointment.childId,
        date: appointment.date
      }
    });

    if (!existingAppointment) {
      await prisma.appointment.create({
        data: {
          childId: appointment.childId,
          userId: appointment.userId,
          clinicId: appointment.clinicId,
          date: appointment.date,
          notes: appointment.notes,
          state: appointment.state
        }
      });
      console.log(`✓ Cita creada para fecha: ${appointment.date.toLocaleDateString()}`);
    } else {
      console.log(`- Cita ya existe para fecha: ${appointment.date.toLocaleDateString()}`);
    }
  }

  console.log('✅ Seed completo terminado exitosamente!');
  console.log('📊 Resumen de datos creados:');
  console.log(`- ${vaccines.length} vacunas`);
  console.log(`- ${esquema.length} etapas de esquemas de vacunación`);
  console.log(`- ${clinics.length} centros médicos`);
  console.log(`- ${users.length} usuarios`);
  console.log(`- ${children.length} niños`);
  console.log(`- ${appointments.length} citas médicas`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });