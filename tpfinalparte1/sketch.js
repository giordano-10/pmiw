// variables globales
let imagenes = [];
let sonidos = {};
let pantallaActual = 0;
let textosNarrativos = [];
let decisiones = [];
// Variable pantalla de creditos
let anguloCreditos = 0;

function preload() {
  // carga imgs
  for (let i = 0; i <= 22; i++) {
    imagenes[i] = loadImage('assets/img_' + i + '.jpg'); 
  }

  // sonido
  // soundFormats('mp3', 'wav');
  // sonidos.suspenso = loadSound('assets/suspenso.mp3');
  // sonidos.click = loadSound('assets/click.mp3');
}

function setup() {
  createCanvas(800, 450);
  textFont('Helvetica');
  inicializarDatosHistoria();
}

function draw() {
  background(20);

  if (pantallaActual === 0) {
    dibujarPantallaCreditos();
  } else {
    dibujarPantallaJuego(pantallaActual);
  }
}

// estructura para la historia
function inicializarDatosHistoria() {
  textosNarrativos[1] = "Pantalla 1: El sujeto está en estado de catatonia. Un crimen ocurrió hace 24 horas y él es el único testigo.";
  textosNarrativos[2] = "Pantalla 2: Revisas la escena. Encuentras un cuaderno con trazos repetitivos y una grabación de voz cortada.";
  textosNarrativos[3] = "Pantalla 3: ¿Cómo intentas inducir una respuesta en el sujeto catatónico?";
  textosNarrativos[4] = "Pantalla 4: Muestra sudoración y taquicardia. Se revela un nombre y una fecha clave.";
  textosNarrativos[5] = "Pantalla 5: Revisas el expediente de un tercero implicado en el caso.";
  textosNarrativos[6] = "Pantalla 6: Flashback: La perspectiva del sujeto antes de colapsar en catatonia.";
  textosNarrativos[7] = "Pantalla 7: Descubres que la catatonia es un mecanismo de defensa para congelar un recuerdo traumático.";
  textosNarrativos[8] = "Pantalla 8: Una figura antagónica intenta intervenir para cerrar el caso precipitadamente.";
  textosNarrativos[9] = "Pantalla 9: ¿Cuál es tu hipótesis sobre la catatonia del testigo?";
  
  // Rutas y clímax
  textosNarrativos[10] = "Pantalla 10: Punto Cima. El testigo parpadea rápidamente mientras el antagónico presiona.";
  textosNarrativos[11] = "Pantalla 11: La confrontación directa alcanza su punto máximo.";
  textosNarrativos[12] = "Pantalla 12: Tomas la decisión final en el interrogatorio.";

  // Ruta 1: Lucidez (Final 1)
  textosNarrativos[13] = "Pantalla 13 (Ruta 1): Guías al personaje procesando el trauma con calma.";
  textosNarrativos[14] = "Pantalla 14 (Ruta 1): Empieza a hilar frases coherentes.";
  textosNarrativos[15] = "Pantalla 15 (Ruta 1): Nombra con precisión al verdadero culpable.";
  textosNarrativos[16] = "Pantalla 16 (Ruta 1): Aseguras la evidencia testimonial.";
  textosNarrativos[17] = "Pantalla 17 (Ruta 1): La policía emite la orden de captura.";
  textosNarrativos[18] = "Pantalla 18 (Ruta 1): Arresto del culpable.";
  textosNarrativos[19] = "Pantalla 19 (Ruta 1): El sujeto inicia un proceso de recuperación en un entorno seguro.";
  textosNarrativos[20] = "FINAL 1 - Lucidez: Cierre con una nota de justicia, aunque el trauma persista.";

  // Ruta 2: Ecos (Final 2)
  textosNarrativos[21] = "FINAL 2 - Ecos: Presionaste demasiado. El testigo colapsó de forma irrecuperable.";

  // Ruta 3: Espejo (Final 3)
  textosNarrativos[22] = "FINAL 3 - Espejo: Descubres que tus propias acciones provocaron el colapso. Caes en la misma parálisis.";

  // Arreglo de opciones
  decisiones[1] = [{ texto: "Explorar escena", x: 300, y: 370, w: 200, h: 40, destino: 2 }];
  decisiones[2] = [{ texto: "Evaluar pistas", x: 300, y: 370, w: 200, h: 40, destino: 3 }];
  
  // Pantalla 3: Dilema
  decisiones[3] = [
    { texto: "Estímulo agresivo (Audio)", x: 180, y: 370, w: 210, h: 40, destino: 4 },
    { texto: "Objeto sentimental", x: 410, y: 370, w: 210, h: 40, destino: 5 }
  ];

  decisiones[4] = [{ texto: "Investigar sospechoso", x: 300, y: 370, w: 200, h: 40, destino: 5 }];
  decisiones[5] = [{ texto: "Ver Flashback", x: 300, y: 370, w: 200, h: 40, destino: 6 }];
  decisiones[6] = [{ texto: "Analizar secreto", x: 300, y: 370, w: 200, h: 40, destino: 7 }];
  decisiones[7] = [{ texto: "Enfrentar amenaza", x: 300, y: 370, w: 200, h: 40, destino: 8 }];
  decisiones[8] = [{ texto: "Formular hipótesis", x: 300, y: 370, w: 200, h: 40, destino: 9 }];

  // Pantalla 9: Las 3 Hipótesis, Ramificación de finales
  decisiones[9] = [
    { texto: "Hipótesis A: Protege al culpable", x: 80, y: 370, w: 210, h: 40, destino: 10 },
    { texto: "Hipótesis B: Víctima de trauma", x: 300, y: 370, w: 200, h: 40, destino: 13 },
    { texto: "Hipótesis C: Simulación / Disociación", x: 510, y: 370, w: 210, h: 40, destino: 21 }
  ];

  // Avances en Ruta 1
  decisiones[10] = [{ texto: "Avanzar", x: 300, y: 370, w: 200, h: 40, destino: 11 }];
  decisiones[11] = [{ texto: "Avanzar", x: 300, y: 370, w: 200, h: 40, destino: 12 }];
  decisiones[12] = [{ texto: "Guiar con cuidado", x: 300, y: 370, w: 200, h: 40, destino: 22 }];
  decisiones[13] = [{ texto: "Continuar", x: 300, y: 370, w: 200, h: 40, destino: 14 }];
  decisiones[14] = [{ texto: "Continuar", x: 300, y: 370, w: 200, h: 40, destino: 15 }];
  decisiones[15] = [{ texto: "Continuar", x: 300, y: 370, w: 200, h: 40, destino: 16 }];
  decisiones[16] = [{ texto: "Continuar", x: 300, y: 370, w: 200, h: 40, destino: 17 }];
  decisiones[17] = [{ texto: "Ver arresto", x: 300, y: 370, w: 200, h: 40, destino: 18 }];
  decisiones[18] = [{ texto: "Ver recuperación", x: 300, y: 370, w: 200, h: 40, destino: 19 }];
  decisiones[19] = [{ texto: "Ver desenlace", x: 300, y: 370, w: 200, h: 40, destino: 20 }];

  // Botón para reiniciar desde los finales
  decisiones[20] = [{ texto: "Volver al Inicio", x: 300, y: 370, w: 200, h: 40, destino: 1 }];
  decisiones[21] = [{ texto: "Volver al Inicio", x: 300, y: 370, w: 200, h: 40, destino: 1 }];
  decisiones[22] = [{ texto: "Volver al Inicio", x: 300, y: 370, w: 200, h: 40, destino: 1 }];
}

