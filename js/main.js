/* =========================================================
   POLLITOS AL ATAQUE
   Archivo principal del juego
   ========================================================= */


/* ---------------------------------------------------------
   VARIABLES DEL MENÚ
   --------------------------------------------------------- */

// Índice de la opción actualmente seleccionada.
//
// 0 = Jugar
// 1 = Dificultad
// 2 = Salir
let opcionSeleccionada = 0;


// Dificultades disponibles.
const dificultades = [
    "Fácil",
    "Normal",
    "Difícil"
];


// Dificultad actual.
//
// Comenzamos en Normal.
let dificultadActual = 1;


/* ---------------------------------------------------------
   ELEMENTOS HTML
   --------------------------------------------------------- */

const menuPrincipal =
    document.getElementById("menu-principal");

const pantallaJuego =
    document.getElementById("pantalla-juego");

const botonJugar =
    document.getElementById("btn-jugar");

const botonDificultad =
    document.getElementById("btn-dificultad");

const botonSalir =
    document.getElementById("btn-salir");

const textoDificultad =
    document.getElementById("dificultad");


/* ---------------------------------------------------------
   SISTEMA DE PUNTOS
   --------------------------------------------------------- */

// Recuperamos los puntos guardados anteriormente.
//
// Si todavía no existen, comenzamos en 0.
let puntos =
    Number(localStorage.getItem("pollitosPuntos")) || 0;


// Mostramos los puntos en pantalla.
document.getElementById("puntos").textContent = puntos;


/* ---------------------------------------------------------
   ACTUALIZAR OPCIÓN DEL MENÚ
   --------------------------------------------------------- */

function actualizarMenu() {

    const botones =
        document.querySelectorAll(".menu button");


    botones.forEach((boton, indice) => {

        boton.classList.toggle(
            "seleccionado",
            indice === opcionSeleccionada
        );

    });
}


/* ---------------------------------------------------------
   CAMBIAR DIFICULTAD
   --------------------------------------------------------- */

function cambiarDificultad() {

    dificultadActual++;

    // Si llegamos al final, volvemos a Fácil.
    if (dificultadActual >= dificultades.length) {
        dificultadActual = 0;
    }

    textoDificultad.textContent =
        dificultades[dificultadActual];

}


/* ---------------------------------------------------------
   INICIAR JUEGO
   --------------------------------------------------------- */

function iniciarJuego() {

    console.log(
        "Iniciando juego con dificultad:",
        dificultades[dificultadActual]
    );

    menuPrincipal.style.display = "none";

    pantallaJuego.style.display = "block";

    pantallaJuego.innerHTML = `
        <h2>🐔 Preparando la batalla...</h2>

        <p>
            🪱 Gusanos vs 🐔 Pollos
        </p>

        <p>
            Dificultad:
            ${dificultades[dificultadActual]}
        </p>
    `;
}


/* ---------------------------------------------------------
   EVENTOS DE LOS BOTONES
   --------------------------------------------------------- */

botonJugar.addEventListener(
    "click",
    iniciarJuego
);


botonDificultad.addEventListener(
    "click",
    cambiarDificultad
);


botonSalir.addEventListener(
    "click",
    () => {

        alert(
            "Gracias por jugar a Pollitos al Ataque."
        );

    }
);


/* ---------------------------------------------------------
   CONTROLES DEL MENÚ CON TECLADO
   --------------------------------------------------------- */

document.addEventListener(
    "keydown",
    (evento) => {

        /*
         * Flecha abajo:
         * mueve la selección hacia abajo.
         */
        if (evento.key === "ArrowDown") {

            opcionSeleccionada++;

            if (opcionSeleccionada > 2) {
                opcionSeleccionada = 0;
            }

            actualizarMenu();
        }


        /*
         * Flecha arriba:
         * mueve la selección hacia arriba.
         */
        if (evento.key === "ArrowUp") {

            opcionSeleccionada--;

            if (opcionSeleccionada < 0) {
                opcionSeleccionada = 2;
            }

            actualizarMenu();
        }


        /*
         * ENTER:
         * ejecuta la opción seleccionada.
         */
        if (evento.key === "Enter") {

            if (opcionSeleccionada === 0) {

                iniciarJuego();

            } else if (opcionSeleccionada === 1) {

                cambiarDificultad();

            } else if (opcionSeleccionada === 2) {

                botonSalir.click();

            }

        }

    }
);


/* ---------------------------------------------------------
   INICIALIZACIÓN
   --------------------------------------------------------- */

// Marcamos "Jugar" como primera opción.
actualizarMenu();

console.log(
    "Pollitos al Ataque iniciado correctamente."
);