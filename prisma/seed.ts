import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// Esquema nacional de inmunización (República Dominicana, 2021)
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
  console.log('Iniciando seed del esquema de vacunación...');

  for (const etapa of esquema) {
    console.log(`Procesando etapa: ${etapa.edad}`);
    
    for (const vacuna of etapa.vacunas_aplicar) {
      const vaccineId = vaccineIds[vacuna.nombre_vacuna as keyof typeof vaccineIds];
      
      if (!vaccineId) {
        console.warn(`ID de vacuna no encontrado para: ${vacuna.nombre_vacuna}`);
        continue;
      }

      // Verificar si ya existe este esquema
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

  console.log('✅ Seed del esquema completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });