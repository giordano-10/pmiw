const ANCHO = 800;
const ALTO = 400;


const RUTA_JUGADOR = "assets/jugador.png";
const RUTAS_ENEMIGOS = [
  "assets/enemigo1.png",
  "assets/enemigo2.png",
  "assets/enemigo3.png"
];
const RUTA_PARED = "assets/pared.png";
const RUTA_FONDO = "assets/fondo.png";

const RUTAS_HISTORIA = [
  "assets/historia1.jpg",
  "assets/historia2.jpg"
];
const TEXTOS_HISTORIA = [
  "Le inyectaré este suero para poder empezar con el tratamiento.",
  "Tengo que apresurarme, no tengo mucho tiempo."
];
const RUTA_FINAL = "assets/final.jpg";
const TEXTO_FINAL = "Lograste salvarlo, fue difícil pero valió la pena.";

const RUTAS_SONIDOS = {
  disparo:  "assets/disparo.wav",
  explosion:"assets/explosion.wav",
  golpe:    "assets/golpe.ogg",
  nivel:    "assets/nivel.wav",
  victoria: "assets/victoria.wav",
  derrota:  "assets/derrota.wav",
  musica:   "assets/musica.mp3"
};

const CREDITOS = [
  "Juego creado por: DYLAN LEONEL LUNA y SOFIA GIORDANO",
  "Materia: Programación para medios interactivos orientado a tecnologías web",
  "Profesor: MATIAS JAUREGUI LORDA"
];

// CONFIGURACIÓN DE NIVELES (ARREGLO de OBJETOS)
// vidaEnemigo: golpes que aguanta cada bichito
// intervalo: frames entre disparos enemigos (menos = más difícil)
// velBala: velocidad de las balas enemigas
// tamBala: tamaño de la bala enemiga (más grande = más amenaza)
const NIVELES = [
  { filas: 3, columnas: 8, vidaEnemigo: 1, velX: 0.7, intervalo: 110, velBala: 2.5, tamBala: 6, paredes: 0, vidaPared: 0 },
  { filas: 3, columnas: 8, vidaEnemigo: 2, velX: 1.0, intervalo: 80,  velBala: 3,   tamBala: 8, paredes: 3, vidaPared: 5 },
  { filas: 4, columnas: 8, vidaEnemigo: 3, velX: 1.3, intervalo: 60,  velBala: 3.5, tamBala: 9, paredes: 4, vidaPared: 7 }
];

// Variables globales de recursos
let imgJugador, imgPared, imgFondo, imgFinal;
let imgsEnemigos = [];
let imgsHistoria = [];
let sonidos = {};
let juego;

//  CARGA DE RECURSOS (si falla un archivo, se usa el dibujo de respaldo
function cargarImagen(ruta) {
  const contenedor = { img: null };
  loadImage(ruta, (im) => { contenedor.img = im; }, () => { console.warn("No se pudo cargar: " + ruta); });
  return contenedor;
}

function cargarSonido(nombre, ruta) {
  loadSound(ruta, (s) => { sonidos[nombre] = s; }, () => { console.warn("No se pudo cargar: " + ruta); });
}

function dibujarImagen(contenedor, x, y, w, h) {
  if (contenedor && contenedor.img) {
    image(contenedor.img, x, y, w, h);
    return true;
  }
  return false;
}

function reproducir(nombre) {
  const s = sonidos[nombre];
  if (s) s.play();
}

function preload() {
  imgJugador = cargarImagen(RUTA_JUGADOR);
  imgPared = cargarImagen(RUTA_PARED);
  imgFondo = cargarImagen(RUTA_FONDO);
  imgFinal = cargarImagen(RUTA_FINAL);
  for (let i = 0; i < RUTAS_HISTORIA.length; i++) {
    imgsHistoria.push(cargarImagen(RUTAS_HISTORIA[i]));
  }
  for (let i = 0; i < RUTAS_ENEMIGOS.length; i++) {
    imgsEnemigos.push(cargarImagen(RUTAS_ENEMIGOS[i]));
  }
  for (const nombre in RUTAS_SONIDOS) {
    cargarSonido(nombre, RUTAS_SONIDOS[nombre]);
  }
}

function setup() {
  createCanvas(ANCHO, ALTO);
  textFont("monospace");
  juego = new Juego();
}

