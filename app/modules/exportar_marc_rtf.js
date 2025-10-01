// Exportar libros en formato MARC y RTF
const fs = require('fs');
const db = require('./database');

// Exportar MARC (simplificado, solo campos básicos)
function exportarLibrosMARC(outputPath) {
  const rows = db.prepare('SELECT * FROM libros').all();
  let marc = '';
  rows.forEach(r => {
    marc += 'LDR    00000nam  2200000   4500\n';
    if (r.isbn) marc += `020    $a${r.isbn}\n`;
    if (r.titulo) marc += `245    $a${r.titulo}\n`;
    if (r.autores) marc += `100    $a${r.autores}\n`;
    if (r.editorial) marc += `260    $b${r.editorial}\n`;
    if (r.año) marc += `260    $c${r.año}\n`;
    if (r.notas) marc += `500    $a${r.notas}\n`;
    if (r.coleccion) marc += `490    $a${r.coleccion}\n`;
    marc += '\n';
  });
  fs.writeFileSync(outputPath, marc);
}

// Exportar RTF (tabular)
function exportarLibrosRTF(outputPath) {
  const rows = db.prepare('SELECT * FROM libros').all();
  let rtf = '{\rtf1\ansi\deff0\n';
  rtf += '{\b ISBN}\tab{\b Título}\tab{\b Autor}\tab{\b Editorial}\tab{\b Año}\tab{\b Notas}\tab{\b Colección}\par\n';
  rows.forEach(r => {
    rtf += `${r.isbn || ''}\tab${r.titulo || ''}\tab${r.autores || ''}\tab${r.editorial || ''}\tab${r.año || ''}\tab${r.notas || ''}\tab${r.coleccion || ''}\par\n`;
  });
  rtf += '}';
  fs.writeFileSync(outputPath, rtf);
}

module.exports = {
  exportarLibrosMARC,
  exportarLibrosRTF
};
