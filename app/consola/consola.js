const REPO = "usuario/repositorio"; // ⚠️ CAMBIAR
const BRANCH = "main";              // ⚠️ tu branch
const TOKEN = "ghp_xxxxx";          // ⚠️ token admin
const API = `https://api.github.com/repos/${REPO}/contents/reportes`;

async function cargarCopias() {
  const res = await fetch(API, { headers: { Authorization: `token ${TOKEN}` } });
  const archivos = await res.json();
  const tbody = document.querySelector("#tablaCopias tbody");
  tbody.innerHTML = "";
  for (let archivo of archivos) {
    if (!archivo.name.endsWith(".json")) continue;
    const dataRes = await fetch(archivo.download_url);
    const copia = await dataRes.json();
    const id = archivo.name.replace(".json", "");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${id}</td>
      <td>${copia.ultimaConexion}</td>
      <td>${copia.estado}</td>
      <td>${copia.version}</td>
      <td>
        <button class="mensaje" onclick="enviarComando('${id}','mostrarMensaje')">💬</button>
        <button class="bloquear" onclick="enviarComando('${id}','bloquear')">⛔</button>
        <button class="habilitar" onclick="enviarComando('${id}','habilitar')">✅</button>
        <button class="parche" onclick="enviarComando('${id}','parchear')">🛠</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

async function enviarComando(id, accion) {
  const url = `${API}/${id}.json`;
  const meta = await fetch(url, { headers: { Authorization: `token ${TOKEN}` } }).then(r => r.json());
  const sha = meta.sha;
  const dataRes = await fetch(meta.download_url);
  const data = await dataRes.json();
  data.comandoPendiente = {
    id: "cmd-" + Date.now(),
    accion,
    detalle: accion === "mostrarMensaje" ? prompt("Mensaje a mostrar:") : ""
  };
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Comando ${accion} para ${id}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
      sha
    })
  });
  if (res.ok) {
    alert(`Comando \"${accion}\" enviado a ${id}`);
    cargarCopias();
  } else {
    alert("Error al enviar comando");
  }
}

function filtrar() {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  document.querySelectorAll("#tablaCopias tbody tr").forEach(tr => {
    const txt = tr.textContent.toLowerCase();
    tr.style.display = txt.includes(filtro) ? "" : "none";
  });
}

cargarCopias();
