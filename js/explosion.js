/**
 * Clase Explosion
 *
 * Representa una explosión del proyectil. Tiene un radio,
 * una duración y un efecto visual sencillo pero visible.
 */
class Explosion {
    constructor(x, y, radio, color = "#ffb347") {
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color;
        this.maxima = 0.7;
        this.tiempo = 0;
        this.activa = true;
    }

    /**
     * Actualiza la animación de la explosión.
     *
     * @param {number} delta
     */
    actualizar(delta) {
        this.tiempo += delta;

        if (this.tiempo >= this.maxima) {
            this.activa = false;
        }
    }

    /**
     * Dibuja la explosión con un efecto radial.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    dibujar(ctx) {
        if (!this.activa) {
            return;
        }

        const progreso = this.tiempo / this.maxima;
        const radioActual = this.radio * (0.2 + progreso * 1.6);

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1 - progreso;
        ctx.arc(this.x, this.y, radioActual, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.strokeStyle = "#fff1c4";
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, radioActual * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }
}
