const db = require('./database');

function registrarPrestamo(prestamo) {
  const stmt = db.prepare('INSERT INTO prestamos (inventario, usuario_id, fechaPrestamo, fechaDevolucionPrev, estado) VALUES (?, ?, ?, ?, ?)');
  stmt.run(prestamo.inventario, prestamo.usuario_id, prestamo.fechaPrestamo, prestamo.fechaDevolucionPrev, prestamo.estado);
}

function devolverPrestamo(id, fechaDevolucionReal) {
  const stmt = db.prepare('UPDATE prestamos SET fechaDevolucionReal = ?, estado = ? WHERE id = ?');
  stmt.run(fechaDevolucionReal, 'devuelto', id);
}

module.exports = { registrarPrestamo, devolverPrestamo };
