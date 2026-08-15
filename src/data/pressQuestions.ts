import { PressQuestion } from "../types";

export const PRESS_QUESTIONS: PressQuestion[] = [
  {
    id: "press_01",
    category: "Prensa",
    reporter: "Diario Marca / L'Équipe",
    question: "Periodista: 'Tras una temporada brillante, muchos te sitúan ya entre la élite mundial. ¿Te consideras preparado para ganar el Balón de Oro?'",
    options: [
      {
        text: "Trabajo duro cada día para ser el número uno del fútbol mundial.",
        effectText: "Demuestras gran ambición. Tu nivel y rendimiento aumentan (+1 Nivel).",
        statBonus: { levelDelta: 1, scoreDelta: 25 }
      },
      {
        text: "Lo único importante son los títulos colectivos con mi equipo.",
        effectText: "Te ganas el respeto y admiración total del vestuario (+50 PTS Leyenda).",
        statBonus: { scoreDelta: 50 }
      },
      {
        text: "Todavía no habéis visto mi mejor versión en el terreno de juego.",
        effectText: "Aumentas las expectativas de prensa y aficionados (+1 Nivel).",
        statBonus: { levelDelta: 1 }
      }
    ]
  },
  {
    id: "press_02",
    category: "Mercado",
    reporter: "Sky Sports / Fabrizio Romano",
    question: "Periodista: 'Los rumores sobre el interés de gigantes europeos son cada vez más fuertes. ¿Garantizas tu continuidad la próxima temporada?'",
    options: [
      {
        text: "Estoy feliz y 100% comprometido con mi club actual.",
        effectText: "La afición te idolatra por tu lealtad (+40 PTS Leyenda).",
        statBonus: { scoreDelta: 40 }
      },
      {
        text: "En el fútbol profesional nunca se sabe qué puede ocurrir en el mercado.",
        effectText: "Tu cotización y valor de mercado suben. Un ojeador toma nota (+1 Nivel).",
        statBonus: { levelDelta: 1, scoreDelta: 30 }
      },
      {
        text: "Mi representante se encarga del futuro; yo solo pienso en jugar.",
        effectText: "Respuesta diplomática que mantiene abiertas todas las opciones.",
        statBonus: { scoreDelta: 10 }
      }
    ]
  },
  {
    id: "press_03",
    category: "Vestuario",
    reporter: "El Chiringuito / Cadena SER",
    question: "Periodista: 'El entrenador te ha sustituido en varios partidos decisivos. ¿Existe tensión o desacuerdo en el vestuario?'",
    options: [
      {
        text: "El míster busca lo mejor para el equipo y respeto absolutamente sus decisiones.",
        effectText: "El cuerpo técnico valora tu disciplina y madurez profesional (+1 Nivel).",
        statBonus: { levelDelta: 1 }
      },
      {
        text: "A nadie le gusta salir del campo, cualquier futbolista quiere jugar los 90 minutos.",
        effectText: "Demuestras carácter competitivo, aunque genera cierto debate en medios.",
        statBonus: { scoreDelta: 20 }
      },
      {
        text: "Lo que hablamos en el vestuario se queda dentro del vestuario.",
        effectText: "Estrategia blindada que protege la privacidad de la plantilla.",
        statBonus: { scoreDelta: 15 }
      }
    ]
  },
  {
    id: "press_04",
    category: "Patrocinio",
    reporter: "Gazzetta dello Sport",
    question: "Una reconocida marca multinacional de alta gama te ofrece grabar un anuncio internacional justo en el parón de selecciones.",
    options: [
      {
        text: "Aceptas la oferta comercial y firmas un jugoso contrato exclusivo.",
        effectText: "Sumas importantes ingresos financieros a tus arcas (+2 M€).",
        statBonus: { moneyDelta: 2, scoreDelta: 15 }
      },
      {
        text: "Rechazas el rodaje para concentrarte al 100% en los entrenamientos físicamente.",
        effectText: "Tu enfoque deportivo total se refleja en tu estado de forma (+1 Nivel).",
        statBonus: { levelDelta: 1 }
      }
    ]
  },
  {
    id: "press_05",
    category: "Afición",
    reporter: "Televisión Deportiva",
    question: "Periodista: 'Un sector de la afición exige mayor efectividad ofensiva tras la racha de partidos exigentes. ¿Qué les transmites?'",
    options: [
      {
        text: "Nos dejaremos el alma en el césped en cada partido por esta camiseta.",
        effectText: "El estadio entero te ovaciona en el próximo encuentro (+30 PTS Leyenda).",
        statBonus: { scoreDelta: 30 }
      },
      {
        text: "Pedimos paciencia y confianza, el rendimiento individual y del bloque llegará.",
        effectText: "Aportas serenidad en momentos de máxima presión mediática (+1 Nivel).",
        statBonus: { levelDelta: 1 }
      }
    ]
  },
  {
    id: "press_06",
    category: "Entrevista",
    reporter: "Revista Mundial de Fútbol",
    question: "Periodista: 'Si tuvieras que definir tu filosofía como futbolista en una sola frase, ¿cuál sería?'",
    options: [
      {
        text: "'La perseverancia vence al talento cuando el talento no se esfuerza.'",
        effectText: "Inspiras a jóvenes promesas y mejoras tu liderazgo (+1 Nivel).",
        statBonus: { levelDelta: 1, scoreDelta: 25 }
      },
      {
        text: "'Jugar con la cabeza fría, el corazón caliente y la máxima ambición.'",
        effectText: "Tu perfil como estrella mundial se consolida (+35 PTS Leyenda).",
        statBonus: { scoreDelta: 35 }
      },
      {
        text: "'Disfrutar de cada segundo con el balón en los pies.'",
        effectText: "Muestras un fútbol alegre y vistoso que enamora a los hinchas.",
        statBonus: { scoreDelta: 20 }
      }
    ]
  },
  {
    id: "press_07",
    category: "Entrevista",
    reporter: "BBC Sport / ESPN",
    question: "Periodista: 'Te recriminan en redes sociales no haber asistido a un compañero en la última jugada del partido.'",
    options: [
      {
        text: "En milésimas de segundo asumí la responsabilidad de tirar a puerta.",
        effectText: "Refuerzas tu olfato de cara al gol e instinto rematador.",
        statBonus: { scoreDelta: 15 }
      },
      {
        text: "Analicé el vídeo, vi que tenía mejor opción y le pedí disculpas en el vestuario.",
        effectText: "Excelente gesto de humildad y química de equipo (+1 Nivel).",
        statBonus: { levelDelta: 1 }
      }
    ]
  },
  {
    id: "press_08",
    category: "Prensa",
    reporter: "Radio Nacional Deportes",
    question: "Periodista: 'Se especula con una astronómica oferta del fútbol de la liga de Arabia o EEUU. ¿Valorarías el aspecto económico?'",
    options: [
      {
        text: "La gloria deportiva y competir en Europa vale más que cualquier fortuna.",
        effectText: "Te coronas como leyenda auténtica del fútbol europeo (+50 PTS Leyenda).",
        statBonus: { scoreDelta: 50 }
      },
      {
        text: "Un profesional debe valorar todas las ofertas pensando en el futuro.",
        effectText: "Mantienes abiertas las opciones y atraes nuevos patrocinios (+1 M€).",
        statBonus: { moneyDelta: 1, levelDelta: 0.5 }
      }
    ]
  },
  {
    id: "press_09",
    category: "Vestuario",
    reporter: "Diario As / Tuttosport",
    question: "Periodista: 'Varios compañeros veteranos destacan tu voz en las charlas previas al partido. ¿Te ves luciendo el brazalete de capitán?'",
    options: [
      {
        text: "Sería un orgullo inmenso liderar a este grupo como capitán.",
        effectText: "Asumes galones de líder absoluto en la plantilla (+1 Nivel).",
        statBonus: { levelDelta: 1, scoreDelta: 30 }
      },
      {
        text: "El liderazgo se demuestra en el campo con acciones, no con un brazalete.",
        effectText: "Muestras madurez técnica impecable (+25 PTS Leyenda).",
        statBonus: { scoreDelta: 25 }
      }
    ]
  },
  {
    id: "press_10",
    category: "Prensa",
    reporter: "Kicker / Bild",
    question: "Periodista: '¿Qué opinas del nivel de arbitraje y del uso del VAR en la liga esta temporada?'",
    options: [
      {
        text: "El trabajo arbitral es muy difícil; debemos centrarnos en nuestro juego.",
        effectText: "Muestras un juego limpio ejemplar alabado por la federación.",
        statBonus: { scoreDelta: 20 }
      },
      {
        text: "El VAR debe unificar criterios porque hay decisiones incomprensibles.",
        effectText: "Tus declaraciones generan gran repercusión mediática (+1 Nivel).",
        statBonus: { levelDelta: 1 }
      }
    ]
  }
];

