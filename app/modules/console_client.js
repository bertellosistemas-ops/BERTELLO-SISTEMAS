const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const REPO = "usuario/repositorio"; // <--- CAMBIAR
const BRANCH = "main";              // <--- CAMBIAR
const TOKEN = "ghp_xxxxx";          // <--- CAMBIAR
const ID_COPIA = "PC-LAB-01";       // <--- cada copia debe tener su ID único
const ARCHIVO_LOCAL = path.join(__dirname, "../ultimo_reporte.txt");
const API = `https://api.github.com/repos/${REPO}/contents/reportes/${ID_COPIA}.json`;

let ultimoComando = null;

async function init() {
  const ahora = new Date();
  let ultimaSubida = null;
  if (fs.existsSync(ARCHIVO_LOCAL)) {
    ultimaSubida = new Date(fs.readFileSync(ARCHIVO_LOCAL, "utf8"));
  }
  if (!ultimaSubida || (ahora - ultimaSubida) > 24 * 60 * 60 * 1000) {
    await enviarReporte();
    fs.writeFileSync(ARCHIVO_LOCAL, ahora.toISOString());
  }
  await revisarComandos();
}

function generarReporte(comandoPendiente = null, resultado = null) {
  return {
    ultimaConexion: new Date().toISOString(),
    estado: fs.existsSync(path.join(__dirname, "../bloqueado.lock")) ? "bloqueado" : "activo",
    version: "1.0.0",
    comandoPendiente: comandoPendiente || null,
    ultimoComando: resultado || ultimoComando
  };
}

async function enviarReporte(data = null) {
  if (!data) data = generarReporte();
  let sha = null;
  let meta = await fetch(API, { headers: { Authorization: `token ${TOKEN}` } });
  if (meta.ok) {
    const j = await meta.json();
    sha = j.sha;
  }
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const res = await fetch(API, {
    method: "PUT",
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Reporte automático de ${ID_COPIA}`,
      content,
      branch: BRANCH,
      sha
    })
  });
  if (!res.ok) {
    console.error("❌ Error al subir reporte", await res.text());
  } else {
    console.log("✅ Reporte enviado");
  }
}

async function revisarComandos() {
  const res = await fetch(API, { headers: { Authorization: `token ${TOKEN}` } });
  if (!res.ok) return;
  const meta = await res.json();
  const data = await fetch(meta.download_url).then(r => r.json());
  if (data.comandoPendiente) {
    console.log("📩 Comando recibido:", data.comandoPendiente);
    const resultado = await ejecutarComando(data.comandoPendiente);
    ultimoComando = {
      id: data.comandoPendiente.id,
      resultado: resultado.ok ? "OK" : "ERROR",
      detalle: resultado.msg
    };
    delete data.comandoPendiente;
    await enviarReporte(data);
  }
}

async function ejecutarComando(cmd) {
  try {
    switch (cmd.accion) {
      case "mostrarMensaje":
        console.log("💬 MOSTRAR:", cmd.detalle);
        return { ok: true, msg: "Mensaje mostrado" };
      case "bloquear":
        fs.writeFileSync(path.join(__dirname, "../bloqueado.lock"), "1");
        return { ok: true, msg: "Programa bloqueado" };
      case "habilitar":
        const lock = path.join(__dirname, "../bloqueado.lock");
        if (fs.existsSync(lock)) fs.unlinkSync(lock);
        return { ok: true, msg: "Programa habilitado" };
      case "parchear":
        console.log("🛠 Aplicar parche:", cmd.detalle);
        return { ok: true, msg: "Parche aplicado (simulado)" };
      default:
        return { ok: false, msg: "Acción desconocida" };
    }
  } catch (err) {
    return { ok: false, msg: err.message };
  }
}

init();
setInterval(() => { enviarReporte(); }, 24 * 60 * 60 * 1000);
