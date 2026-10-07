// =============================================================================
// NOVELA VISUAL THRILLER: CATATONIA (20 PANTALLAS / 3 FINALES)
// Estructura de flujo no lineal implementada en p5.js
// =============================================================================

let pantallaActual = 1;
let botones = [];

// Base de datos de las 20 pantallas
const historia = {
  1: {
    titulo: "PANTALLA 01: EL SUJETO",
    texto: [
      "Habitación 402 del Centro Neuropsiquiátrico San Severino.",
      "Frente a ti, una figura inmóvil permanece sentada en el borde de la cama, con la mirada perdida en la nada y los brazos rígidos.",
      "El informe médico confirma una catatonia estuporosa súbita iniciada hace menos de 24 horas, coincidiendo exactamente con el crimen.",
      "El fiscal te ha otorgado un plazo estricto: si no consigues una declaración o una pista clara antes de medianoche, el caso será archivado."
    ],
    opciones: [
      { texto: "Inspeccionar los alrededores de la habitación", destino: 2 }
    ]
  },

  2: {
    titulo: "PANTALLA 02: LA ESCENA",
    texto: [
      "La habitación se encuentra en un inquietante orden casi quirúrgico.",
      "El polvo en el suelo revela patrones de arrastre y marcas de calzado que la policía científica pasó por alto durante el primer peritaje.",
      "Sobre la mesa de noche descansa un pequeño objeto medio oculto, mientras que bajo la cama se percibe la esquina de un cajón forzado.",
      "Debes decidir qué rincón examinar detenidamente antes de comenzar la interacción con el testigo."
    ],
    opciones: [
      { texto: "Examinar el objeto sobre la mesa de noche", destino: 3 },
      { texto: "Revisar los documentos ocultos en el cajón", destino: 4 }
    ]
  },

  3: {
    titulo: "PANTALLA 03: EL AUDIO CORTADO",
    texto: [
      "Alcanzas una grabadora de dictáfono analógica oculta detrás de la lámpara de velador.",
      "La cinta magnética en su interior se encuentra parcialmente enredada, pero la luz del reproductor aún parpadea en rojo.",
      "Al presionar reproducir, solo se escucha estática densa, seguida de una voz distorsionada que susurra tres palabras incoherentes.",
      "Guardas la grabadora en tu abrigo; este estímulo auditivo podría ser la clave para desencadenar una respuesta neurológica."
    ],
    opciones: [
      { texto: "Acercarse al sujeto para aplicar el estímulo", destino: 5 }
    ]
  },

  4: {
    titulo: "PANTALLA 04: EL DIARIO CODIFICADO",
    texto: [
      "Deslizas la mano por la ranura del cajón inferior y extraes una libreta de tapas de cuero gastado.",
      "Las páginas están cubiertas de trazos obsesivos, símbolos geométricos repetidos y varias fechas tachadas con tinta negra.",
      "En la última página escrita hay un nombre propio subrayado tres veces junto a una hora exacta: 03:14 AM.",
      "Cierras el diario sintiendo un escalofrío; las anotaciones sugieren que el testigo temía a alguien muy cercano."
    ],
    opciones: [
      { texto: "Confrontar al sujeto con las notas del diario", destino: 5 }
    ]
  },

  5: {
    titulo: "PANTALLA 05: PRIMER ESTÍMULO DIRECTO",
    texto: [
      "Te posicionas frente al sujeto catatónico y el pulsómetro de su muñeca comienza a acelerar suavemente su ritmo.",
      "Su respiración se vuelve superficial y sus pupilas se dilatan perceptiblemente ante tu presencia en la estancia.",
      "Es el momento de definir la estrategia de aproximación psicológica para intentar romper el bloqueo estuporoso.",
      "Un movimiento en falso podría sumergir al testigo en un coma disociativo aún más profundo de forma irreversible."
    ],
    opciones: [
      { texto: "Reproducir el audio brusco cerca de su oído (Vía Clínica)", destino: 6 },
      { texto: "Mencionar el nombre encontrado en el diario (Vía Policial)", destino: 7 },
      { texto: "Comparar la hora del diario con tu propia libreta (Vía Introspectiva)", destino: 8 }
    ]
  },

  6: {
    titulo: "PANTALLA 06: VÍA CLÍNICA",
    texto: [
      "Acercas el altavoz de la grabadora y reproduces el fragmento de estática junto a la voz distorsionada a alto volumen.",
      "El cuerpo del sujeto se tensa violentamente; los músculos de su cuello se marcan y una gota de sudor frío corre por su mejilla.",
      "El monitor cardíaco emite un pitido de alarma agudo debido al disparo autonómico de su ritmo cardíaco.",
      "El médico de guardia te advierte desde la puerta que el sistema nervioso del paciente está al límite de la tolerancia."
    ],
    opciones: [
      { texto: "Aumentar la ganancia del audio para forzar el habla", destino: 9 },
      { texto: "Detener el audio y buscar datos del sospechoso en la red", destino: 7 }
    ]
  },

  7: {
    titulo: "PANTALLA 07: VÍA POLICIAL",
    texto: [
      "Pronuncias el nombre escrito en el diario con voz clara y firme en medio del silencio de la habitación.",
      "El sujeto no parpadea, pero sus dedos de la mano izquierda se contraen levemente contra la sábana.",
      "Consultas la base de datos de la policía desde tu terminal móvil y descubres que el nombre corresponde a un sospechoso libre.",
      "Sin embargo, notas que faltan tres páginas en el expediente oficial digitalizado de la noche del crimen."
    ],
    opciones: [
      { texto: "Solicitar una orden de captura contra el sospechoso", destino: 10 },
      { texto: "Investigar por qué faltan páginas en tu propio informe", destino: 8 }
    ]
  },

  8: {
    titulo: "PANTALLA 08: VÍA INTROSPECTIVA",
    texto: [
      "Abres tu bitácora oficial de servicio para verificar tus movimientos de la noche en que ocurrió el homicidio.",
      "Con horror, descubres una laguna temporal sin justificar: hay un vacío completo entre las 02:00 AM y las 04:00 AM.",
      "Tus propias notas manuscritas muestran un trazo tembloroso e incoherente idéntico a los garabatos del cuaderno del testigo.",
      "Una punzada de dolor de cabeza punzante te hace dudar sobre la exactitud de tus propios recuerdos de esa madrugada."
    ],
    opciones: [
      { texto: "Buscar los archivos de audio borrados en la central", destino: 11 },
      { texto: "Exigirle al testigo que te mire directamente a los ojos", destino: 12 }
    ]
  },

  9: {
    titulo: "PANTALLA 09: COLAPSO SENSORIAL",
    texto: [
      "El sonido saturado sobrepasa el umbral de resistencia del sujeto, provocando un espasmo muscular generalizado.",
      "Los monitores médicos comienzan a sonar en tono de emergencia continua mientras el equipo de enfermería ingresa a la sala.",
      "Has destruido la única vía directa de comunicación clínica mediante una estimulación sensorial excesiva e imprudente.",
      "El caso se desmorona y solo te queda una maniobra desesperada antes de que te retiren la placa."
    ],
    opciones: [
      { texto: "Tomar una medida extrema de intervención", destino: 16 }
    ]
  },

  10: {
    titulo: "PANTALLA 10: EL SOSPECHOSO EXTERNO",
    texto: [
      "Tus patrullas interceptan al individuo mencionado en el diario en las inmediaciones del hospital psiquiátrico.",
      "Ingresas a la sala de interrogatorios provisional con el sospechoso acorralado y flanqueado por agentes armados.",
      "El hombre mantiene una sonrisa helada y asegura que no hay pruebas materiales que lo vinculen directamente con la escena.",
      "El tiempo se agota y debes decidir cómo utilizar la poca evidencia recolectada."
    ],
    opciones: [
      { texto: "Priorizar la protección y salud del testigo", destino: 13 },
      { texto: "Confrontar al sospechoso con las cintas de audio", destino: 14 }
    ]
  },

  11: {
    titulo: "PANTALLA 11: EL ARCHIVO PERDIDO",
    texto: [
      "Logras restaurar un archivo de audio cifrado del servidor de la central telefónica usando tus credenciales de acceso.",
      "Al ponerse los auriculares, la grabación revela una llamada de emergencia realizada desde la escena del crimen a las 03:14 AM.",
      "La voz del agresor resuena en la línea con escalofriante nitidez mientras la víctima intenta defenderse al fondo.",
      "La onda de frecuencia de la voz coincide de forma alarmante con un patrón que te resulta terriblemente familiar."
    ],
    opciones: [
      { texto: "Usar la grabación para acorralar al sospechoso externo", destino: 14 },
      { texto: "Analizar el espectro de frecuencia con tu propio registro de voz", destino: 15 }
    ]
  },

  12: {
    titulo: "PANTALLA 12: EL ESPEJO EN MORSE",
    texto: [
      "Te inclinas a pocos centímetros del rostro inmóvil del testigo y lo tomas suavemente por los hombros.",
      "De repente, los párpados del sujeto comienzan a moverse en ráfagas rápidas, rítmicas y deliberadas.",
      "Descifras la secuencia de parpadeos: es código Morse militar repitiendo una y otra vez la palabra 'TÚ'.",
      "El sujeto no tiene miedo al vacío de la habitación; el terror absoluto en sus ojos está dirigido hacia ti."
    ],
    opciones: [
      { texto: "Enfrentar la verdad oculta en tu memoria disociada", destino: 15 }
    ]
  },

  13: {
    titulo: "PANTALLA 13: DILEMA ÉTICO (CLÍMAX A)",
    texto: [
      "Reconoces que presionar al testigo en su estado actual es un acto inhumano que quebrantaría su mente para siempre.",
      "Decides ordenar el cese inmediato de todo interrogatorio forzado y firmas la transferencia a una unidad de cuidados intensivos.",
      "Al sentir que la amenaza de la presión ha cesado, la mano del paciente se mueve lentamente sobre las sábanas.",
      "Con un esfuerzo agónico, el testigo señala con el índice hacia una ranura en el rodapié de la habitación."
    ],
    opciones: [
      { texto: "Examinar la ranura revelada por el testigo", destino: 17 }
    ]
  },

  14: {
    titulo: "PANTALLA 14: LA CONFRONTACIÓN (CLÍMAX B)",
    texto: [
      "Sacas la cinta de audio y el diario manuscrito, colocándolos sobre la mesa frente al sospechoso exterior.",
      "La tensión en la sala se vuelve sofocante mientras los oficiales aguardan tu orden para proceder con el arresto.",
      "Dependiendo de qué tan sólidas sean tus pruebas, el acusado se quebrará o sus abogados anularán todo el proceso.",
      "Es el instante decisivo para determinar el destino legal de toda la investigación."
    ],
    opciones: [
      { texto: "Presentar las evidencias físicas consolidadas", destino: 17 },
      { texto: "Presionar agresivamente sin respaldo probatorio legal", destino: 18 }
    ]
  },

  15: {
    titulo: "PANTALLA 15: GIRO DE CULPABILIDAD (CLÍMAX C)",
    texto: [
      "Los fragmentos de memoria reprimida colisionan de golpe contra tu conciencia: la madrugada del crimen tú estuviste allí.",
      "Sufriste un episodio de disociación psicótica en la escena y cometiste el acto mientras el testigo te observaba en la penumbra.",
      "La catatonia del paciente no fue provocada por el crimen en sí, sino por el trauma incomprensible de ver al detective a cargo.",
      "El espejo de la sala te devuelve la imagen del verdadero culpable vistiendo la placa policial."
    ],
    opciones: [
      { texto: "Aceptar la responsabilidad y confesar ante el equipo", destino: 18 }
    ]
  },

  16: {
    titulo: "PANTALLA 16: LA DESESPERACIÓN (CLÍMAX D)",
    texto: [
      "Ignorando las órdenes médicas de arresto administrativo, aplicas una descarga eléctrica de electrodos en el testigo.",
      "Un grito ahogado retumba en la sala clínica mientras los monitores cardíacos entran en una línea plana alarmante.",
      "Has destruido de forma irremediable el tejido neurológico del único testigo del caso por pura precipitación.",
      "Los guardias de seguridad echan abajo la puerta para reducirte violentamente en el suelo."
    ],
    opciones: [
      { texto: "Asumir las consecuencias del colapso clínico", destino: 18 }
    ]
  },

  17: {
    titulo: "PANTALLA 17: LA PRUEBA DEFINITIVA",
    texto: [
      "En el escondite revelado encuentras una tarjeta de memoria micro-SD intacta que contiene el video del crimen.",
      "Las imágenes muestran al sospechoso exterior ejecutando el delito con total premeditación, exculpando de todo al testigo.",
      "El equipo fiscal convalida la evidencia y emite la orden de prisión preventiva de forma inmediata e irrevocable.",
      "Te acercas al testigo para comunicarle que el peligro ha desaparecido para siempre."
    ],
    opciones: [
      { texto: "Ver la resolución final del caso", destino: 19 }
    ]
  },

  18: {
    titulo: "PANTALLA 18: EL COLAPSO Y LA REVELACIÓN",
    texto: [
      "Las piezas finales del rompecabezas encajan de forma trágica sobre el escritorio de la jefatura de policía.",
      "Las malas decisiones, los errores de procedimiento o la revelación de tu propia culpa han clausurado la investigación.",
      "El silencio en la sala de interrogatorios es absoluto mientras se redacta el acta final del expediente.",
      "El destino de todos los involucrados ha quedado sellado sin posibilidad de retorno."
    ],
    opciones: [
      { texto: "Proceder a la lectura del veredicto final", destino: 20 }
    ]
  },

  19: {
    titulo: "FINAL 1: LUCIDEZ",
    texto: [
      "DESENLACE: CASO RESUELTO CON ÉXITO.",
      "El verdadero culpable ha sido arrestado y condenado a cadena perpetua gracias a las pruebas obtenidas de forma ética.",
      "El testigo despierta gradualmente de su estado catatónico tras varias semanas de terapia de rehabilitación neurológica.",
      "Cierras el expediente con la satisfacción del deber cumplido, sabiendo que la justicia ha prevalecido sobre el caos."
    ],
    opciones: [
      { texto: "Reiniciar la Novela Visual", destino: 1 }
    ]
  },

  20: {
    titulo: "FINAL 2 / FINAL 3: RESOLUCIÓN FÍDICA",
    texto: [
      "DESENLACE: EL SILENCIO Y LA SOMBRA.",
      "Si llegaste impulsado por la negligencia (Ruta B): El sospechoso quedó libre, el testigo sufrió daño irreversible y quedaste obsesionado visitando una habitación vacía por el resto de tus días.",
      "Si llegaste tras descubrir tu propia culpabilidad (Ruta C): El testigo rompe la parálisis solo para señalarte ante los agentes. Eres arrestado en el acto y caes en un estado de estupor catatónico idéntico en tu propia celda.",
      "La oscuridad engulle definitivamente los secretos de la Habitación 402."
    ],
    opciones: [
      { texto: "Reiniciar la Novela Visual", destino: 1 }
    ]
  }
};

