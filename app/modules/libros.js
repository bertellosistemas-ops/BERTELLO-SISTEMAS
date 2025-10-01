const db = require('./database');

function crearLibro(libro) {
  const stmt = db.prepare('INSERT INTO libros (isbn, titulo, subtitulo, autores, editorial, año, paginas, descripcion, materias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(libro.isbn, libro.titulo, libro.subtitulo, libro.autores, libro.editorial, libro.año, libro.paginas, libro.descripcion, libro.materias);
}

function buscarLibroPorISBN(isbn) {
  const stmt = db.prepare('SELECT * FROM libros WHERE isbn = ?');
  return stmt.get(isbn);
}

module.exports = { crearLibro, buscarLibroPorISBN };
