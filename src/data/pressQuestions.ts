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

export function getRandomPressQuestion(): PressQuestion {
  const index = Math.floor(Math.random() * PRESS_QUESTIONS.length);
  return PRESS_QUESTIONS[index];
}
