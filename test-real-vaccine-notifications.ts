import { checkUpcomingVaccines } from './src/jobs/vaccineNotifier';
import 'dotenv/config';

async function testRealVaccineNotifications() {
  console.log('🧪 Ejecutando notificaciones REALES de vacunas próximas...\n');
  console.log('⚠️  ATENCIÓN: Este test enviará correos reales a los tutores si hay vacunas próximas\n');

  try {
    await checkUpcomingVaccines();
    console.log('\n✅ Test de notificaciones reales completado');
  } catch (error) {
    console.error('❌ Error en el test:', error);
  }
}

testRealVaccineNotifications();
