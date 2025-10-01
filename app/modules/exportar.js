// Módulo para exportar libros y usuarios en formatos compatibles (CSV, Excel)
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx'); // Debes instalar xlsx
const db = require('./database');

function exportarLibrosCSV(outputPath) {
  const rows = db.prepare('SELECT * FROM libros').all();
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => (r[h] || '').toString().replace(/,/g, ' ')).join(','))).join('\n');
  fs.writeFileSync(outputPath, csv);
}

function exportarLibrosExcel(outputPath) {
  const rows = db.prepare('SELECT * FROM libros').all();
  const ws = xlsx.utils.json_to_sheet(rows);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Libros');
  xlsx.writeFile(wb, outputPath);
}

function exportarUsuariosCSV(outputPath) {
  const rows = db.prepare('SELECT * FROM usuarios').all();
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => (r[h] || '').toString().replace(/,/g, ' ')).join(','))).join('\n');
  fs.writeFileSync(outputPath, csv);
}

function exportarUsuariosExcel(outputPath) {
  const rows = db.prepare('SELECT * FROM usuarios').all();
  const ws = xlsx.utils.json_to_sheet(rows);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Usuarios');
  xlsx.writeFile(wb, outputPath);
}

module.exports = {
  exportarLibrosCSV,
  exportarLibrosExcel,
  exportarUsuariosCSV,
  exportarUsuariosExcel
};
