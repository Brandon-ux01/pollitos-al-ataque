/**
 * Clase Interfaz
 *
 * Muestra el HUD y la información de turno.
 */
class Interfaz {
    constructor(juego) {
        this.juego = juego;
        this.pantallaFinal = document.getElementById("pantalla-final");
        this.tituloResultado = document.getElementById("resultado-titulo");
        this.mensajeResultado = document.getElementById("resultado-mensaje");
        this.puntosResultado = document.getElementById("resultado-puntos");

        // Cada nueva partida comienza sin la pantalla de resultado.
        this.ocultarPantallaFinal();
    }

    dibujar(ctx) {
        const actual = this.juego.turnos.getActual();
        const nombreActual = actual ? actual.nombre : "Sin turno";
        const equipoActual = actual && actual.esJugador ? "🐔" : "🪱";

        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(8, 8, 250, 140);

        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("POLLITOS AL ATAQUE", 18, 28);
        ctx.fillText(`Turno: ${equipoActual} ${nombreActual}`, 18, 52);
        ctx.fillText(`Tiempo: ${Math.max(0, Math.ceil(this.juego.turnos.tiempoRestante))}`, 18, 78);
        ctx.fillText(`Ángulo: ${Math.round(actual ? actual.canon.angulo : 0)}°`, 18, 104);
        ctx.fillText(`Potencia: ${Math.round(actual ? actual.canon.potencia : 0)}`, 18, 130);

        ctx.fillText(`Viento: ${this.juego.viento > 0 ? "→" : "←"} ${Math.abs(this.juego.viento)}`, 560, 28);
    }

    /**
     * Muestra la pantalla final sobre el canvas.
     *
     * @param {string} resultado Resultado: victoria o derrota.
     * @param {number} puntos Puntos obtenidos en la partida.
     */
    mostrarPantallaFinal(resultado, puntos) {
        if (!this.pantallaFinal) {
            return;
        }

        const ganoElJugador = resultado === "victoria";

        this.tituloResultado.textContent = ganoElJugador
            ? "🐔 ¡VICTORIA! 🐔"
            : "🪱 ¡DERROTA! 🪱";

        this.mensajeResultado.textContent = ganoElJugador
            ? "¡LOS POLLITOS GANARON!"
            : "¡LOS GUSANOS GANARON!";

        this.puntosResultado.textContent = ganoElJugador
            ? `Puntos obtenidos: +${puntos}`
            : "";

        this.pantallaFinal.hidden = false;
    }

    /**
     * Oculta la pantalla final al comenzar otra partida.
     */
    ocultarPantallaFinal() {
        if (this.pantallaFinal) {
            this.pantallaFinal.hidden = true;
        }
    }
}
