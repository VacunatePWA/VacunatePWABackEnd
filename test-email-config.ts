import { sendEmail } from './src/utils/email.service';
import 'dotenv/config';

async function testEmailConfiguration() {
  console.log('🧪 Probando configuración del sistema de correo...\n');

  // Mostrar variables de entorno (sin mostrar credenciales)
  console.log('📧 Configuración actual:');
  console.log(`  HOST: ${process.env.EMAIL_HOST || 'NO CONFIGURADO'}`);
  console.log(`  PORT: ${process.env.EMAIL_PORT || 'NO CONFIGURADO'}`);
  console.log(`  USER: ${process.env.EMAIL_USER || 'NO CONFIGURADO'}`);
  console.log(`  PASS: ${process.env.EMAIL_PASS ? '***configurado***' : 'NO CONFIGURADO'}`);
  console.log(`  FROM: ${process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'NO CONFIGURADO'}\n`);

  // Verificar si todas las variables están configuradas
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log('❌ Variables de entorno faltantes:', missingVars.join(', '));
    console.log('💡 Asegúrate de tener un archivo .env con estas variables configuradas');
    return;
  }

  // Intentar enviar un correo de prueba
  try {
    console.log('📤 Enviando correo de prueba...');
    
    const testEmail = process.env.TEST_EMAIL || process.env.EMAIL_USER || 'test@example.com';
    
    await sendEmail({
      to: testEmail,
      subject: '🧪 Test de configuración - Vacúnate RD',
      html: `
        <h2>✅ Sistema de correo funcionando correctamente</h2>
        <p>Este es un correo de prueba del sistema Vacúnate RD.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-DO')}</p>
        <p><strong>Configuración:</strong></p>
        <ul>
          <li>Host: ${process.env.EMAIL_HOST}</li>
          <li>Puerto: ${process.env.EMAIL_PORT}</li>
          <li>Usuario: ${process.env.EMAIL_USER}</li>
        </ul>
        <hr>
        <p><small>Este correo fue generado automáticamente para verificar la configuración del sistema.</small></p>
      `
    });

    console.log('✅ Correo de prueba enviado exitosamente');
    console.log(`📨 Destinatario: ${testEmail}`);

  } catch (error) {
    console.error('❌ Error al enviar correo de prueba:', error);
    console.log('\n💡 Posibles soluciones:');
    console.log('  - Verificar credenciales SMTP');
    console.log('  - Verificar que el servidor SMTP permita conexiones');
    console.log('  - Verificar que no haya firewall bloqueando el puerto');
  }
}

testEmailConfiguration();
