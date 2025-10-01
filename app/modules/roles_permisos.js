const db = require('./database');

function asignarPermiso(role, recurso, permiso) {
  const stmt = db.prepare('INSERT OR IGNORE INTO roles_permisos (role, recurso, permiso) VALUES (?, ?, ?)');
  stmt.run(role, recurso, permiso);
}

function verificarPermiso(role, recurso, permiso) {
  const stmt = db.prepare('SELECT 1 FROM roles_permisos WHERE role = ? AND recurso = ? AND permiso = ?');
  return !!stmt.get(role, recurso, permiso);
}

module.exports = { asignarPermiso, verificarPermiso };
