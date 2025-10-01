// Módulo flexible para importar libros desde MARC, RTF, CSV, Excel
const fs = require('fs');
const path = require('path');
// Parser básico MARC ISO
const xlsx = require('xlsx'); // Debes instalar xlsx

function detectarFormato(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.mrc' || ext === '.marc') return 'marc';
  if (ext === '.rtf') return 'rtf';
  if (ext === '.csv') return 'csv';
  if (ext === '.xls' || ext === '.xlsx') return 'excel';
  return 'desconocido';
}

function importarLibros(filePath, opciones = {}) {
  const formato = detectarFormato(filePath);
  switch (formato) {
    case 'marc':
  return importarDesdeMARC(filePath, opciones);
    case 'rtf':
      return importarDesdeRTF(filePath, opciones);
    case 'csv':
      return importarDesdeCSV(filePath, opciones);
    case 'excel':
      return importarDesdeExcel(filePath, opciones);
    default:
      throw new Error('Formato no soportado');
  }
}

function importarDesdeMARC(filePath, opciones) {
  // Parser básico para registros MARC ISO
  const raw = fs.readFileSync(filePath, 'utf8');
  const records = [];
  // Separar por registros (doble salto de línea)
  const marcRecords = raw.split(/\n\s*\n/);
  marcRecords.forEach(rec => {
    const lines = rec.split(/\n/).map(l => l.trim()).filter(l => l);
    let obj = { isbn: '', titulo: '', autores: '', editorial: '', año: '', notas: '', coleccion: '' };
    lines.forEach(line => {
      if (line.startsWith('020')) obj.isbn = extraerSubcampo(line, 'a');
      if (line.startsWith('245')) obj.titulo = extraerSubcampo(line, 'a');
      if (line.startsWith('100')) obj.autores = extraerSubcampo(line, 'a');
      if (line.startsWith('260')) {
        obj.editorial = extraerSubcampo(line, 'b');
        obj.año = extraerSubcampo(line, 'c');
      }
      if (line.startsWith('500')) obj.notas = extraerSubcampo(line, 'a');
      if (line.startsWith('490')) obj.coleccion = extraerSubcampo(line, 'a');
    });
    if (obj.isbn || obj.titulo) records.push(obj);
  });
  return records;
}

function extraerSubcampo(line, sub) {
  const match = line.match(new RegExp('\$' + sub + '([^$]+)'));
  return match ? match[1].trim() : '';
}

function importarDesdeRTF(filePath, opciones) {
  // Extrae datos tabulares de RTF (simplificado)
  const rtf = fs.readFileSync(filePath, 'utf8');
  // Aquí deberías usar una librería de parsing RTF real
  // Simulación: busca líneas tipo CSV
  const lines = rtf.split(/\r?\n/).filter(l => l.includes(','));
  return lines.map(line => {
    const [isbn, titulo, autores, editorial, año] = line.split(',');
    return { isbn, titulo, autores, editorial, año };
  });
}

function importarDesdeCSV(filePath, opciones) {
  const csv = fs.readFileSync(filePath, 'utf8');
  const lines = csv.split(/\r?\n/).filter(l => l.trim());
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = cols[i] || ''; });
    return obj;
  });
}

function importarDesdeExcel(filePath, opciones) {
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data; // Array de objetos con campos
}

module.exports = { importarLibros, detectarFormato };
