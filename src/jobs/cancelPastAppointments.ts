import prisma from '../db/prisma';

/**
 * Cancela automáticamente las citas cuya fecha ya pasó y aún están en estado PENDING.
 */
export async function cancelPastAppointmentsJob() {
  const now = new Date();
  const updated = await prisma.appointment.updateMany({
    where: {
      date: { lt: now },
      state: 'PENDING', // Usar 'state' en vez de 'status'
      active: true
    },
    data: {
      state: 'CANCELLED' // Usar 'CANCELLED' según el enum
    }
  });
  if (updated.count > 0) {
    console.log(`Citas canceladas automáticamente: ${updated.count}`);
  }
}
