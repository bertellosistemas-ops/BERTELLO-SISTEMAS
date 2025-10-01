const db = require('./database');

function logAudit(usuario, accion, modulo, detalles = '') {
  const stmt = db.prepare('INSERT INTO auditoria (usuario, accion, fecha, modulo, detalles) VALUES (?, ?, ?, ?, ?)');
  stmt.run(usuario, accion, new Date().toISOString(), modulo, detalles);
}

module.exports = { logAudit };
