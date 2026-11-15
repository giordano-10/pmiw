//link de video: https://youtu.be/cHVPPq5-ou4

// variables globales
let imagenes = [];
let textosNarrativos = [];

// Botones: cada pantalla puede tener hasta 3 botones. (por las dudas no borrar)
// texto1[n] / destino1[n] = primer botón de la pantalla n
// texto2[n] / destino2[n] = segundo botón de la pantalla n
// texto3[n] / destino3[n] = tercer botón de la pantalla n
let texto1 = [];
let texto2 = [];
let texto3 = [];
let destino1 = [];
let destino2 = [];
let destino3 = [];

// Sonidos
let sonidoFondo;
let sonidoClick;
let musicaIniciada = false;

let pantallaActual = 0;

// Variable pantalla de creditos
let anguloCreditos = 0;

function preload() {

  for (let i = 0; i <= 22; i++) {
    imagenes[i] = loadImage('assets/img_' + i + '.jpg');
  }

  sonidoFondo = loadSound('assets/sonidodefondo.wav');
  sonidoClick = loadSound('assets/click.wav');
}

function setup() {
  createCanvas(800, 450);
  textFont('Helvetica');
  inicializarDatosHistoria();

  if (sonidoClick) {
    sonidoClick.setVolume(0.3);
  }
}

function draw() {
  cursor(ARROW);
  background(20);

  if (pantallaActual === 0) {
    dibujarPantallaCreditos();
  } else {
    dibujarPantallaJuego(pantallaActual);
  }
}

// Estructura para la historia
function inicializarDatosHistoria() {
  textosNarrativos[1] = "El sujeto está en estado de catatonia. Un crimen ocurrió hace 24 horas y él es el único testigo.";
  textosNarrativos[2] = "Revisas la escena. Encuentras un cuaderno con trazos repetitivos y una grabación de voz cortada.";
  textosNarrativos[3] = "¿Cómo intentas inducir una respuesta en el sujeto catatónico?";
  textosNarrativos[4] = "Muestra sudoración y taquicardia. Se revela un nombre y una fecha clave.";
  textosNarrativos[5] = "Revisas el expediente de un tercero implicado en el caso.";
  textosNarrativos[6] = "Flashback: La perspectiva del sujeto antes de colapsar en catatonia.";
  textosNarrativos[7] = "Descubres que la catatonia es un mecanismo de defensa para congelar un recuerdo traumático.";
  textosNarrativos[8] = "Una figura antagónica intenta intervenir para cerrar el caso precipitadamente.";
  textosNarrativos[9] = "¿Cuál es tu hipótesis sobre la catatonia del testigo?";

  // Rutas y clímax
  textosNarrativos[10] = "El testigo parpadea rápidamente mientras el antagónico presiona.";
  textosNarrativos[11] = "La confrontación directa alcanza su punto máximo.";
  textosNarrativos[12] = "Tomas la decisión final en el interrogatorio.";

  // Ruta 1: Lucidez (Final 1)
  textosNarrativos[13] = "Guías al personaje procesando el trauma con calma.";
  textosNarrativos[14] = "Empieza a hilar frases coherentes.";
  textosNarrativos[15] = "Nombra con precisión al verdadero culpable.";
  textosNarrativos[16] = "Aseguras la evidencia testimonial.";
  textosNarrativos[17] = "La policía emite la orden de captura.";
  textosNarrativos[18] = "Arresto del culpable.";
  textosNarrativos[19] = "El sujeto inicia un proceso de recuperación en un entorno seguro.";
  textosNarrativos[20] = "FINAL 1 - Lucidez: Cierre con una nota de justicia, aunque el trauma persista.";

  // Ruta 2: Ecos (Final 2)
  textosNarrativos[21] = "FINAL 2 - Ecos: Presionaste demasiado. El testigo colapsó de forma irrecuperable.";

  // Ruta 3: Espejo (Final 3)
  textosNarrativos[22] = "FINAL 3 - Espejo: Descubres que tus propias acciones provocaron el colapso. Caes en la misma parálisis.";

  // Botones
  texto1[1] = "Explorar escena";
  destino1[1] = 2;

  texto1[2] = "Evaluar pistas";
  destino1[2] = 3;

  // Pantalla 3: Dilema (2 botones)
  texto1[3] = "Estímulo agresivo (Audio)";
  destino1[3] = 4;
  texto2[3] = "Objeto sentimental";
  destino2[3] = 5;

  texto1[4] = "Investigar sospechoso";
  destino1[4] = 5;

  texto1[5] = "Ver Flashback";
  destino1[5] = 6;

  texto1[6] = "Analizar secreto";
  destino1[6] = 7;

  texto1[7] = "Enfrentar amenaza";
  destino1[7] = 8;

  texto1[8] = "Formular hipótesis";
  destino1[8] = 9;

  // Pantalla 9: Las 3 Hipótesis, ramificación de finales (3 botones)
  texto1[9] = "Hipótesis A: Protege al culpable";
  destino1[9] = 10;
  texto2[9] = "Hipótesis B: Víctima de trauma";
  destino2[9] = 13;
  texto3[9] = "Hipótesis C: Simulación / Disociación";
  destino3[9] = 21;

  // Avances en Ruta 2 / clímax
  texto1[10] = "Avanzar";
  destino1[10] = 11;

  texto1[11] = "Avanzar";
  destino1[11] = 12;

  texto1[12] = "Guiar con cuidado";
  destino1[12] = 22;

  // Avances en Ruta 1
  texto1[13] = "Continuar";
  destino1[13] = 14;

  texto1[14] = "Continuar";
  destino1[14] = 15;

  texto1[15] = "Continuar";
  destino1[15] = 16;

  texto1[16] = "Continuar";
  destino1[16] = 17;

  texto1[17] = "Ver arresto";
  destino1[17] = 18;

  texto1[18] = "Ver recuperación";
  destino1[18] = 19;

  texto1[19] = "Ver desenlace";
  destino1[19] = 20;

  // Botón para reiniciar desde los finales
  texto1[20] = "Volver al Inicio";
  destino1[20] = 1;

  texto1[21] = "Volver al Inicio";
  destino1[21] = 1;

  texto1[22] = "Volver al Inicio";
  destino1[22] = 1;
}