function dibujarPantallaCreditos() {
  background(15, 20, 30);
  
  // Animación circular de fondo
  push();
  translate(width / 2, height / 2 - 40);
  rotate(anguloCreditos);
  noFill();
  stroke(180, 50, 50, 150);
  strokeWeight(3);
  ellipse(0, 0, 180, 180);
  rectMode(CENTER);
  rect(0, 0, 130, 130);
  pop();
  
  anguloCreditos += 0.02;

  textAlign(CENTER, CENTER);
  fill(240);
  textSize(26);
  text("THRILLER PSICOLÓGICO: CATATONIA", width / 2, 80);
  
  textSize(16);
  fill(180);
  text("Autor de la obra / Guion: Inteligencia Artificial", width / 2, 280);
  text("Desarrollado por: Dylan Leonel Luna / Sofia Giordano", width / 2, 310);

  // Botón para comenzar
  dibujarBoton("Iniciar Aventura", width / 2 - 100, 360, 200, 40, 1);
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

  let botones = decisiones[numPantalla];
  if (botones) {
    for (let b of botones) {
      dibujarBoton(b.texto, b.x, b.y, b.w, b.h, b.destino);
    }
  }

  // Botón para ver créditos
  fill(150);
  textSize(11);
  textAlign(RIGHT, TOP);
  text("[ Ir a Créditos ]", width - 15, 10);
}

// funcion reutilizable :v
function dibujarBoton(txt, x, y, w, h, destino) {
  let estaEncima = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  
  if (estaEncima) {
    fill(140, 30, 30);
    cursor(HAND);
  } else {
    fill(40, 40, 50);
  }
  
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  fill(255);
  noStroke();
  textSize(13);
  textAlign(CENTER, CENTER);
  text(txt, x + w / 2, y + h / 2);
}

// click
function mousePressed() {
  cursor(ARROW);
  if (mouseX > width - 80 && mouseY < 30) {
    pantallaActual = 0;
    return;
  }

  if (pantallaActual === 0) {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > 360 && mouseY < 400) {
      pantallaActual = 1;
    }
    return;
  }

  let botones = decisiones[pantallaActual];
  if (botones) {
    for (let b of botones) {
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        // Reproducir sonido de transición si está cargado
        // if (sonidos.click) sonidos.click.play();
        
        pantallaActual = b.destino;
        break;
      }
    }
  }
}
