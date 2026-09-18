
/* =========================================================
   POLLITOS AL ATAQUE
   Archivo: juego.js

   Responsabilidad:
   Controlar el Canvas y el ciclo principal del juego.
   ========================================================= */


/**
 * Clase principal del juego.
 *
 * Se encarga de:
 * - Crear el Canvas.
 * - Obtener el contexto de dibujo.
 * - Actualizar el juego.
 * - Dibujar el escenario.
 */
class Juego {

    constructor(canvas) {

        // Guardamos el Canvas.
        this.canvas = canvas;

        // Contexto 2D utilizado para dibujar.
        this.ctx = canvas.getContext("2d");

        // Tamaño lógico de nuestra cancha.
        this.ancho = 800;
        this.alto = 600;

        // Configuramos el tamaño del Canvas.
        this.canvas.width = this.ancho;
        this.canvas.height = this.alto;

        // Control del ciclo de animación.
        this.ultimoTiempo = 0;

        // Objeto encargado del terreno.
        this.terreno = new Terreno(
            this.ctx,
            this.ancho,
            this.alto
        );

        // Estado inicial.
        this.activo = false;
    }


    /**
     * Inicia el juego.
     */
    iniciar() {

        this.activo = true;

        this.ultimoTiempo = performance.now();

        requestAnimationFrame(
            (tiempo) => this.bucle(tiempo)
        );
    }


    /**
     * Bucle principal del juego.
     *
     * Este método se ejecuta aproximadamente
     * 60 veces por segundo.
     */
    bucle(tiempoActual) {

        if (!this.activo) {
            return;
        }

        // Calculamos cuánto tiempo pasó desde
        // el último fotograma.
        const delta =
            (tiempoActual - this.ultimoTiempo) / 1000;

        this.ultimoTiempo = tiempoActual;


        // Actualizamos los elementos.
        this.actualizar(delta);


        // Dibujamos los elementos.
        this.dibujar();


        // Solicitamos el siguiente fotograma.
        requestAnimationFrame(
            (tiempo) => this.bucle(tiempo)
        );
    }


    /**
     * Actualiza la lógica del juego.
     */
    actualizar(delta) {

        // Por ahora el terreno es estático.
        // Posteriormente aquí agregaremos:
        //
        // - Gusanos
        // - Pollos
        // - Gravedad
        // - Movimiento
        // - Proyectiles
        // - IA
        // - Turnos
    }


    /**
     * Dibuja todos los elementos.
     */
    dibujar() {

        const ctx = this.ctx;

        // Limpiamos la pantalla.
        ctx.clearRect(
            0,
            0,
            this.ancho,
            this.alto
        );


        // Dibujamos el cielo.
        this.dibujarCielo();


        // Dibujamos el terreno.
        this.terreno.dibujar();
    }


    /**
     * Dibuja el fondo del escenario.
     */
    dibujarCielo() {

        const ctx = this.ctx;

        // Creamos un degradado vertical.
        const degradado =
            ctx.createLinearGradient(
                0,
                0,
                0,
                this.alto
            );

        degradado.addColorStop(
            0,
            "#071a30"
        );

        degradado.addColorStop(
            1,
            "#173b55"
        );


        ctx.fillStyle = degradado;

        ctx.fillRect(
            0,
            0,
            this.ancho,
            this.alto
        );


        // Luna.
        ctx.fillStyle = "#ffe8a3";

        ctx.beginPath();

        ctx.arc(
            700,
            80,
            30,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Estrellas.
        ctx.fillStyle = "#ffffff";

        for (let i = 0; i < 40; i++) {

            const x =
                (i * 137) % this.ancho;

            const y =
                (i * 71) % 280;

            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }
    }
}