const bcrypt = require('bcryptjs');
const db = require('./database');

function crearOperadorPrincipal(usuario, clave) {
  const hash = bcrypt.hashSync(clave, 10);
  const stmt = db.prepare('INSERT INTO usuarios (id, dni, nombre, apellido, tipo, email, whatsapp, foto, estado, fechaAlta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(usuario.id, usuario.dni, usuario.nombre, usuario.apellido, 'OperadorPrincipal', usuario.email, usuario.whatsapp, usuario.foto, usuario.estado, usuario.fechaAlta);
  db.prepare('INSERT INTO roles_permisos (role, recurso, permiso) VALUES (?, ?, ?)').run('OperadorPrincipal', 'todos', 'admin');
  db.prepare('INSERT INTO usuarios_claves (id, hash) VALUES (?, ?)').run(usuario.id, hash);
}

function verificarClave(id, clave) {
  const stmt = db.prepare('SELECT hash FROM usuarios_claves WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return false;
  return bcrypt.compareSync(clave, row.hash);
}

module.exports = { crearOperadorPrincipal, verificarClave };
