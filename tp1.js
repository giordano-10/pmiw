// ----- Datos generales -----
let PISO  = 500;     // los pies del personaje se apoyan en esta altura
let escala = 3;    // los sprites son chiquitos: los agrandamos al dibujar

// Nombres de archivo de cada animación (los recorremos con un for para cargarlos).
//let nombresQuieto  = ['/img/sprite-1-1.png', '/img/sprite-1-2.png', '/img/sprite-1-3.png', '/img/sprite-1-4.png', '/img/sprite-1-5.png', '/img/sprite-1-6.png', '/img/sprite-1-7.png', '/img/sprite-1-8.png', '/img/sprite-1-9.png', '/img/sprite-1-10.png', '/img/sprite-1-11.png', '/img/sprite-1-12.png', '/img/sprite-1-13.png', '/img/sprite-1-14.png', '/img/sprite-1-15.png'];
let nombresQuieto = ['/img/sprite-2-1.png', '/img/sprite-2-2.png', '/img/sprite-2-3.png', '/img/sprite-2-4.png', '/img/sprite-2-5.png', '/img/sprite-2-6.png', '/img/sprite-2-7.png', '/img/sprite-2-8.png', '/img/sprite-2-9.png', '/img/sprite-2-10.png', '/img/sprite-2-11.png'];
let nombresCaminar = ['/img/sprite-3-1.png', '/img/sprite-3-2.png', '/img/sprite-3-3.png', '/img/sprite-3-4.png', '/img/sprite-3-5.png', '/img/sprite-3-6.png', '/img/sprite-3-7.png', '/img/sprite-3-8.png', '/img/sprite-3-9.png', '/img/sprite-3-10.png', '/img/sprite-3-11.png', '/img/sprite-3-12.png', '/img/sprite-3-13.png', '/img/sprite-3-14.png', '/img/sprite-3-15.png'];


// Arreglos de frames (imágenes). Se llenan en preload().
let framesQuieto  = [];
let framesCaminar = [];

// Imágenes de fondo y del título.
let fondo;
let nombre;

// ----- Estado de la animación -----
let frames = [];        // arreglo de frames del estado actual
let indice = 0;         // frame actual dentro de ese arreglo
let ultimoCambio = 0;   // millis() del último cambio de frame
let velocidad = 180;    // milisegundos por frame del estado actual

// Velocidades propias de cada estado (distintas entre sí).
let velQuieto  = 180;
let velCaminar = 90;
let velGesto   = 70;

// ----- Estado del personaje -----
let estado = 'quieto';       // 'quieto' | 'caminando' | 'gesto'
let x = 400;                 // posición horizontal
let mirandoDerecha = true;   // si es false, espejamos el sprite
let multVel = 1.0;           // multiplicador global de velocidad
let paso = 3;                // cuánto avanza al caminar

// ----- Alternancia automática de estados -----
let ultimoCambioEstado = 0;  // millis() del último cambio de estado
let durQuieto  = 1500;       // ms que se queda quieto antes de caminar
let durCaminar = 2800;       // ms que camina antes de quedarse quieto

// ----- Línea de tiempo de la intro -----
let tInicio = 0;             // millis() en que arrancó la secuencia
let durScroll = 9000;        // ms que dura el desplazamiento del fondo
let durFade   = 2500;        // ms que tarda el título en aparecer


// ----- Carga de imágenes -----
function preload() {
  framesQuieto  = cargarFrames(nombresQuieto);
  framesCaminar = cargarFrames(nombresCaminar);
  fondo  = loadImage('/img/fondo.png');
  nombre = loadImage('/img/nombre.png');
}

// Función propia CON PARÁMETRO que RETORNA un arreglo de imágenes.
// Usa un for para construir el arreglo con loadImage().
function cargarFrames(nombres) {
  let lista = [];
  for (let i = 0; i < nombres.length; i++) {
    lista[i] = loadImage(nombres[i]);
  }
  return lista;
}


function setup() {
  createCanvas(800, 600);
  tInicio = millis();
  ultimoCambioEstado = millis();
  cambiarEstado('quieto');   // arranca en el estado inicial
}

function draw() {
  let t = millis() - tInicio;   // tiempo transcurrido desde el inicio de la intro

  dibujarFondo(t);

  // Los estados se alternan solos (sin teclas).
  actualizarEstadoAuto();

  // ----- Máquina de estados (if / else) -----
  if (estado === 'quieto') {
    actualizarFrame(frames, velocidad / multVel);

  } else if (estado === 'caminando') {
    actualizarFrame(frames, velocidad / multVel);
    mover();

  } else if (estado === 'gesto') {
    let dioLaVuelta = actualizarFrame(frames, velocidad / multVel);
    if (dioLaVuelta) cambiarEstado('quieto');
  }

  dibujarSombra();
  dibujarAnimacion(frames, indice, x, PISO, !mirandoDerecha);
  dibujarHUD();

  dibujarTitulo(t);   // se dibuja al final => queda enfrente de todo
}

