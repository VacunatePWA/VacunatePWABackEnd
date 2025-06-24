import cron from 'node-cron';
import { checkUpcomingVaccines } from './jobs/vaccineNotifier';

/**
 * Inicializa y programa todas las tareas cron de la aplicación.
 */
export const initializeCronJobs = () => {
  console.log('Inicializando tareas programadas (cron jobs)...');

  cron.schedule('0 8 * * *', () => {
    console.log('Disparando tarea programada: Notificación de Vacunas');
    checkUpcomingVaccines();
  });

  console.log('Tareas programadas inicializadas.');
}; 