const bwipjs = require('bwip-js');
const fs = require('fs');
const path = require('path');

function generarEtiqueta(inventario, ubicacion, outputPath) {
  bwipjs.toBuffer({
    bcid:        'code128',
    text:        inventario,
    scale:       3,
    height:      10,
    includetext: true,
    textxalign:  'center',
  }, function (err, png) {
    if (err) throw err;
    fs.writeFileSync(outputPath, png);
  });
}

module.exports = { generarEtiqueta };
