/**
 * Paso de tiempo máximo (en segundos) que se aplica en un fotograma.
 *
 * requestAnimationFrame puede entregar un fotograma muy tarde: la pestaña
 * estuvo en segundo plano, el navegador se quedó bloqueado calculando la
 * trayectoria de la IA, hubo una recolección de basura, etc.
 *
 * Si ese tiempo se aplicara completo, la gravedad desplazaría a TODOS los
 * personajes varios miles de píxeles en un solo paso: atravesarían las
 * plataformas, caerían fuera del mapa y la partida terminaría sola.
 * Limitando el paso se pierde algo de tiempo de juego, nunca el terreno.
 */
const PASO_MAXIMO_DELTA = 1 / 30;

/**
 * Clase Juego
 *
 * Motor principal del juego.
 */
class Juego {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        // El mundo es más ancho, pero conserva la altura original.
        this.ancho = 1200;
        this.alto = 600;
        this.canvas.width = this.ancho;
        this.canvas.height = this.alto;

        this.dificultad = window.dificultadActual || "Normal";
        this.ultimoTiempo = 0;
        this.activo = false;
        this.estado = "jugando";
        this.resultado = null;
        this.enPausa = false;
        this.turnoFinalizado = false;
        this.viento = 8;
        this.teclas = {};
        this.mousePresionado = false;
        this.terreno = new Terreno(this.ctx, this.ancho, this.alto);
        this.particulas = new Particulas(this.ctx);
        this.explosiones = [];
        this.proyectiles = [];
        this.pollos = [
            new Pollo("Pollo 1", 90, 300),
            new Pollo("Pollo 2", 145, 300),
            new Pollo("Pollo 3", 205, 300)
        ];
        this.gusanos = [
            new Gusano("Gusano 1", 680, 300),
            new Gusano("Gusano 2", 620, 300),
            new Gusano("Gusano 3", 560, 300)
        ];

        this.configurarPosicionesIniciales();
        this.turnos = new Turnos(this);
        this.ia = new IA(this);
        this.interfaz = new Interfaz(this);

