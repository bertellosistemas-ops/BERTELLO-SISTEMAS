const db = require('./database');

function prestamosPorPeriodo(fechaInicio, fechaFin) {
  const stmt = db.prepare('SELECT * FROM prestamos WHERE fechaPrestamo BETWEEN ? AND ?');
  return stmt.all(fechaInicio, fechaFin);
}

function librosMasPrestados(limit = 10) {
  const stmt = db.prepare('SELECT inventario, COUNT(*) as cantidad FROM prestamos GROUP BY inventario ORDER BY cantidad DESC LIMIT ?');
  return stmt.all(limit);
}

function usuariosActivos() {
  const stmt = db.prepare('SELECT usuario_id, COUNT(*) as cantidad FROM prestamos GROUP BY usuario_id ORDER BY cantidad DESC');
  return stmt.all();
}

module.exports = { prestamosPorPeriodo, librosMasPrestados, usuariosActivos };