// =============================================================================
// CONFIGURACIÓN Y RENDERIZADO EN P5.JS
// =============================================================================

function setup() {
  createCanvas(900, 600);
  textFont('Georgia');
  cargarPantalla(pantallaActual);
}

function draw() {
  // Fondo estilo Thriller / Interfaz
  background(15, 18, 22);

  // Marco de interfaz tipo expediente
  stroke(60, 70, 80);
  strokeWeight(2);
  noFill();
  rect(15, 15, width - 30, height - 30);
  rect(20, 20, width - 40, height - 40);

  // Encabezado
  fill(180, 40, 40);
  noStroke();
  textSize(20);
  textAlign(LEFT, TOP);
  text("EXPEDIENTE POLICIAL #402 // THRILLER PSICOLÓGICO", 40, 35);

  let p = historia[pantallaActual];

  // Título de la pantalla
  fill(220, 220, 220);
  textSize(22);
  textStyle(BOLD);
  text(p.titulo, 40, 70);

  // Renderizado del texto narrativo (mínimo 4 líneas por pantalla)
  textSize(15);
  textStyle(NORMAL);
  fill(170, 180, 190);
  let yTexto = 115;
  for (let i = 0; i < p.texto.length; i++) {
    text(p.texto[i], 40, yTexto, width - 80);
    yTexto += 45; // Separación entre líneas de texto
  }

  // Dibujar botones de decisiones
  for (let i = 0; i < botones.length; i++) {
    botones[i].dibujar();
  }
}