function draw() {
  juego.actualizar();
  juego.dibujar();
}

function keyPressed() {
  userStartAudio();               // los navegadores exigen una interacción para el audio
  juego.teclaPresionada(keyCode, key);
  // evita que flechas y espacio muevan la página
  if (keyCode === 32 || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) return false;
}

// Utilidad: colisión entre dos rectángulos {x, y, w, h}
function colisiona(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

//  CLASE BALA
class Bala {
  constructor(x, y, vy, tam, esDelJugador) {
    this.w = esDelJugador ? 5 : tam;
    this.h = esDelJugador ? 14 : tam;
    this.x = x - this.w / 2;
    this.y = y;
    this.vy = vy;
    this.esDelJugador = esDelJugador;
    this.activa = true;
  }

  actualizar() {
    this.y += this.vy;
    if (this.y < -20 || this.y > ALTO + 20) this.activa = false;
  }

  dibujar() {
    noStroke();
    if (this.esDelJugador) {
      fill(255, 240, 80);
      rect(this.x, this.y, this.w, this.h, 2);
    } else {
      fill(190, 60, 255);
      ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
      fill(255, 255, 255, 120);
      ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w * 0.4);
    }
  }
}

//  CLASE PARED (destructible)
class Pared {
  constructor(x, y, vida) {
    this.x = x;
    this.y = y;
    this.w = 70;
    this.h = 20;
    this.vida = vida;
    this.vidaMax = vida;
  }

  recibirGolpe() {
    this.vida--;
  }

  estaDestruida() {
    return this.vida <= 0;
  }

  dibujar() {
    // Mientras más dañada la pared, más transparente
    const opacidad = map(this.vida, 0, this.vidaMax, 90, 255);
    push();
    tint(255, opacidad);
    if (!dibujarImagen(imgPared, this.x, this.y, this.w, this.h)) {
      noStroke();
      fill(120, 120, 140, opacidad);
      rect(this.x, this.y, this.w, this.h, 3);
      stroke(60, 60, 80, opacidad);
      line(this.x + this.w / 3, this.y, this.x + this.w / 3, this.y + this.h);
      line(this.x + (2 * this.w) / 3, this.y, this.x + (2 * this.w) / 3, this.y + this.h);
    }
    pop();
  }
}

// CLASE ENEMIGO (bichito mental)

class Enemigo {
  constructor(x, y, vida, indiceImagen) {
    this.x = x;
    this.y = y;
    this.w = 34;
    this.h = 30;
    this.vida = vida;
    this.vidaMax = vida;
    this.indiceImagen = indiceImagen;
  }

  recibirGolpe() {
    this.vida--;
  }

  estaMuerto() {
    return this.vida <= 0;
  }

  dibujar() {
    if (!dibujarImagen(imgsEnemigos[this.indiceImagen], this.x, this.y, this.w, this.h)) {
      // Dibujo de respaldo: bichito con ojos
      noStroke();
      fill(120 + this.indiceImagen * 50, 60, 200 - this.indiceImagen * 40);
      ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
      fill(255);
      ellipse(this.x + this.w * 0.35, this.y + this.h * 0.4, 8);
      ellipse(this.x + this.w * 0.65, this.y + this.h * 0.4, 8);
      fill(0);
      ellipse(this.x + this.w * 0.35, this.y + this.h * 0.4, 3);
      ellipse(this.x + this.w * 0.65, this.y + this.h * 0.4, 3);
    }
    // Barrita de vida (solo si aguanta más de un golpe)
    if (this.vidaMax > 1) {
      noStroke();
      fill(60);
      rect(this.x, this.y - 6, this.w, 3);
      fill(80, 220, 100);
      rect(this.x, this.y - 6, this.w * (this.vida / this.vidaMax), 3);
    }
  }
}

//  CLASE JUGADOR (nave que representa al investigador)
class Jugador {
  constructor() {
    this.w = 36;
    this.h = 36;
    this.reiniciar();
    this.vel = 5;
  }

  reiniciar() {
    this.x = ANCHO / 2 - this.w / 2;
    this.y = ALTO - 50;
    // tres golpes y el jugador pierde
    this.vidas = 3;
    this.enfriamiento = 0;
    this.invulnerable = 0;
  }

