const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function crearBackup(outputZipPath, filesToInclude = []) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve({ bytes: archive.pointer() }));
    archive.on('error', err => reject(err));
    archive.pipe(output);
    filesToInclude.forEach(f => {
      if (fs.existsSync(f)) archive.file(f, { name: path.basename(f) });
    });
    archive.finalize();
  });
}

module.exports = { crearBackup };