// Carga de nodos y creación dinámica de botones
function cargarPantalla(num) {
  pantallaActual = num;
  botones = [];
  let p = historia[pantallaActual];
  
  let yInicioBotones = height - 50 - (p.opciones.length * 45);

  for (let i = 0; i < p.opciones.length; i++) {
    let opt = p.opciones[i];
    let btn = new Boton(40, yInicioBotones + (i * 45), width - 80, 38, opt.texto, opt.destino);
    botones.push(btn);
  }
}

function mousePressed() {
  for (let i = 0; i < botones.length; i++) {
    if (botones[i].esClickeado(mouseX, mouseY)) {
      cargarPantalla(botones[i].destino);
      break;
    }
  }
}

// Clase para gestión de botones interactivos
class Boton {
  constructor(x, y, w, h, texto, destino) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.texto = texto;
    this.destino = destino;
  }

  dibujar() {
    let hover = this.esClickeado(mouseX, mouseY);
    
    if (hover) {
      fill(140, 30, 30);
      stroke(220, 220, 220);
    } else {
      fill(25, 30, 38);
      stroke(80, 90, 100);
    }

    strokeWeight(1);
    rect(this.x, this.y, this.w, this.h, 3);

    fill(hover ? 255 : 200);
    noStroke();
    textSize(14);
    textAlign(LEFT, CENTER);
    text("> " + this.texto, this.x + 15, this.y + this.h / 2);
  }

  esClickeado(mx, my) {
    return mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h;
  }
}
