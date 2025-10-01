const db = require('./database');

function asignarUbicacion(inventario, sala_id, estanteria_id, anaquel_id, posicion_id) {
  const stmt = db.prepare('UPDATE ejemplares SET sala_id = ?, estanteria_id = ?, anaquel_id = ?, posicion_id = ? WHERE inventario = ?');
  stmt.run(sala_id, estanteria_id, anaquel_id, posicion_id, inventario);
}

function obtenerUbicacion(inventario) {
  const stmt = db.prepare('SELECT sala_id, estanteria_id, anaquel_id, posicion_id FROM ejemplares WHERE inventario = ?');
  return stmt.get(inventario);
}

module.exports = { asignarUbicacion, obtenerUbicacion };
