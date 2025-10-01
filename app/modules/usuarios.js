const db = require('./database');

function crearUsuario(usuario) {
  const stmt = db.prepare('INSERT INTO usuarios (id, dni, nombre, apellido, tipo, email, whatsapp, foto, estado, fechaAlta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(usuario.id, usuario.dni, usuario.nombre, usuario.apellido, usuario.tipo, usuario.email, usuario.whatsapp, usuario.foto, usuario.estado, usuario.fechaAlta);
}

function buscarUsuarioPorDNI(dni) {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE dni = ?');
  return stmt.get(dni);
}

module.exports = { crearUsuario, buscarUsuarioPorDNI };
