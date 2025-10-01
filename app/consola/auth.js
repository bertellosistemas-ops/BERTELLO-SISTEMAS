function login() {
  const clave = document.getElementById("clave").value;
  if (clave === "2003") {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
    cargarCopias();
  } else {
    alert("Clave incorrecta");
  }
}