  actualizar() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.vel;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.vel;
    this.x = constrain(this.x, 0, ANCHO - this.w);
    if (this.enfriamiento > 0) this.enfriamiento--;
    if (this.invulnerable > 0) this.invulnerable--;
  }

  disparar(balas) {
    if (this.enfriamiento === 0) {
      balas.push(new Bala(this.x + this.w / 2, this.y, -8, 0, true));
      this.enfriamiento = 15;
      reproducir("disparo");
    }
  }

  recibirGolpe() {
    if (this.invulnerable > 0) return false;
    this.vidas--;
    // dos segundos de inmortalidad
    this.invulnerable = 120;
    reproducir("golpe");
    return true;
  }

  dibujar() {
    // Parpadea mientras es inmortal
    if (this.invulnerable > 0 && frameCount % 8 < 4) return;
    if (!dibujarImagen(imgJugador, this.x, this.y, this.w, this.h)) {
      // Dibujo de respaldo: una pistola apuntando hacia arriba
      noStroke();
      fill(70, 75, 90);
      rect(this.x + 8, this.y + 18, 20, 18, 3);
      fill(110, 115, 135);
      rect(this.x + 14, this.y, 8, 22, 2);
      fill(200, 60, 60);
      rect(this.x + 16, this.y - 2, 4, 4);
    }
  }
}

//  clase juego (controla estados, niveles, colisiones y pantallas)
class Juego {
  constructor() {
    this.estado = "menu";
    this.pasoHistoria = 0;
    this.jugador = new Jugador();
    this.enemigos = [];
    this.balas = [];
    this.paredes = [];
    this.nivel = 0;
    this.dirX = 1;
    this.temporizador = 0;
    this.puntos = 0;
    this.contadorDisparoEnemigo = 0;
  }

  empezarPartida() {
    this.puntos = 0;
    this.jugador.reiniciar();
    this.cargarNivel(0);
    if (sonidos.musica && !sonidos.musica.isPlaying()) {
      sonidos.musica.setVolume(0.3);
      sonidos.musica.loop();
    }
  }

  cargarNivel(indice) {
    this.nivel = indice;
    const cfg = NIVELES[indice];
    this.enemigos = [];
    this.balas = [];
    this.paredes = [];
    this.dirX = 1;
    this.contadorDisparoEnemigo = 0;
    this.jugador.x = ANCHO / 2 - this.jugador.w / 2;

    const separacionX = 60;
    const inicioX = (ANCHO - (cfg.columnas - 1) * separacionX - 34) / 2;
    for (let f = 0; f < cfg.filas; f++) {
      for (let c = 0; c < cfg.columnas; c++) {
        this.enemigos.push(new Enemigo(inicioX + c * separacionX, 40 + f * 38, cfg.vidaEnemigo, indice));
      }
    }

    for (let i = 0; i < cfg.paredes; i++) {
      const x = (ANCHO / cfg.paredes) * (i + 0.5) - 35;
      this.paredes.push(new Pared(x, 280, cfg.vidaPared));
    }

    this.estado = "jugando";
  }

  teclaPresionada(codigo, tecla) {
    if (tecla === "r" || tecla === "R") {
      this.empezarPartida();
      return;
    }

    if (this.estado === "menu") {
      if (codigo === ENTER) {
        this.pasoHistoria = 0;
        this.estado = "historia";
      }
      if (tecla === "i" || tecla === "I") this.estado = "instrucciones";
      if (tecla === "c" || tecla === "C") this.estado = "creditos";
    } else if (this.estado === "historia") {
      if (codigo === ENTER || codigo === 32) {
        this.pasoHistoria++;
        if (this.pasoHistoria >= TEXTOS_HISTORIA.length) this.empezarPartida();
      }
      if (codigo === ESCAPE) this.empezarPartida();   // saltear la intro
    } else if (this.estado === "instrucciones" || this.estado === "creditos") {
      if (codigo === ESCAPE || codigo === ENTER) this.estado = "menu";
    } else if (this.estado === "jugando") {
      if (codigo === 32) this.jugador.disparar(this.balas);
      if (codigo === ESCAPE) this.estado = "menu";
    } else if (this.estado === "gameover" || this.estado === "victoria") {
      if (codigo === ENTER) this.estado = "menu";
    }
  }

