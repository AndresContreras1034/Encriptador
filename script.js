// Elementos del DOM
const archivoInput = document.getElementById("archivo");
const algoritmoSelect = document.getElementById("algoritmo");
const claveInput = document.getElementById("clave");
const modoSelect = document.getElementById("modo");
const btnEncriptar = document.getElementById("btn-encriptar");
const resultadoArea = document.getElementById("resultado");
const descargarBtn = document.getElementById("descargar-btn");

// Leer archivo
function leerArchivo(archivo, callback) {
  const lector = new FileReader();
  lector.onload = () => callback(lector.result);
  lector.onerror = () => alert("❌ Error al leer el archivo.");
  lector.readAsText(archivo);
}

// Cifrado César
function cifradoCesar(texto, desplazamiento, desencriptar = false) {
  const desplaz = desencriptar ? -desplazamiento : desplazamiento;
  return texto.replace(/[a-z]/gi, (letra) => {
    const base = letra === letra.toUpperCase() ? 65 : 97;
    return String.fromCharCode(
      ((letra.charCodeAt(0) - base + desplaz + 26) % 26) + base
    );
  });
}

// Procesar texto según algoritmo
function procesarTexto(texto) {
  const algoritmo = algoritmoSelect.value;
  const clave = claveInput.value.trim();
  const modo = modoSelect.value;

  switch (algoritmo) {
    case "aes":
      if (!clave) return "🔐 Debes ingresar una clave para AES.";
      try {
        return modo === "encriptar"
          ? CryptoJS.AES.encrypt(texto, clave).toString()
          : CryptoJS.AES.decrypt(texto, clave).toString(CryptoJS.enc.Utf8) || "❌ Clave incorrecta o texto inválido.";
      } catch {
        return "❌ Error durante la operación AES.";
      }

    case "base64":
      try {
        return modo === "encriptar" ? btoa(texto) : atob(texto);
      } catch {
        return "❌ Error en la operación Base64.";
      }

    case "cesar":
      const desplazamiento = parseInt(clave);
      if (isNaN(desplazamiento)) return "🔑 Ingresa un número como clave para César.";
      return cifradoCesar(texto, desplazamiento, modo === "desencriptar");

    default:
      return "❓ Algoritmo no reconocido.";
  }
}

// Procesar archivo
btnEncriptar.addEventListener("click", (e) => {
  e.preventDefault(); // 🚫 Evita que se recargue la página

  const archivo = archivoInput.files[0];
  if (!archivo) {
    alert("📁 Debes seleccionar un archivo.");
    return;
  }

  leerArchivo(archivo, (contenido) => {
    const resultado = procesarTexto(contenido);
    resultadoArea.value = resultado;
  });
});

// Descargar resultado
descargarBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const contenido = resultadoArea.value;
  if (!contenido) {
    alert("⚠️ No hay nada que descargar.");
    return;
  }

  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "resultado.txt";
  enlace.click();
});
