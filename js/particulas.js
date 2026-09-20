/**
 * Clase Particulas
 *
 * Genera partículas para explosiones, disparos e impactos.
 */
class Particulas {
    constructor(ctx) {
        this.ctx = ctx;
        this.lista = [];
    }

    crear(x, y, color, cantidad = 12, fuerza = 160) {
        for (let i = 0; i < cantidad; i++) {
            const angulo = (Math.PI * 2 * i) / cantidad + Math.random() * 0.8;
            const velocidad = (Math.random() * fuerza) + 30;

            this.lista.push({
                x,
                y,
                vx: Math.cos(angulo) * velocidad,
                vy: Math.sin(angulo) * velocidad,
                radio: 2 + Math.random() * 4,
                color,
                vida: 0.5 + Math.random() * 0.8,
                vidaActual: 0
            });
        }
    }

    actualizar(delta) {
        this.lista = this.lista.filter((particula) => {
            particula.x += particula.vx * delta;
            particula.y += particula.vy * delta;
            particula.vy += 220 * delta;
            particula.vidaActual += delta;
            return particula.vidaActual < particula.vida;
        });
    }

    dibujar() {
        this.lista.forEach((particula) => {
            const alpha = 1 - particula.vidaActual / particula.vida;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particula.color;
            this.ctx.beginPath();
            this.ctx.arc(particula.x, particula.y, particula.radio, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
}
