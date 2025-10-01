// Módulo de mensajería (WhatsApp, email, interno)
// Stubs para integración real con Twilio/SMTP

function enviarWhatsApp(numero, mensaje) {
  // Integrar con Twilio o WhatsApp Business API
  console.log(`WhatsApp a ${numero}: ${mensaje}`);
}

function enviarEmail(email, asunto, mensaje) {
  // Integrar con nodemailer/SMTP
  console.log(`Email a ${email}: ${asunto} - ${mensaje}`);
}

function enviarInterno(usuarioId, mensaje) {
  // Mensajería interna (guardar en DB, mostrar en bandeja)
  console.log(`Mensaje interno a ${usuarioId}: ${mensaje}`);
}

module.exports = { enviarWhatsApp, enviarEmail, enviarInterno };
