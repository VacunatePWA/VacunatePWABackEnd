import cron from 'node-cron';
import { checkUpcomingVaccines } from './jobs/vaccineNotifier';

/**
 * Inicializa y programa todas las tareas cron de la aplicación.
 */
export const initializeCronJobs = () => {
  console.log('Inicializando tareas programadas (cron jobs)...');

  // Programar la tarea para que se ejecute todos los días a las 8:00 AM.
  // El formato cron es: minuto, hora, día del mes, mes, día de la semana.
  // '0 8 * * *' = a las 08:00 de cada día.
  cron.schedule('0 8 * * *', () => {
    console.log('Disparando tarea programada: Notificación de Vacunas');
    checkUpcomingVaccines();
  });

  console.log('Tareas programadas inicializadas.');
}; 