// Devuelve cuántos botones tiene una pantalla (0, 1, 2 o 3)
function cantidadBotones(numPantalla) {
  if (texto3[numPantalla]) {
    return 3;
  }
  if (texto2[numPantalla]) {
    return 2;
  }
  if (texto1[numPantalla]) {
    return 1;
  }
  return 0;
}

function textoBoton(numPantalla, i) {
  if (i === 0) {
    return texto1[numPantalla];
  }
  if (i === 1) {
    return texto2[numPantalla];
  }
  return texto3[numPantalla];
}

function destinoBoton(numPantalla, i) {
  if (i === 0) {
    return destino1[numPantalla];
  }
  if (i === 1) {
    return destino2[numPantalla];
  }
  return destino3[numPantalla];
}

function xBoton(cantidad, i) {
  if (cantidad === 1) {
    return 300;
  }
  if (cantidad === 2) {
    if (i === 0) {
      return 180;
    }
    return 410;
  }
  if (i === 0) {
    return 80;
  }
  if (i === 1) {
    return 295;
  }
  return 510;
}

// Ancho del botón según cuántos botones hay en la pantalla
function anchoBoton(cantidad) {
  if (cantidad === 1) {
    return 200;
  }
  return 210;
}

let yBotones = 370;
let altoBotones = 40;

function mouseSobre(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}


function dibujarPantallaCreditos() {
  background(15, 20, 30);

  // Animación de fondo
  push();
  translate(width / 2, height / 2 - 40);
  rotate(anguloCreditos);
  noFill();
  stroke(180, 50, 50, 150);
  strokeWeight(3);
  ellipse(0, 0, 160, 160);
  ellipse(0, 0, 110, 110);
  rectMode(CENTER);
  rect(0, 0, 110, 110);
  rect(0, 0, 75, 75);
  pop();

  anguloCreditos += 0.02;

  textAlign(CENTER, CENTER);
  fill(240);
  textSize(26);
  text("THRILLER PSICOLÓGICO: CATATONIA", width / 2, 80);

  textSize(16);

  fill(180);
  text("Autor de la obra: Sofia Giordano", width / 2, 290);
  text("Guion: Dylan Leonel Luna", width / 2, 315);
  text("Desarrollado por: Dylan Leonel Luna / Sofia Giordano", width / 2, 340);

  // Botón para comenzar
  dibujarBoton("Iniciar Aventura", width / 2 - 100, 360, 200, 40);
}

function dibujarPantallaJuego(numPantalla) {
  if (imagenes[numPantalla]) {
    image(imagenes[numPantalla], 0, 0, width, height);
  } else {
    background(25);
  }

  fill(0, 0, 0, 180);
  rect(0, 280, width, 170);

  fill(255);
  textSize(15);
  textAlign(LEFT, TOP);
  let texto = textosNarrativos[numPantalla] || "Pantalla en desarrollo...";
  text(texto, 30, 295, width - 60, 60);

  // Dibujar los botones de la pantalla
  let cantidad = cantidadBotones(numPantalla);
  for (let i = 0; i < cantidad; i++) {
    let x = xBoton(cantidad, i);
    let w = anchoBoton(cantidad);
    dibujarBoton(textoBoton(numPantalla, i), x, yBotones, w, altoBotones);
  }

  // Botón para ver créditos
  fill(150);
  textSize(11);
  textAlign(RIGHT, TOP);
  text("[ Ir a Créditos ]", width - 15, 10);
}

function dibujarBoton(txt, x, y, w, h) {
  if (mouseSobre(x, y, w, h)) {
    fill(140, 30, 30);
    cursor(HAND);
  } else {
    fill(40, 40, 50);
  }

  stroke(200);
  strokeWeight(1);
  rectMode(CORNER);
  rect(x, y, w, h, 5);

  fill(255);
  noStroke();
  textSize(13);
  textAlign(CENTER, CENTER);
  text(txt, x + w / 2, y + h / 2);
}

function mousePressed() {
  // Activa el contexto de audio del navegador al primer clic
  userStartAudio();

  if (musicaIniciada === false) {
    if (sonidoFondo) {
      if (sonidoFondo.isLoaded()) {
        sonidoFondo.loop();
        sonidoFondo.setVolume(0.4);
        musicaIniciada = true;
      }
    }
  }

  // Click en "Ir a Créditos"
  if (mouseX > width - 110 && mouseY < 30) {
    pantallaActual = 0;
    return;
  }

  // Click en Pantalla de Créditos
  if (pantallaActual === 0) {
    if (mouseSobre(width / 2 - 100, 360, 200, 40)) {
      pantallaActual = 1;
    }
    return;
  }

  // Click en botones de decisiones
  let cantidad = cantidadBotones(pantallaActual);
  for (let i = 0; i < cantidad; i++) {
    let x = xBoton(cantidad, i);
    let w = anchoBoton(cantidad);
    if (mouseSobre(x, yBotones, w, altoBotones)) {
      if (sonidoClick) {
        if (sonidoClick.isLoaded()) {
          sonidoClick.play();
        }
      }
      pantallaActual = destinoBoton(pantallaActual, i);
      break;
    }
  }
}