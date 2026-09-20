/**
 * Clase Terreno
 *
 * Define las plataformas y el fondo del mapa.
 */
class Terreno {
    constructor(ctx, ancho, alto) {
        this.ctx = ctx;
        this.ancho = ancho;
        this.alto = alto;
        this.plataformas = [
            // Plataformas inferiores: sirven como base de la arena.
            { x: 0, y: 500, ancho: 190, alto: 100 },
            { x: 230, y: 445, ancho: 190, alto: 155 },
            { x: 470, y: 510, ancho: 180, alto: 90 },
            { x: 700, y: 445, ancho: 200, alto: 155 },
            { x: 950, y: 500, ancho: 250, alto: 100 },

            // Plataformas intermedias.
            { x: 80, y: 370, ancho: 180, alto: 25 },
            { x: 330, y: 315, ancho: 150, alto: 25 },
            { x: 600, y: 370, ancho: 180, alto: 25 },
            { x: 900, y: 315, ancho: 170, alto: 25 },
            { x: 1090, y: 390, ancho: 100, alto: 25 },

            // Plataformas superiores: crean rutas y posiciones elevadas.
            { x: 20, y: 245, ancho: 125, alto: 22 },
            { x: 215, y: 185, ancho: 155, alto: 22 },
            { x: 1110, y: 145, ancho: 75, alto: 22 }
        ];
    }

    dibujar() {
        const ctx = this.ctx;

        ctx.fillStyle = "#7b5c33";
        ctx.fillRect(0, 530, this.ancho, 70);

        this.plataformas.forEach((plataforma) => {
            ctx.fillStyle = "#70482f";
            ctx.fillRect(plataforma.x, plataforma.y, plataforma.ancho, plataforma.alto);

            ctx.fillStyle = "#3f7a46";
            ctx.fillRect(plataforma.x, plataforma.y, plataforma.ancho, 10);

            ctx.fillStyle = "#96613c";
            for (let x = plataforma.x + 15; x < plataforma.x + plataforma.ancho; x += 35) {
                ctx.fillRect(x, plataforma.y + 25, 12, 6);
            }
        });

        ctx.fillStyle = "#0b3854";
        ctx.fillRect(0, 530, this.ancho, 70);

        ctx.strokeStyle = "#4fc3dc";
        ctx.lineWidth = 2;
        for (let x = 0; x < this.ancho; x += 55) {
            ctx.beginPath();
            ctx.moveTo(x, 550);
            ctx.quadraticCurveTo(x + 14, 542, x + 28, 550);
            ctx.quadraticCurveTo(x + 42, 558, x + 55, 550);
            ctx.stroke();
        }
    }
}