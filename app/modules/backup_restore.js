const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function respaldarBase(outputZipPath) {
  const dbPath = path.join(__dirname, '../db/biblioteca.db');
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve({ bytes: archive.pointer() }));
    archive.on('error', err => reject(err));
    archive.pipe(output);
    archive.file(dbPath, { name: 'biblioteca.db' });
    archive.finalize();
  });
}

function restaurarBase(zipPath, restoreDir) {
  // Implementación básica: descomprimir ZIP y reemplazar DB
  // Requiere validaciones y backup previo
}

module.exports = { respaldarBase, restaurarBase };