  actualizar() {
    if (this.estado === "nivelCompleto") {
      this.temporizador--;
      if (this.temporizador <= 0) this.cargarNivel(this.nivel + 1);
      return;
    }
    if (this.estado !== "jugando") return;

    const cfg = NIVELES[this.nivel];
    this.jugador.actualizar();
    if (keyIsDown(32)) this.jugador.disparar(this.balas);   // mantener para ráfaga

    this.moverEnemigos(cfg);
    this.dispararEnemigos(cfg);

    for (const b of this.balas) b.actualizar();
    this.resolverColisiones();

    this.balas = this.balas.filter((b) => b.activa);
    this.enemigos = this.enemigos.filter((e) => !e.estaMuerto());
    this.paredes = this.paredes.filter((p) => !p.estaDestruida());

    // ¿Perdió?
    if (this.jugador.vidas <= 0) {
      this.terminar("gameover", "derrota");
      return;
    }
    // ¿Un enemigo llegó demasiado abajo?
    for (const e of this.enemigos) {
      if (e.y + e.h >= 280 || colisiona(e, this.jugador)) {
        this.jugador.vidas = 0;
        this.terminar("gameover", "derrota");
        return;
      }
    }
    // ¿Ganó el nivel?
    if (this.enemigos.length === 0) {
      if (this.nivel === NIVELES.length - 1) {
        this.terminar("victoria", "victoria");
      } else {
        this.estado = "nivelCompleto";
        this.temporizador = 120;
        reproducir("nivel");
      }
    }
  }

  terminar(nuevoEstado, sonido) {
    this.estado = nuevoEstado;
    if (sonidos.musica) sonidos.musica.stop();
    reproducir(sonido);
  }

  moverEnemigos(cfg) {
    // Se aceleran a medida que quedan menos
    const total = cfg.filas * cfg.columnas;
    const factor = 1 + ((total - this.enemigos.length) / total) * 0.5;
    const dx = this.dirX * cfg.velX * factor;

    let tocaBorde = false;
    for (const e of this.enemigos) {
      e.x += dx;
      if (e.x < 8 || e.x + e.w > ANCHO - 8) tocaBorde = true;
    }
    if (tocaBorde) {
      this.dirX *= -1;
      for (const e of this.enemigos) {
        e.x += this.dirX * 4;
        e.y += 5;
      }
    }
  }

  dispararEnemigos(cfg) {
    this.contadorDisparoEnemigo++;
    if (this.contadorDisparoEnemigo >= cfg.intervalo && this.enemigos.length > 0) {
      this.contadorDisparoEnemigo = 0;
      const e = random(this.enemigos);
      this.balas.push(new Bala(e.x + e.w / 2, e.y + e.h, cfg.velBala, cfg.tamBala, false));
    }
  }

  resolverColisiones() {
    for (const b of this.balas) {
      if (!b.activa) continue;

      // Las balas chocan contra las paredes (de ambos bandos)
      for (const p of this.paredes) {
        if (!p.estaDestruida() && colisiona(b, p)) {
          p.recibirGolpe();
          b.activa = false;
          break;
        }
      }
      if (!b.activa) continue;

      if (b.esDelJugador) {
        for (const e of this.enemigos) {
          if (!e.estaMuerto() && colisiona(b, e)) {
            e.recibirGolpe();
            b.activa = false;
            if (e.estaMuerto()) {
              this.puntos += 10 * (this.nivel + 1);
              reproducir("explosion");
            }
            break;
          }
        }
      } else if (colisiona(b, this.jugador)) {
        b.activa = false;
        this.jugador.recibirGolpe();
      }
    }
  }

  dibujar() {
    if (!dibujarImagen(imgFondo, 0, 0, ANCHO, ALTO)) background(15, 12, 30);

    if (this.estado === "menu") this.dibujarMenu();
    else if (this.estado === "historia") this.dibujarHistoria();
    else if (this.estado === "instrucciones") this.dibujarInstrucciones();
    else if (this.estado === "creditos") this.dibujarCreditos();
    else {
      this.dibujarJuego();
      if (this.estado === "nivelCompleto") {
        this.panel("¡NIVEL " + (this.nivel + 1) + " SUPERADO!", "Preparate para el siguiente...");
      } else if (this.estado === "gameover") {
        this.panel("GAME OVER", "Puntaje: " + this.puntos + "   |   R: reiniciar   ENTER: menú");
      } else if (this.estado === "victoria") {
        this.dibujarFinal();
      }
    }
  }

