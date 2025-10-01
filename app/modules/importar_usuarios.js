// Módulo flexible para importar usuarios desde Excel y CSV
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx'); // Debes instalar xlsx

function detectarFormatoUsuarios(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.csv') return 'csv';
  if (ext === '.xls' || ext === '.xlsx') return 'excel';
  return 'desconocido';
}

function importarUsuarios(filePath, opciones = {}) {
  const formato = detectarFormatoUsuarios(filePath);
  switch (formato) {
    case 'csv':
      return importarDesdeCSV(filePath, opciones);
    case 'excel':
      return importarDesdeExcel(filePath, opciones);
    default:
      throw new Error('Formato no soportado');
  }
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

module.exports = { importarUsuarios, detectarFormatoUsuarios };
