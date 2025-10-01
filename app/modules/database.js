const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../db/biblioteca.db');
const db = new Database(dbPath);

// Esquema principal
const schema = `
CREATE TABLE IF NOT EXISTS salas (
  sala_id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS estanterias (
  estanteria_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sala_id INTEGER,
  nombre TEXT,
  FOREIGN KEY(sala_id) REFERENCES salas(sala_id)
);
CREATE TABLE IF NOT EXISTS anaqueles (
  anaquel_id INTEGER PRIMARY KEY AUTOINCREMENT,
  estanteria_id INTEGER,
  nombre TEXT,
  FOREIGN KEY(estanteria_id) REFERENCES estanterias(estanteria_id)
);
CREATE TABLE IF NOT EXISTS posiciones (
  posicion_id INTEGER PRIMARY KEY AUTOINCREMENT,
  anaquel_id INTEGER,
  posicion INTEGER,
  UNIQUE(anaquel_id, posicion),
  FOREIGN KEY(anaquel_id) REFERENCES anaqueles(anaquel_id)
);
CREATE TABLE IF NOT EXISTS libros (
  isbn TEXT,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  autores TEXT,
  editorial TEXT,
  año INTEGER,
  paginas INTEGER,
  descripcion TEXT,
  materias TEXT,
  PRIMARY KEY(isbn)
);
CREATE TABLE IF NOT EXISTS ejemplares (
  inventario TEXT PRIMARY KEY,
  isbn TEXT,
  no_ejemplar INTEGER,
  codigoBarra TEXT,
  qr TEXT,
  sala_id INTEGER,
  estanteria_id INTEGER,
  anaquel_id INTEGER,
  posicion_id INTEGER,
  estado TEXT,
  fechaIngreso TEXT,
  procedencia TEXT,
  foto TEXT,
  notas TEXT,
  FOREIGN KEY(isbn) REFERENCES libros(isbn),
  FOREIGN KEY(sala_id) REFERENCES salas(sala_id)
);
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  dni TEXT,
  nombre TEXT,
  apellido TEXT,
  tipo TEXT,
  email TEXT,
  whatsapp TEXT,
  foto TEXT,
  estado TEXT,
  fechaAlta TEXT
);
CREATE TABLE IF NOT EXISTS prestamos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventario TEXT,
  usuario_id TEXT,
  fechaPrestamo TEXT,
  fechaDevolucionPrev TEXT,
  fechaDevolucionReal TEXT,
  estado TEXT,
  excepcion TEXT,
  FOREIGN KEY(inventario) REFERENCES ejemplares(inventario),
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS numeracion (
  numeracion_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sala_id INTEGER,
  prefijo TEXT,
  siguiente INTEGER DEFAULT 1,
  UNIQUE(sala_id)
);
CREATE TABLE IF NOT EXISTS roles_permisos (
  role TEXT,
  recurso TEXT,
  permiso TEXT,
  PRIMARY KEY(role, recurso, permiso)
);
CREATE TABLE IF NOT EXISTS auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT,
  accion TEXT,
  fecha TEXT,
  modulo TEXT,
  detalles TEXT
);
CREATE TABLE IF NOT EXISTS import_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  origen TEXT,
  fecha TEXT,
  agregados INTEGER,
  errores INTEGER,
  detalles TEXT
);
`;
db.exec(schema);

module.exports = db;