  // Texto en un cuadro semitransparente al pie de la pantalla
  cajaTexto(contenido, pie) {
    noStroke();
    fill(0, 0, 0, 190);
    rect(30, ALTO - 120, ANCHO - 60, 95, 10);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(contenido, 50, ALTO - 115, ANCHO - 100, 70);
    fill(170);
    textSize(12);
    text(pie, ANCHO / 2, ALTO - 35);
  }

  dibujarHistoria() {
    // Imagen de la pantalla actual (si no existe, queda el fondo)
    dibujarImagen(imgsHistoria[this.pasoHistoria], 0, 0, ANCHO, ALTO);
    this.cajaTexto("\u201C" + TEXTOS_HISTORIA[this.pasoHistoria] + "\u201D",
      "ENTER / ESPACIO: continuar   |   ESC: saltear");
  }

  dibujarFinal() {
    dibujarImagen(imgFinal, 0, 0, ANCHO, ALTO);
    noStroke();
    fill(15, 65, 35);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("¡GANASTE!", ANCHO / 2, 40);
    this.cajaTexto("\u201C" + TEXTO_FINAL + "\u201D",
      "Puntaje: " + this.puntos + "   |   R: jugar de nuevo   ENTER: menú");
  }

  dibujarJuego() {
    for (const p of this.paredes) p.dibujar();
    for (const e of this.enemigos) e.dibujar();
    for (const b of this.balas) b.dibujar();
    this.jugador.dibujar();

    // dibujar el hud (no encontré ningun sprite que me convenciera)
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(14);
    text("Nivel " + (this.nivel + 1) + "/" + NIVELES.length, 10, 8);
    text("Puntos: " + this.puntos, 120, 8);
    text("Vidas:", 260, 8);
    for (let i = 0; i < 3; i++) {
      fill(i < this.jugador.vidas ? color(255, 70, 90) : color(60));
      rect(315 + i * 20, 8, 14, 14, 3);
    }
    fill(180);
    textAlign(RIGHT, TOP);
    text("R: reiniciar | ESC: menú", ANCHO - 10, 8);
  }

  panel(titulo, subtitulo) {
    noStroke();
    fill(0, 0, 0, 170);
    rect(0, 0, ANCHO, ALTO);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text(titulo, ANCHO / 2, ALTO / 2 - 20);
    textSize(16);
    text(subtitulo, ANCHO / 2, ALTO / 2 + 30);
  }

  dibujarMenu() {
    textAlign(CENTER, CENTER);
    noStroke();
    fill(190, 90, 255);
    textSize(34);
    text("CATATONIA", ANCHO / 2, 90);
    fill(255);
    textSize(18);
    text("ENTER  ->  Jugar", ANCHO / 2, 180);
    text("I  ->  Instrucciones", ANCHO / 2, 215);
    text("C  ->  Créditos", ANCHO / 2, 250);
    fill(160);
    textSize(13);
    text("R reinicia el juego en cualquier momento", ANCHO / 2, 340);
  }

  dibujarInstrucciones() {
    const lineas = [
      "INSTRUCCIONES",
      "",
      "Flechas  o  A / D  ->  mover al investigador",
      "ESPACIO  ->  disparar (mantené para ráfaga)",
      "R  ->  reiniciar el juego",
      "ESC  ->  volver al menú",
      "",
      "Eliminá a todos los bichitos mentales para pasar de nivel.",
      "Con cada nivel tienen más vida y disparan más fuerte.",
      "En los niveles 2 y 3 hay paredes destructibles que tapan los tiros.",
      "Si te golpean 3 veces o te alcanzan, perdés.",
      "",
      "ENTER para volver"
    ];
    this.dibujarLineas(lineas, 40, 15);
  }

  dibujarCreditos() {
    const lineas = ["CRÉDITOS", ""].concat(CREDITOS).concat(["", "ENTER para volver"]);
    this.dibujarLineas(lineas, 50, 17);
  }

  dibujarLineas(lineas, yInicial, tam) {
    noStroke();
    textAlign(CENTER, TOP);
    for (let i = 0; i < lineas.length; i++) {
      if (i === 0) { fill(190, 90, 255); textSize(26); }
      else { fill(235); textSize(tam); }
      text(lineas[i], ANCHO / 2, yInicial + (i === 0 ? 0 : 12) + i * (tam + 8));
    }
  }
}