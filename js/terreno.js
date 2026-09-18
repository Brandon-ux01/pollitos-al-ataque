/* =========================================================
   POLLITOS AL ATAQUE
   Archivo: terreno.js

   Responsabilidad:
   Crear y dibujar las plataformas del escenario.
   ========================================================= */


/**
 * Representa el terreno de la cancha.
 */
class Terreno {

    constructor(ctx, ancho, alto) {

        this.ctx = ctx;

        this.ancho = ancho;

        this.alto = alto;


        /*
         * Cada plataforma contiene:
         *
         * x     = posición horizontal
         * y     = posición vertical
         * ancho = longitud
         * alto  = grosor
         */
        this.plataformas = [

            {
                x: 0,
                y: 500,
                ancho: 150,
                alto: 100
            },

            {
                x: 185,
                y: 445,
                ancho: 145,
                alto: 155
            },

            {
                x: 365,
                y: 510,
                ancho: 135,
                alto: 90
            },

            {
                x: 535,
                y: 445,
                ancho: 115,
                alto: 155
            },

            {
                x: 680,
                y: 500,
                ancho: 120,
                alto: 100
            },


            // Plataformas superiores.

            {
                x: 75,
                y: 350,
                ancho: 140,
                alto: 25
            },

            {
                x: 285,
                y: 305,
                ancho: 120,
                alto: 25
            },

            {
                x: 470,
                y: 350,
                ancho: 120,
                alto: 25
            },

            {
                x: 650,
                y: 315,
                ancho: 105,
                alto: 25
            }
        ];
    }


    /**
     * Dibuja todas las plataformas.
     */
    dibujar() {

        const ctx = this.ctx;


        this.plataformas.forEach(
            (plataforma) => {

                this.dibujarPlataforma(
                    plataforma
                );

            }
        );


        // Dibujamos agua debajo del escenario.
        this.dibujarAgua();
    }


    /**
     * Dibuja una plataforma individual.
     */
    dibujarPlataforma(plataforma) {

        const ctx = this.ctx;


        // Tierra.
        ctx.fillStyle = "#70482f";

        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            plataforma.alto
        );


        // Césped.
        ctx.fillStyle = "#3f7a46";

        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            10
        );


        // Detalles de la tierra.
        ctx.fillStyle = "#96613c";

        for (
            let x = plataforma.x + 15;
            x < plataforma.x + plataforma.ancho;
            x += 35
        ) {

            ctx.fillRect(
                x,
                plataforma.y + 25,
                12,
                6
            );
        }
    }


    /**
     * Dibuja el agua debajo de las plataformas.
     */
    dibujarAgua() {

        const ctx = this.ctx;

        ctx.fillStyle = "#0b3854";

        ctx.fillRect(
            0,
            530,
            this.ancho,
            70
        );


        // Ondas del agua.
        ctx.strokeStyle = "#4fc3dc";

        ctx.lineWidth = 2;


        for (
            let x = 0;
            x < this.ancho;
            x += 55
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                550
            );

            ctx.quadraticCurveTo(
                x + 14,
                542,
                x + 28,
                550
            );

            ctx.quadraticCurveTo(
                x + 42,
                558,
                x + 55,
                550
            );

            ctx.stroke();
        }
    }
}