// obtener elementos del DOM
const inputText = document.getElementById("inputText");
const targetLang = document.getElementById("targetLang");
const sendBtn = document.getElementById("sendBtn");
const botAnswer = document.getElementById("botAnswer");
const BACKEND_URL = "https://chatlingo-backend.onrender.com"(
  // limpiar placeholder inicial
  (botAnswer.innerHTML = "")
);

// manejar evento de click en el boton traducir
sendBtn.addEventListener("click", async () => {
  const texto = inputText.value.trim();
  const idioma = targetLang.value;

  // validar que hay texto para traducir
  if (!texto) {
    agregarMensaje("Por favor, escribe algo para traducir", "error");
    return;
  }

  // mostrar mensaje del usuario
  agregarMensaje(texto, "usuario");

  // mostrar mensaje de carga
  const mensajeCarga = agregarMensaje("Traduciendo...", "cargando");

  try {
    // llamar al endpoint de traduccion
    const response = await fetch(`${BACKEND_URL}/api/traducir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: texto,
        targetLang: idioma,
      }),
    });

    const data = await response.json();

    // eliminar mensaje de carga
    mensajeCarga.remove();

    // manejar respuesta del servidor
    if (response.ok) {
      agregarMensaje(data.translatedText, "bot");
      inputText.value = "";
    } else {
      agregarMensaje(data.error || "Error al traducir", "error");
    }
  } catch (error) {
    console.log(error);
    mensajeCarga.remove();
    agregarMensaje("Error de conexión, intenta de nuevo", "error");
  }
});

// permitir enviar con la tecla Enter
inputText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// funcion para agregar mensajes al historial
function agregarMensaje(mensaje, tipo) {
  const mensajeDiv = document.createElement("div");
  mensajeDiv.className = `mensaje mensaje--${tipo}`;

  const p = document.createElement("p");
  p.className = "mensaje__texto";
  p.textContent = mensaje;

  mensajeDiv.appendChild(p);
  botAnswer.appendChild(mensajeDiv);

  // scroll automatico hacia el ultimo mensaje
  botAnswer.scrollTop = botAnswer.scrollHeight;

  return mensajeDiv;
}
