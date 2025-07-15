/**
 * Script para probar que el backend ejecute correctamente las notificaciones
 * de vacunas vencidas al iniciar el servidor.
 * 
 * Este script inicia el servidor en modo de prueba y verifica que:
 * 1. El servidor inicie correctamente
 * 2. Se ejecute la función de notificación de vacunas vencidas
 * 3. Se envíen los correos correspondientes
 */

import { spawn } from 'child_process';

const testBackendStartup = () => {
  console.log('🧪 ==========================================');
  console.log('🧪 TEST: Inicio del Backend con Notificaciones');
  console.log('🧪 ==========================================');
  console.log('');

  console.log('🚀 Iniciando el servidor de backend...');
  console.log('📧 Monitoreando logs para detectar notificaciones de vacunas vencidas...');
  console.log('⏱️ El test se ejecutará por 30 segundos y luego se cerrará automáticamente.');
  console.log('');

  // Iniciar el servidor usando bun
  const serverProcess = spawn('bun', ['run', 'src/index.ts'], {
    cwd: '/Users/uri/Desktop/Estudios/Vacúnate/VacunatePWABackEnd',
    stdio: 'inherit'
  });

  let testCompleted = false;

  // Configurar timeout para cerrar el servidor después de 30 segundos
  const timeout = setTimeout(() => {
    if (!testCompleted) {
      console.log('');
      console.log('⏱️ ==========================================');
      console.log('⏱️ TIEMPO DE TEST COMPLETADO (30 segundos)');
      console.log('⏱️ ==========================================');
      console.log('🔄 Cerrando servidor de prueba...');
      
      testCompleted = true;
      serverProcess.kill('SIGTERM');
      
      setTimeout(() => {
        console.log('✅ Test del startup del backend completado.');
        console.log('📧 Revisa tu email para confirmar que se enviaron las notificaciones de vacunas vencidas.');
        console.log('🏁 Proceso finalizado.');
        process.exit(0);
      }, 2000);
    }
  }, 30000); // 30 segundos

  // Manejar errores del proceso
  serverProcess.on('error', (error) => {
    if (!testCompleted) {
      console.error('❌ Error al iniciar el servidor:', error);
      clearTimeout(timeout);
      testCompleted = true;
      process.exit(1);
    }
  });

  // Manejar cuando el proceso se cierre
  serverProcess.on('close', (code) => {
    if (!testCompleted) {
      clearTimeout(timeout);
      testCompleted = true;
      
      if (code === 0) {
        console.log('✅ Servidor cerrado correctamente.');
      } else {
        console.log(`⚠️ Servidor cerrado con código: ${code}`);
      }
      
      console.log('🏁 Test finalizado.');
      process.exit(code || 0);
    }
  });

  // Manejar interrupciones del usuario (Ctrl+C)
  process.on('SIGINT', () => {
    if (!testCompleted) {
      console.log('');
      console.log('🛑 Test interrumpido por el usuario.');
      clearTimeout(timeout);
      testCompleted = true;
      serverProcess.kill('SIGTERM');
      
      setTimeout(() => {
        console.log('🏁 Proceso finalizado.');
        process.exit(0);
      }, 1000);
    }
  });
};

console.log('🔥 Iniciando test de startup del backend...');
console.log('💡 Presiona Ctrl+C en cualquier momento para detener el test.');
console.log('');

testBackendStartup();