export const MANAGEMENT_QUESTIONS: PressQuestion[] = [
  {
    id: "mgmt_01",
    category: "Agente",
    reporter: "Oficinas del Representante",
    question: "Gestión de Carrera: Un prestigioso superagente internacional te ofrece unirse a su agencia VIP. Promete mayores comisiones, patrocinios globales y facilidades para fichar por clubes de la élite europea.",
    options: [
      {
        text: "Firmar con la Agencia VIP Internacional.",
        effectText: "Te abre las puertas de los gigantes de Europa (+1.5 Nivel OVR / +1 M€).",
        statBonus: { levelDelta: 1.5, moneyDelta: 1, scoreDelta: 30 }
      },
      {
        text: "Mantener a tu representante de confianza de toda la vida.",
        effectText: "Tu lealtad fortalece la estabilidad de tu entorno (+45 Puntos Leyenda).",
        statBonus: { scoreDelta: 45 }
      },
      {
        text: "Gestionar tú mismo tus propios contratos sin comisiones de intermediarios.",
        effectText: "Ahorras sustanciales comisiones financieras (+2 M€).",
        statBonus: { moneyDelta: 2, scoreDelta: 15 }
      }
    ]
  },
  {
    id: "mgmt_02",
    category: "Equipación",
    reporter: "Departamento de Material Deportivo",
    question: "Gestión de Equipación: Una firma multinacional de calzado deportivo te propone diseñar tus propias botas personalizadas con fibra de carbono para maximizar tu rendimiento.",
    options: [
      {
        text: "Invertir en tus botas de fibra de carbono a medida.",
        effectText: "Optimizas tu aceleración y potencia de disparo en el campo (+1 Nivel OVR).",
        statBonus: { levelDelta: 1, scoreDelta: 20 }
      },
      {
        text: "Aceptar un patrocinio exclusivo de botas estándar.",
        effectText: "Cobras una jugosa prima económica por el acuerdo de calzado (+1.5 M€).",
        statBonus: { moneyDelta: 1.5, scoreDelta: 15 }
      },
      {
        text: "Jugar con las botas tradicionales del club.",
        effectText: "Mantienes una estética austera muy valorada por la hinchada (+30 PTS Leyenda).",
        statBonus: { scoreDelta: 30 }
      }
    ]
  },
  {
    id: "mgmt_03",
    category: "Staff",
    reporter: "Centro de Alto Rendimiento",
    question: "Gestión de Salud y Preparación: Tu preparador físico te sugiere contratar un fisioterapeuta, nutricionista y recuperador personal exclusivo para trabajar diariamente en tu domicilio.",
    options: [
      {
        text: "Contratar al Staff Personal VIP de alta rendimiento.",
        effectText: "Optimizas tu tono muscular y aceleras tu evolución deportiva (+1 Nivel OVR).",
        statBonus: { levelDelta: 1, scoreDelta: 25 }
      },
      {
        text: "Trabajar únicamente con los servicios médicos oficiales de la plantilla.",
        effectText: "Rendimiento óptimo manteniendo tus ahorros protegidos.",
        statBonus: { scoreDelta: 10 }
      }
    ]
  },
  {
    id: "mgmt_04",
    category: "Inversiones",
    reporter: "Gabinete Financiero",
    question: "Gestión Patrimonial: Tu asesor financiero te presenta un plan estratégico para diversificar tus ganancias en activos inmobiliarios, franquicias de restauración y startups tecnológicas.",
    options: [
      {
        text: "Invertir en el fondo inmobiliario y negocios internacionales.",
        effectText: "Multiplicas sustancialmente tu fortuna e ingresos patrimoniales (+3 M€).",
        statBonus: { moneyDelta: 3, scoreDelta: 20 }
      },
      {
        text: "Fundar tu propia escuela de fútbol base para jóvenes talentos.",
        effectText: "Creas un legado de impacto social inolvidable (+50 Puntos Leyenda).",
        statBonus: { scoreDelta: 50 }
      },
      {
        text: "Mantener tu dinero en depósitos bancarios de alta seguridad.",
        effectText: "Tranquilidad financiera total sin asumir riesgos.",
        statBonus: { scoreDelta: 10 }
      }
    ]
  },
  {
    id: "mgmt_05",
    category: "Finanzas",
    reporter: "Asesoría de Imagen y Lujo",
    question: "Gestión de Estilo de Vida: Tus asesores de imagen recomiendan adquirir una residencia VIP en la zona más exclusiva y un vehículo deportivo de alta gama para proyectar estatus mediático.",
    options: [
      {
        text: "Adquirir la residencia VIP y el vehículo deportivo.",
        effectText: "Te conviertes en una figura mediática y de la moda mundial (+45 Puntos Leyenda).",
        statBonus: { scoreDelta: 45, moneyDelta: -0.5 }
      },
      {
        text: "Llevar un estilo de vida austero y centrado al 100% en el fútbol.",
        effectText: "Te ganas el respeto total de tus compañeros y la prensa por tu humildad (+1 Nivel OVR).",
        statBonus: { levelDelta: 1, scoreDelta: 25 }
      }
    ]
  },
  {
    id: "mgmt_06",
    category: "Patrocinio",
    reporter: "Productora Audiovisual Internacional",
    question: "Gestión de Marca Personal: Una plataforma de streaming líder desea rodar un documental sobre tu vida privada y trayectoria deportiva.",
    options: [
      {
        text: "Firmar la producción del documental sobre tu carrera.",
        effectText: "Disparas tu popularidad global y firmas cuantiosos acuerdos (+2 M€ / +35 PTS Leyenda).",
        statBonus: { moneyDelta: 2, scoreDelta: 35 }
      },
      {
        text: "Declinar la propuesta para priorizar la privacidad de tu familia.",
        effectText: "Enfoque deportivo total que se nota en tus entrenamientos (+1 Nivel OVR).",
        statBonus: { levelDelta: 1, scoreDelta: 15 }
      }
    ]
  }
];

