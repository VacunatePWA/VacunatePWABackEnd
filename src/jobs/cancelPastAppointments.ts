import prisma from '../db/prisma';

/**
 * Cancela automáticamente las citas cuya fecha ya pasó y aún están en estado PENDING.
 */
export async function cancelPastAppointmentsJob() {
  const now = new Date();
  const updated = await prisma.appointment.updateMany({
    where: {
      date: { lt: now },
      active: true
    },
    data: {
    }
  });
  if (updated.count > 0) {
    console.log(`Citas canceladas automáticamente: ${updated.count}`);
  }
}
