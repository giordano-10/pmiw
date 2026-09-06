let alturaPiso  = 500;
let tamañoPersonaje = 3;   

let estadoQuieto = ['/img/sprite-2-1.png', '/img/sprite-2-2.png', '/img/sprite-2-3.png', '/img/sprite-2-4.png', '/img/sprite-2-5.png', '/img/sprite-2-6.png', '/img/sprite-2-7.png', '/img/sprite-2-8.png', '/img/sprite-2-9.png', '/img/sprite-2-10.png', '/img/sprite-2-11.png'];
let estadoCaminando = ['/img/sprite-3-1.png', '/img/sprite-3-2.png', '/img/sprite-3-3.png', '/img/sprite-3-4.png', '/img/sprite-3-5.png', '/img/sprite-3-6.png', '/img/sprite-3-7.png', '/img/sprite-3-8.png', '/img/sprite-3-9.png', '/img/sprite-3-10.png', '/img/sprite-3-11.png', '/img/sprite-3-12.png', '/img/sprite-3-13.png', '/img/sprite-3-14.png', '/img/sprite-3-15.png'];

let framesQuieto  = [];
let framesCaminar = [];

let fondo;
let nombre;

// Estado de la animación
let frames = [];
let indice = 0;
let ultimoCambio = 0;   // millis() del último cambio de frame
let velocidad = 180;    // milisegundos por frame del estado actual

let velocidadQuieto  = 180;
let velocidadCaminando = 90;

// Estado del personaje
let estado = 'quieto';
let x = 400;
let mirandoDerecha = true;
let multiVelocidad = 1.0;  
let paso = 3;           // cuánto avanza al caminar

let ultimoCambioEstado = 0;
let duracionQuieto  = 1500;
let duracionCaminando = 2800;

let tiempoDeInicio = 0;      
let duracionFondo = 9000;    
let duracionTitulo = 2500;  

function preload() {
  framesQuieto  = cargarFrames(estadoQuieto);
  framesCaminar = cargarFrames(estadoCaminando);
  fondo  = loadImage('/img/fondo.png');
  nombre = loadImage('/img/nombre.png');
}

function cargarFrames(nombres) {
  let lista = [];
  for (let i = 0; i < nombres.length; i++) {
    lista[i] = loadImage(nombres[i]);
  }
  return lista;
}

function setup() {
  createCanvas(800, 600);
  tiempoDeInicio = millis();
  ultimoCambioEstado = millis();
  cambiarEstado('quieto');
}

function draw() {
  let t = millis() - tiempoDeInicio;
  dibujarFondo(t);
  actualizarEstado();

  if (estado === 'quieto') {
    actualizarFrame(frames, velocidad / multiVelocidad);
  } else if (estado === 'caminando') {
    actualizarFrame(frames, velocidad / multiVelocidad);
    mover();
  }

  dibujarAnimacion(frames, indice, x, alturaPiso, !mirandoDerecha);

  dibujarTitulo(t); // se dibuja al final
}

// Alterna automáticamente entre 'quieto' y 'caminando' según el tiempo.
function actualizarEstado() {
  let dur = duracionQuieto;
  if (estado == 'caminando') dur = duracionCaminando;

  if (millis() - ultimoCambioEstado >= dur) {
    if (estado == 'quieto') cambiarEstado('caminando');
    else cambiarEstado('quieto');
    ultimoCambioEstado = millis();
  }
}

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

function dibujarAnimacion(lista, i, px, alturaPiso, espejar) {
  let img = lista[i];
  let ancho = img.width  * tamañoPersonaje;
  let alto  = img.height * tamañoPersonaje;
  push();
  translate(px, alturaPiso);
  if (espejar) scale(-1, 1);
  imageMode(CORNER);
  image(img, -ancho / 2, -alto, ancho, alto);
  pop();
}

// Cambia de estado: elige el arreglo de frames y la velocidad, y reinicia la animación.
function cambiarEstado(nuevo) {
  estado = nuevo;
  indice = 0;
  ultimoCambio = millis();

  if (nuevo === 'quieto') {
    frames = framesQuieto;  
    velocidad = velocidadQuieto;
  } else if (nuevo === 'caminando') {
    frames = framesCaminar; 
    velocidad = velocidadCaminando;
  }
}

// Movimiento horizontal al caminar; rebota en los bordes.
function mover() {
  let avance = paso * multiVelocidad;
  if (mirandoDerecha) x = x + avance; else x = x - avance;

  if (x > width - 130) mirandoDerecha = false;
  if (x < 130) mirandoDerecha = true;
}

function dibujarFondo(t) {
  let escX = width  / fondo.width;
  let escY = height / fondo.height;
  let esc = escX;
  if (escY > esc) esc = escY;

  let ancho = fondo.width  * esc;
  let alto  = fondo.height * esc;
  let y = (height - alto) / 2;

  let rango = ancho - width;
  if (rango < 0) rango = 0;

  let progreso = t / duracionFondo;
  if (progreso < 0) progreso = 0;
  if (progreso > 1) progreso = 1;

  let fx = -rango + progreso * rango;

  imageMode(CORNER);
  image(fondo, fx, y, ancho, alto);
}

function dibujarTitulo(t) {
  if (t < duracionFondo) return;   // recién aparece cuando el fondo terminó de moverse

  let alpha = map(t - duracionFondo, 0, duracionTitulo, 0, 255, true);  // 0 -> 255

  let ancho = 600;
  let alto  = nombre.height * (ancho / nombre.width);

  imageMode(CENTER);
  tint(255, alpha);                       
  image(nombre, width / 2, height / 2, ancho, alto);
  noTint();
}

function reiniciar() {
  x = 400;
  multiVelocidad = 1.0;
  mirandoDerecha = true;
  tiempoDeInicio = millis();
  ultimoCambioEstado = millis();
  cambiarEstado('quieto');
}

function keyPressed() {
  if (key === 'r' || key === 'R') reiniciar();
}