// Alterna automáticamente entre 'quieto' y 'caminando' según el tiempo.
function actualizarEstadoAuto() {
  let dur = (estado === 'caminando') ? durCaminar : durQuieto;
  if (millis() - ultimoCambioEstado >= dur) {
    cambiarEstado(estado === 'quieto' ? 'caminando' : 'quieto');
    ultimoCambioEstado = millis();
  }
}

// Avanza el frame según el TIEMPO (millis), no según los cuadros del programa.
// Parámetros: el arreglo de frames y cuántos ms dura cada frame.
// RETORNA true si en este momento dio la vuelta completa (volvió al frame 0).
function actualizarFrame(lista, msPorFrame) {
  let dioLaVuelta = false;
  if (millis() - ultimoCambio >= msPorFrame) {
    indice = indice + 1;
    ultimoCambio = millis();
    if (indice >= lista.length) {
      indice = 0;
      dioLaVuelta = true;
    }
  }
  return dioLaVuelta;
}

// Dibuja el frame actual de CUALQUIER animación, centrado en X y apoyado en el piso.
// Función genérica CON PARÁMETROS.
function dibujarAnimacion(lista, i, px, piso, espejar) {
  let img = lista[i];
  let w = img.width  * escala;
  let h = img.height * escala;
  push();
  translate(px, piso);
  if (espejar) scale(-1, 1);
  imageMode(CORNER);
  image(img, -w / 2, -h, w, h);
  pop();
}

// Cambia de estado: elige el arreglo de frames y la velocidad, y reinicia la animación.
// Función propia CON PARÁMETRO.
function cambiarEstado(nuevo) {
  estado = nuevo;
  indice = 0;
  ultimoCambio = millis();

  if (nuevo === 'quieto') {
    frames = framesQuieto;   // arreglo de reposo
    velocidad = velQuieto;
  } else if (nuevo === 'caminando') {
    frames = framesCaminar;  // arreglo de caminata
    velocidad = velCaminar;
  } else if (nuevo === 'gesto') {
    frames = framesQuieto;   // reusa el arreglo de reposo, pero más rápido y una sola vez
    velocidad = velGesto;
  }
}

// Movimiento horizontal al caminar; rebota en los bordes.
function mover() {
  let avance = paso * multVel;
  if (mirandoDerecha) x = x + avance; else x = x - avance;

  if (x > width - 130) mirandoDerecha = false;
  if (x < 130)         mirandoDerecha = true;
}


// ----- Fondo (se desplaza hacia la derecha con el tiempo) -----
function dibujarFondo(t) {
  // Escalado "cover": la imagen llena todo el canvas.
  let esc = max(width / fondo.width, height / fondo.height);
  let w = fondo.width  * esc;
  let h = fondo.height * esc;
  let y = (height - h) / 2;

  let rango = w - width;                  // cuánto podemos desplazar en horizontal
  if (rango < 0) rango = 0;

  let progreso = constrain(t / durScroll, 0, 1);
  // Va de -rango (mostrando la parte derecha) a 0 => el fondo se desplaza hacia la derecha.
  let fx = -rango + progreso * rango;

  imageMode(CORNER);
  image(fondo, fx, y, w, h);
}

// ----- Título: aparece al final del desplazamiento, con opacidad, enfrente del fondo -----
function dibujarTitulo(t) {
  if (t < durScroll) return;              // recién aparece cuando el fondo terminó de moverse

  let alpha = map(t - durScroll, 0, durFade, 0, 255, true);  // 0 -> 255

  let w = 640;
  let h = nombre.height * (w / nombre.width);

  push();
  imageMode(CENTER);
  // Si querés que el fondo negro del logo desaparezca y solo se vean las letras,
  // descomentá la línea de abajo:
  // blendMode(SCREEN);
  tint(255, alpha);                       // opacidad creciente
  image(nombre, width / 2, height / 2, w, h);
  blendMode(BLEND);
  pop();                                  // pop() restaura el tint
}

function dibujarSombra() {
  noStroke();
  fill(0, 60);
  ellipse(x, PISO + 6, 90, 22);
}


// ----- Texto informativo -----
function dibujarHUD() {
  noStroke();
  fill(0, 130);
  rect(12, 12, 250, 82, 8);
  fill(255);
  textFont('monospace');
  textSize(14);
  text('Estado: ' + estado, 24, 36);
  fill(200);
  textSize(11);
  text('R reiniciar', 24, 80);
}

// ----- Reinicio / volver al estado inicial (reinicia toda la intro) -----
function reiniciar() {
  x = 400;
  multVel = 1.0;
  mirandoDerecha = true;
  tInicio = millis();
  ultimoCambioEstado = millis();
  cambiarEstado('quieto');
}

function keyPressed() {
  if (key === 'r' || key === 'R') reiniciar();
}
