import prisma from '../db/prisma';
import { differenceInMonths } from 'date-fns';
import { sendEmail } from '../utils/email.service';

/**
 * Busca niños que necesiten una vacuna próximamente y notifica a sus tutores.
 */
export const checkUpcomingVaccines = async () => {
  console.log('Ejecutando tarea de notificación de vacunas...');

  try {
    const children = await prisma.child.findMany({
      where: { active: true },
      include: {
        guardianChildren: {
          where: { active: true },
          include: {
            guardian: true, // Incluye los datos del tutor (User)
          },
        },
        records: {
          where: { active: true },
          include: {
            vaccine: true,
          },
        },
      },
    });

    const vaccineSchemas = await prisma.vaccineSchema.findMany({
      where: { active: true },
      include: { vaccine: true },
    });

    for (const child of children) {
      if (!child.guardianChildren.length) continue; // Si no tiene tutor, saltar

      const ageInMonths = differenceInMonths(new Date(), new Date(child.birthDate));
      const appliedVaccineIds = new Set(child.records.map(r => r.vaccineId));

      for (const schema of vaccineSchemas) {
        // ¿La vacuna del esquema ya fue aplicada?
        if (appliedVaccineIds.has(schema.vaccine.idVaccine)) continue;

        // ¿El niño está en la edad correcta para esta vacuna?
        // Notificaremos si la edad del niño está dentro del mes para la vacuna.
        if (ageInMonths === schema.age) {
          const firstGuardianRelation = child.guardianChildren[0];
          if (firstGuardianRelation && firstGuardianRelation.guardian && firstGuardianRelation.guardian.email) {
            const tutor = firstGuardianRelation.guardian;
            console.log(`Notificando al tutor ${tutor.email} sobre la vacuna ${schema.vaccine.name} para ${child.firstName}`);

            await sendEmail({
              to: tutor.email,
              subject: `Recordatorio de Vacunación para ${child.firstName}`,
              html: `
                <p>Hola ${tutor.firstName},</p>
                <p>Te recordamos que a tu hijo/a <strong>${child.firstName} ${child.lastName}</strong> le corresponde la vacuna <strong>${schema.vaccine.name}</strong> este mes.</p>
                <p>Por favor, agenda una cita en tu centro de salud más cercano.</p>
                <br>
                <p>Atentamente,<br>El equipo de Vacúnate RD</p>
              `,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error en la tarea de notificación de vacunas:', error);
  } finally {
    console.log('Tarea de notificación de vacunas finalizada.');
  }
}; 