        this.configurarEventos();
        this.turnos.iniciarTurnoActual();
    }

    configurarEventos() {
        window.addEventListener("keydown", (evento) => {
            this.teclas[evento.key] = true;
            if (evento.key === "Escape") {
                this.enPausa = !this.enPausa;
            }
        });

        window.addEventListener("keyup", (evento) => {
            this.teclas[evento.key] = false;

            // Detener inmediatamente al pollo activo cuando se suelta
            // cualquiera de las teclas de movimiento.
            if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(evento.key)) {
                const actual = this.turnos.getActual();
                if (actual && actual.esJugador) {
                    actual.detener();
                }
            }
        });

        // Si la ventana pierde el foco, ninguna tecla debe quedarse
        // marcada como presionada ni dejar un pollo moviéndose solo.
        window.addEventListener("blur", () => {
            this.teclas = {};
            this.pollos.forEach((pollo) => pollo.detener());
        });

        this.canvas.addEventListener("mousedown", (evento) => {
            if (evento.button !== 0 || this.resultado) return;
            const actual = this.turnos.getActual();
            if (!actual || !actual.esJugador || !actual.vivo || actual.disparoRealizado) return;

            actual.canon.iniciarCarga();
            this.mousePresionado = true;
        });

        this.canvas.addEventListener("mouseup", (evento) => {
            if (evento.button !== 0 || this.resultado) return;
            const actual = this.turnos.getActual();
            if (!actual || !actual.esJugador || !actual.vivo || actual.disparoRealizado) return;

            const proyectil = actual.canon.soltarCarga();
            if (proyectil) {
                proyectil.viento = this.viento;
                this.proyectiles.push(proyectil);
                this.particulas.crear(actual.x, actual.y - 10, "#f5e6a4", 10, 110);
                actual.disparoRealizado = true;
            }

            this.mousePresionado = false;
        });
    }

    iniciar() {
        this.activo = true;
        this.ultimoTiempo = performance.now();
        requestAnimationFrame((tiempo) => this.bucle(tiempo));
    }

    bucle(tiempoActual) {
        if (!this.activo) return;

        const tiempoTranscurrido = (tiempoActual - this.ultimoTiempo) / 1000;
        this.ultimoTiempo = tiempoActual;

        // Nunca se aplica un paso de tiempo gigantesco: un fotograma que
        // llegó muy tarde (pestaña en segundo plano, cálculo pesado de la
        // IA, etc.) no puede hacer que la gravedad atraviese el terreno.
        const delta = Math.max(
            0,
            Math.min(tiempoTranscurrido, PASO_MAXIMO_DELTA)
        );

        this.actualizar(delta);
        this.dibujar();

        requestAnimationFrame((tiempo) => this.bucle(tiempo));
    }

    actualizar(delta) {
        // Si la partida ya terminó (un equipo completo eliminado) no se
        // actualiza nada: controles, IA, disparos, movimiento y turnos
        // quedan congelados.
        if (this.estado === "finalizado" || this.resultado) {
            return;
        }

        if (this.enPausa) {
            return;
        }

        this.actualizarViento();
        this.particulas.actualizar(delta);

        this.explosiones.forEach((explosion) => explosion.actualizar(delta));
        this.explosiones = this.explosiones.filter((explosion) => explosion.activa);

        const actual = this.turnos.getActual();
        if (actual && actual.esJugador && actual.vivo) {
            this.controlJugador(delta);
        }

        // Ningún personaje conserva velocidad horizontal si no es su turno.
        // Es imprescindible para los gusanos: si un gusano se estaba moviendo
        // cuando terminó su turno, seguía avanzando solo, se salía de la
        // plataforma y moría al caer al agua. Al morir los tres gusanos de
        // esa forma la partida terminaba "sola", sin que el jugador hubiera
        // eliminado a nadie.
        this.pollos.forEach((pollo) => {
            if (pollo !== actual) {
                pollo.detener();
            }
        });

        this.gusanos.forEach((gusano) => {
            if (gusano !== actual) {
                gusano.detener();
            }
        });

        if (actual && !actual.esJugador && actual.vivo) {
            this.ia.actualizar(delta);
        }

        this.pollos.forEach((pollo) => pollo.actualizar(delta, this.terreno));
        this.gusanos.forEach((gusano) => gusano.actualizar(delta, this.terreno));

        this.proyectiles.forEach((proyectil) => proyectil.actualizar(delta, this));
        this.proyectiles = this.proyectiles.filter((proyectil) => proyectil.activo);

        // El cronómetro SOLO cierra el turno actual. Nunca termina la partida.
        this.turnos.actualizar(delta);

        if (this.turnoFinalizado) {
            this.turnos.avanzar();
            this.turnoFinalizado = false;
        }

        // Única comprobación autorizada para terminar la partida.
        this.comprobarFinPartida();
    }

    actualizarViento() {
        if (Math.random() < 0.008) {
            this.viento += (Math.random() - 0.5) * 10;
            this.viento = Math.max(-20, Math.min(20, this.viento));
        }
    }

    /**
     * Genera posiciones iniciales separadas y apoyadas sobre plataformas.
     *
     * Se utiliza una lista de candidatos construida a partir de la parte
     * superior de cada plataforma. Así ningún personaje aparece en el agua
     * ni fuera de los límites del canvas.
     */
    configurarPosicionesIniciales() {
        const personajes = [...this.pollos, ...this.gusanos];
        const radio = personajes[0].radio;
        const candidatos = [];

        this.terreno.plataformas.forEach((plataforma) => {
            const margen = radio + 8;
            const inicio = plataforma.x + margen;
            const final = plataforma.x + plataforma.ancho - margen;

            if (final <= inicio) {
                return;
            }

            const separaciones = Math.max(
                2,
                Math.floor((final - inicio) / 45)
            );

            for (let indice = 0; indice <= separaciones; indice++) {
                const proporcion = indice / separaciones;
                candidatos.push({
                    x: inicio + (final - inicio) * proporcion,
                    y: plataforma.y - radio
                });
            }
        });

        candidatos.sort(() => Math.random() - 0.5);

        const posiciones = [];
        const distanciaMinima = 72;

        personajes.forEach((personaje) => {
            const disponibles = candidatos.filter((candidato) => {
                return posiciones.every((posicion) => {
                    return Math.hypot(
                        candidato.x - posicion.x,
                        candidato.y - posicion.y
                    ) >= distanciaMinima;
                });
            });

            const opciones = disponibles.length ? disponibles : candidatos;
            const posicion = opciones[Math.floor(Math.random() * opciones.length)];

            posiciones.push(posicion);
            personaje.x = posicion.x;
            personaje.y = posicion.y;
            personaje.velocidadX = 0;
            personaje.velocidadY = 0;
            personaje.enSuelo = false;
        });
    }

    controlJugador(delta) {
        const actual = this.turnos.getActual();
        if (!actual || !actual.esJugador || !actual.vivo) return;

        if (this.teclas["ArrowLeft"] || this.teclas["a"] || this.teclas["A"]) {
            actual.moverIzquierda();
        } else if (this.teclas["ArrowRight"] || this.teclas["d"] || this.teclas["D"]) {
            actual.moverDerecha();
        } else {
            actual.detener();
        }

        if (this.teclas[" "] || this.teclas["Space"]) {
            actual.saltar();
        }

        if (this.teclas["ArrowUp"] || this.teclas["w"] || this.teclas["W"]) {
            actual.canon.aumentarAngulo();
        }

        if (this.teclas["ArrowDown"] || this.teclas["s"] || this.teclas["S"]) {
            actual.canon.disminuirAngulo();
        }

        if (this.mousePresionado) {
            actual.canon.cargar(delta);
        }
    }

    generarExplosion(x, y, radio, color = "#ffb347") {
        this.explosiones.push(new Explosion(x, y, radio, color));
        this.particulas.crear(x, y, color, 18, 200);
        this.aplicarDanioPorExplosion(x, y, radio);
    }

    aplicarDanioPorExplosion(x, y, radio) {
        const personajes = [...this.pollos, ...this.gusanos];
        personajes.forEach((personaje) => {
            if (!personaje || !personaje.vivo) return;
            const distancia = Math.hypot(personaje.x - x, personaje.y - y);
            if (distancia < radio) {
                const dano = 100 * (1 - distancia / radio);
                personaje.recibirDanio(dano);
            }
        });
    }

    /**
     * Devuelve los personajes vivos de un equipo.
     *
     * Un personaje está vivo cuando existe, tiene vivo === true y
     * vida > 0. Se usa la misma condición en todo el motor para que el
     * conteo de turnos y el final de partida nunca se contradigan.
     *
     * @param {Array} equipo Lista de personajes (pollos o gusanos).
     * @returns {Array} Personajes vivos del equipo.
     */
    obtenerVivos(equipo) {
        return (equipo || []).filter(
            (personaje) => personaje && personaje.vivo && personaje.vida > 0
        );
    }

    /**
     * ÚNICA función autorizada a terminar la partida.
     *
     * La partida SOLO puede finalizar cuando un equipo completo ha sido
     * eliminado:
     *
     * - pollosVivos === 0  -> ganan los gusanos (derrota).
     * - gusanosVivos === 0 -> ganan los pollitos (victoria).
     *
     * Con al menos un pollo vivo y al menos un gusano vivo la partida
     * continúa, sin importar lo que ocurra con el resto: muerte de uno o
     * dos personajes, caída al agua, fin del turno, fin del cronómetro de
     * 10 segundos, fin de la trayectoria de un proyectil, explosión, la IA
     * sin encontrar disparo, la IA sin poder moverse o la inactividad del
     * jugador.
     *
     * @returns {boolean} true si la partida terminó en esta comprobación.
     */
    comprobarFinPartida() {
        if (this.estado === "finalizado" || this.resultado) {
            return true;
        }

        const pollosVivos = this.obtenerVivos(this.pollos).length;
        const gusanosVivos = this.obtenerVivos(this.gusanos).length;

        if (pollosVivos === 0) {
            // Ganan los gusanos.
            this.finalizarPartida("derrota");
            return true;
        }

        if (gusanosVivos === 0) {
            // Ganan los pollitos.
            this.finalizarPartida("victoria");
            return true;
        }

        // Ambas condiciones anteriores son falsas:
        // quedan pollos y gusanos vivos, así que la partida continúa.
        return false;
    }

    /**
     * Congela la partida y muestra la pantalla final existente.
     *
     * Esta función SOLO acepta un final legítimo: que el equipo contrario
     * se haya quedado sin personajes vivos. Cualquier otra llamada se
     * ignora, de modo que ninguna otra parte del juego puede terminar la
     * partida por una condición incorrecta.
     *
     * @param {string} resultado "victoria" (pollitos) o "derrota" (gusanos).
     */
    finalizarPartida(resultado) {
        if (this.estado === "finalizado" || this.resultado) {
            return;
        }

        const pollosVivos = this.obtenerVivos(this.pollos).length;
        const gusanosVivos = this.obtenerVivos(this.gusanos).length;

        const esVictoriaValida = resultado === "victoria" && gusanosVivos === 0;
        const esDerrotaValida = resultado === "derrota" && pollosVivos === 0;

        if (!esVictoriaValida && !esDerrotaValida) {
            // La partida no termina por ninguna otra condición.
            return;
        }

        this.estado = "finalizado";
        this.resultado = resultado;
        this.activo = false;
        this.turnoFinalizado = true;
        this.mousePresionado = false;
        this.enPausa = false;
        this.teclas = {};

        // Se detiene la IA.
        this.ia.estado = "inactivo";
        this.ia.gusanoActual = null;
        this.ia.objetivoActual = null;
        this.ia.puntoMovimiento = null;
        this.ia.direccionMovimiento = 0;

        // Se congela el cronómetro y los turnos.
        this.turnos.detener();

        // Ningún personaje puede moverse ni actuar.
        this.pollos.forEach((pollo) => pollo.detener());
        this.gusanos.forEach((gusano) => gusano.detener());

        const puntosPorDificultad = {
            "Fácil": 100,
            "Normal": 250,
            "Difícil": 500
        };

        const puntosGanados = resultado === "victoria"
            ? puntosPorDificultad[this.dificultad] || 250
            : 0;

        if (puntosGanados > 0) {
            const puntosActuales = Number(
                localStorage.getItem("pollitosPuntos")
            ) || 0;

            localStorage.setItem(
                "pollitosPuntos",
                String(puntosActuales + puntosGanados)
            );
        }

        this.interfaz.mostrarPantallaFinal(
            resultado,
            puntosGanados
        );
    }

    dibujar() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.ancho, this.alto);

        const graduado = ctx.createLinearGradient(0, 0, 0, this.alto);
        graduado.addColorStop(0, "#071a30");
        graduado.addColorStop(1, "#173b55");
        ctx.fillStyle = graduado;
        ctx.fillRect(0, 0, this.ancho, this.alto);

        ctx.fillStyle = "#ffe8a3";
        ctx.beginPath();
        ctx.arc(700, 80, 30, 0, Math.PI * 2);
        ctx.fill();

        this.terreno.dibujar();
        this.pollos.forEach((pollo) => pollo.dibujar(ctx));
        this.gusanos.forEach((gusano) => gusano.dibujar(ctx));
        this.proyectiles.forEach((proyectil) => proyectil.dibujar(ctx));
        this.explosiones.forEach((explosion) => explosion.dibujar(ctx));
        this.particulas.dibujar();
        this.interfaz.dibujar(ctx);
    }
} 