export const EXTERNAL_FACTORS_QUESTIONS: PressQuestion[] = [
  {
    id: "ext_01",
    category: "Factores Externos",
    reporter: "Condiciones Climatológicas Extremas",
    question: "Factor Externo · Temporal de Lluvia y Césped Embarrado: El partido decisivo de la temporada se disputa bajo un diluvio torrencial con el césped impracticable y charcos en las áreas.",
    options: [
      {
        text: "Adaptar tu juego: disparar desde lejos y presionar al fallo rival.",
        effectText: "Tu lectura táctica bajo el temporal desatasca el encuentro (+1 Nivel OVR / +30 PTS Leyenda).",
        statBonus: { levelDelta: 1, scoreDelta: 30 }
      },
      {
        text: "Cambiar tacos de bota y jugar con máxima precaución física.",
        effectText: "Evitas lesiones musculares y completas los 90 minutos con solidez.",
        statBonus: { scoreDelta: 15 }
      },
      {
        text: "Asumir la batuta del equipo y pedir balones al espacio aéreo.",
        effectText: "Tu liderazgo épico bajo la lluvia enfervoriza a la grada (+40 PTS Leyenda).",
        statBonus: { scoreDelta: 40 }
      }
    ]
  },
  {
    id: "ext_02",
    category: "Factores Externos",
    reporter: "Redes Sociales y Prensa Rosa",
    question: "Factor Externo · Polémica Viral en Redes: Se filtran unas imágenes tuyas en una fiesta privada de cumpleaños 48 horas antes de un encuentro importante. Los programas de televisión abren debate sobre tu compromiso.",
    options: [
      {
        text: "Emitir un comunicado disculpándote y donar una prima a la fundación del club.",
        effectText: "Zanjas la polémica con madurez y devuelves la calma al club (+35 PTS Leyenda).",
        statBonus: { scoreDelta: 35, moneyDelta: -0.2 }
      },
      {
        text: "Callar y responder con un partidazo y un golazo sobre el terreno de juego.",
        effectText: "Tu carácter ganador silencia todas las críticas (+1.5 Nivel OVR).",
        statBonus: { levelDelta: 1.5, scoreDelta: 25 }
      },
      {
        text: "Criticar la invasión a la privacidad de tu vida privada en tus redes.",
        effectText: "Aumentas tus seguidores e impacto mediático (+1 M€ de patrocinios).",
        statBonus: { moneyDelta: 1, scoreDelta: 10 }
      }
    ]
  },
  {
    id: "ext_03",
    category: "Factores Externos",
    reporter: "Crisis Institucional del Club",
    question: "Factor Externo · Destitución Fulminante del Entrenador: Tras tres derrotas consecutivas, la directiva echa al míster y ficha a un técnico estricto y exigente con doble sesión diaria obligatoria.",
    options: [
      {
        text: "Entrenar al 120% para ganarte la titularidad indiscutible con el nuevo míster.",
        effectText: "El nuevo entrenador te convierte en el eje del nuevo esquema táctico (+1.5 Nivel OVR).",
        statBonus: { levelDelta: 1.5, scoreDelta: 35 }
      },
      {
        text: "Ejercer de capitán y unir al vestuario en torno al proyecto.",
        effectText: "Consolidarás el respeto absoluto del grupo y de la directiva (+50 PTS Leyenda).",
        statBonus: { scoreDelta: 50 }
      },
      {
        text: "Pedir a tu representante que sondee ofertas de salida en el mercado.",
        effectText: "Despiertas el interés de grandes clubes europeos (+1 M€ valor).",
        statBonus: { scoreDelta: 20 }
      }
    ]
  },
  {
    id: "ext_04",
    category: "Factores Externos",
    reporter: "Mercado Internacional de Petrodólares",
    question: "Factor Externo · Ofertón Mareante de Arabia Saudí: Un emisario del fútbol árabe te ofrece multiplicar por cinco tu salario con una prima de fichaje inmediata de 15 M€.",
    options: [
      {
        text: "Rechazar la oferta: 'Mi sueño es competir por la Champions y ganar trofeos en Europa'.",
        effectText: "La afición te corona como un héroe de lealtad deportiva (+60 PTS Leyenda / +1 Nivel OVR).",
        statBonus: { scoreDelta: 60, levelDelta: 1 }
      },
      {
        text: "Utilizar el interés saudí para renovar al alza con tu club actual.",
        effectText: "Logras una mejora sustancial en tu contrato profesional (+3 M€).",
        statBonus: { moneyDelta: 3, scoreDelta: 25 }
      },
      {
        text: "Aceptar el multimillonario contrato y asegurar el futuro de tu familia.",
        effectText: "Multiplicas exponencialmente tu fortuna personal (+10 M€).",
        statBonus: { moneyDelta: 10, scoreDelta: 15 }
      }
    ]
  },
  {
    id: "ext_05",
    category: "Factores Externos",
    reporter: "Comité Arbitral y Polémica VAR",
    question: "Factor Externo · Escándalo Arbitral en el Descuento: En el minuto 94 te anulan un gol totalmente legal por un fuera de juego milimétrico revisado por el VAR que os cuesta el liderato.",
    options: [
      {
        text: "Mantener la elegancia en zona mixta: 'Los árbitros aciertan y fallan; debemos mejorar nosotros'.",
        effectText: "Recibes el premio Fair Play de la federación (+45 PTS Leyenda).",
        statBonus: { scoreDelta: 45 }
      },
      {
        text: "Expresar tu rabia constructiva y jurar revancha en la siguiente jornada.",
        effectText: "Tu motivación por las nubes se traduce en rabia competitiva (+1.5 Nivel OVR).",
        statBonus: { levelDelta: 1.5, scoreDelta: 20 }
      }
    ]
  },
  {
    id: "ext_06",
    category: "Factores Externos",
    reporter: "Hinchada Rival y Ambiente Hostil",
    question: "Factor Externo · Noche Hostil en el Hotel de Concentración: Aficionados del eterno rival acuden a medianoche con bengalas, petardos y cánticos frente al hotel para impedir el descanso del equipo.",
    options: [
      {
        text: "Usar tapones, realizar meditación guiada y descansar con máxima concentración.",
        effectText: "Llegas fresco al partido y rindes a un nivel físico estratosférico (+1 Nivel OVR).",
        statBonus: { levelDelta: 1, scoreDelta: 25 }
      },
      {
        text: "Asomarte a la ventana con una sonrisa retadora que caldea el derbi.",
        effectText: "Te conviertes en la pesadilla de la afición contraria (+35 PTS Leyenda).",
        statBonus: { scoreDelta: 35 }
      }
    ]
  },
  {
    id: "ext_07",
    category: "Factores Externos",
    reporter: "Parón Internacional y Jet Lag",
    question: "Factor Externo · Vuelo Trasatlántico Agotador: Regresas de jugar dos partidos de clasificación mundialista con tu Selección con un vuelo de 13 horas que llega el mismo día del partido de liga.",
    options: [
      {
        text: "Pedir jugar de inicio a pesar del cansancio: 'Por este club juego sin dormir'.",
        effectText: "Tu entrega descomunal conmueve al entrenador y a la grada (+40 PTS Leyenda).",
        statBonus: { scoreDelta: 40 }
      },
      {
        text: "Hacer sesión de crioterapia e iniciar en el banquillo como revulsivo en el segundo tiempo.",
        effectText: "Entras fresco en el minuto 60 y revolucionas el partido con tu talento (+1 Nivel OVR).",
        statBonus: { levelDelta: 1, scoreDelta: 30 }
      }
    ]
  },
  {
    id: "ext_08",
    category: "Factores Externos",
    reporter: "Vida Personal y Familia",
    question: "Factor Externo · Nacimiento y Vida Familiar: La noche previa a una semifinal europea nace tu hijo/a o se celebra un evento familiar crucial e inolvidable.",
    options: [
      {
        text: "Dedicar el partido a tu familia y salir al césped con una motivación celestial.",
        effectText: "Firmas una de las actuaciones más emotivas y mágicas de tu vida (+2 Nivel OVR / +50 PTS Leyenda).",
        statBonus: { levelDelta: 2, scoreDelta: 50 }
      },
      {
        text: "Celebrarlo con la afición luciendo un mensaje especial bajo la camiseta.",
        effectText: "Creas una de las fotos icónicas de la historia del torneo (+40 PTS Leyenda).",
        statBonus: { scoreDelta: 40 }
      }
    ]
  }
];

export function getRandomPressQuestion(): PressQuestion {
  const index = Math.floor(Math.random() * PRESS_QUESTIONS.length);
  return PRESS_QUESTIONS[index];
}

export function getRandomManagementQuestion(): PressQuestion {
  const index = Math.floor(Math.random() * MANAGEMENT_QUESTIONS.length);
  return MANAGEMENT_QUESTIONS[index];
}

export function getRandomExternalFactorQuestion(): PressQuestion {
  const index = Math.floor(Math.random() * EXTERNAL_FACTORS_QUESTIONS.length);
  return EXTERNAL_FACTORS_QUESTIONS[index];
}

