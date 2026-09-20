/* =========================================================
   POLLITOS AL ATAQUE
   Menú principal y control de dificultad.
   ========================================================= */

let opcionSeleccionada = 0;
const dificultades = ["Fácil", "Normal", "Difícil"];
let dificultadActual = 1;
window.dificultadActual = dificultades[dificultadActual];

const menuPrincipal = document.getElementById("menu-principal");
const pantallaJuego = document.getElementById("pantalla-juego");
const botonJugar = document.getElementById("btn-jugar");
const botonDificultad = document.getElementById("btn-dificultad");
const botonSalir = document.getElementById("btn-salir");
const botonReiniciar = document.getElementById("btn-reiniciar");
const botonMenu = document.getElementById("btn-menu");
const textoDificultad = document.getElementById("dificultad-actual");
const elementoPuntos = document.getElementById("puntos");

let puntos = Number(localStorage.getItem("pollitosPuntos")) || 0;
if (elementoPuntos) {
    elementoPuntos.textContent = puntos;
}

function actualizarMenu() {
    const botones = document.querySelectorAll(".menu-button");
    botones.forEach((boton, indice) => {
        boton.classList.toggle("seleccionado", indice === opcionSeleccionada);
    });
}

function cambiarDificultad() {
    dificultadActual = (dificultadActual + 1) % dificultades.length;
    window.dificultadActual = dificultades[dificultadActual];

    if (textoDificultad) {
        textoDificultad.textContent = window.dificultadActual;
    }
}

function iniciarJuego() {
    if (menuPrincipal) {
        menuPrincipal.style.display = "none";
    }

    if (pantallaJuego) {
        pantallaJuego.style.display = "block";
    }

    const canvas = document.getElementById("canvas-juego");
    if (!canvas) {
        console.error("No se encontró el canvas del juego.");
        return;
    }

    if (window.juegoActual && typeof window.juegoActual.activo !== "undefined") {
        window.juegoActual.activo = false;
    }

    const juego = new Juego(canvas);
    window.juegoActual = juego;
    juego.iniciar();
}

/**
 * Reinicia la partida creando una nueva instancia del juego.
 */
function reiniciarJuego() {
    iniciarJuego();
}

/**
 * Detiene la partida actual y vuelve al menú principal.
 */
function volverAlMenu() {
    if (window.juegoActual) {
        window.juegoActual.activo = false;
        window.juegoActual.estado = "finalizado";
    }

    if (pantallaJuego) {
        pantallaJuego.style.display = "none";
    }

    if (menuPrincipal) {
        menuPrincipal.style.display = "block";
    }

    puntos = Number(localStorage.getItem("pollitosPuntos")) || 0;

    if (elementoPuntos) {
        elementoPuntos.textContent = puntos;
    }
}

if (botonJugar) {
    botonJugar.addEventListener("click", iniciarJuego);
}

if (botonDificultad) {
    botonDificultad.addEventListener("click", cambiarDificultad);
}

if (botonSalir) {
    botonSalir.addEventListener("click", () => {
        alert("Gracias por jugar a Pollitos al Ataque.");
    });
}

if (botonReiniciar) {
    botonReiniciar.addEventListener("click", reiniciarJuego);
}

if (botonMenu) {
    botonMenu.addEventListener("click", volverAlMenu);
}

document.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowDown") {
        opcionSeleccionada = (opcionSeleccionada + 1) % 3;
        actualizarMenu();
    }

    if (evento.key === "ArrowUp") {
        opcionSeleccionada = (opcionSeleccionada - 1 + 3) % 3;
        actualizarMenu();
    }

    if (evento.key === "Enter") {
        if (opcionSeleccionada === 0) {
            iniciarJuego();
        } else if (opcionSeleccionada === 1) {
            cambiarDificultad();
        } else if (opcionSeleccionada === 2) {
            botonSalir?.click();
        }
    }
});

if (textoDificultad) {
    textoDificultad.textContent = window.dificultadActual;
}

actualizarMenu();
console.log("Pollitos al Ataque iniciado correctamente.");
