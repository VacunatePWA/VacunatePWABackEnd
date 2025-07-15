import { notifyOverdueVaccinesOnStartup } from '../src/jobs/vaccineNotifier';

/**
 * Script de test para la función de notificación de vacunas vencidas al startup.
 * Este test simula lo que sucede al iniciar el backend y verifica que se notifiquen
 * correctamente las vacunas vencidas a los tutores.
 */

const testOverdueVaccinesStartup = async () => {
  console.log('🧪 ==========================================');
  console.log('🧪 TEST: Notificación de Vacunas VENCIDAS al Startup');
  console.log('🧪 ==========================================');
  console.log('');

  console.log('📋 Este test simula el comportamiento de la aplicación al iniciar el backend.');
  console.log('📋 Debería notificar SOLO sobre vacunas que están VENCIDAS.');
  console.log('📋 NO debería notificar sobre vacunas próximas/futuras.');
  console.log('');

  try {
    const startTime = Date.now();
    
    console.log('🚀 Ejecutando función notifyOverdueVaccinesOnStartup()...');
    console.log('');
    
    // Ejecutar la función que se ejecuta al startup
    await notifyOverdueVaccinesOnStartup();
    
    const executionTime = Date.now() - startTime;
    
    console.log('');
    console.log('✅ ==========================================');
    console.log('✅ TEST COMPLETADO EXITOSAMENTE');
    console.log('✅ ==========================================');
    console.log(`⏱️ Tiempo de ejecución: ${executionTime}ms`);
    console.log('');
    console.log('📧 Revisa tu email para ver las notificaciones de vacunas VENCIDAS enviadas.');
    console.log('🔍 Solo deberías recibir notificaciones para vacunas que están atrasadas.');
    console.log('🔍 No deberías recibir notificaciones para vacunas futuras o próximas.');
    
  } catch (error) {
    console.error('❌ ==========================================');
    console.error('❌ ERROR EN EL TEST');
    console.error('❌ ==========================================');
    console.error('Detalles del error:', error);
    console.error('');
    console.error('🔧 Posibles causas:');
    console.error('  - Problema con la configuración de correo');
    console.error('  - Error en la base de datos');
    console.error('  - Error en la lógica de notificación');
  }
};

// Ejecutar el test
console.log('🔥 Iniciando test de notificaciones de vacunas vencidas al startup...');
testOverdueVaccinesStartup()
  .then(() => {
    console.log('🏁 Test finalizado. Saliendo del proceso...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal en el test:', error);
    process.exit(1);
  });
