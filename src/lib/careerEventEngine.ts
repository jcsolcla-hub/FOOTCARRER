import { Player, ActiveSeasonState, SeasonMatchFixture, CareerDecisionEvent, CareerEventOption, PlayerAttributes } from "../types";
import { clamp, randInt, pick } from "../data/clubsAndLeagues";

export function generateCareerEvent(
  p: Player, 
  activeSeason: ActiveSeasonState, 
  upcomingFixture: SeasonMatchFixture | null
): CareerDecisionEvent {
  const opp = upcomingFixture ? upcomingFixture.opponent : "el próximo rival";
  const isCrucial = upcomingFixture ? (upcomingFixture.importance === "Crucial" || upcomingFixture.importance === "Alta") : false;

  const eventPool: CareerDecisionEvent[] = [
    {
      id: "coach_meeting_1",
      category: "Míster",
      speakerTitle: "👔 EL MÍSTER TE LLAMA A SU DESPACHO",
      speakerIcon: "👔",
      title: "Charla táctica antes del próximo partido",
      quote: `"Has estado entrenando bien esta semana. Quiero saber cómo te encuentras físicamente para el choque contra el ${opp}."`,
      contextInfo: `Próximo encuentro: ${opp} (${upcomingFixture?.competition || "Liga"}). Estado actual: ${activeSeason.energy}% Energía, ${activeSeason.fatigue}% Fatiga.`,
      options: [
        {
          id: "starter",
          badgeText: "🟢 Titularidad",
          text: "Estoy al 100%. Quiero ser titular desde el primer minuto.",
          detail: "Demuestra tu confianza. Si rindes bien, ganarás la devoción del cuerpo técnico.",
          effectText: "+5 Confianza Míster | +4 Confianza | Consumo normal de energía",
          type: "starter"
        },
        {
          id: "bench",
          badgeText: "🔵 Revulsivo",
          text: "Prefiero entrar en la segunda parte cuando el rival esté cansado.",
          detail: "Entrar fresco en la 2ª mitad reduce el riesgo de cansancio extremo.",
          effectText: "+3 Moral | -15% Cansancio | Guardas fuerzas",
          type: "bench"
        },
        {
          id: "extra_train",
          badgeText: "🏋️ Sesión Extra",
          text: "Quiero hacer un entrenamiento intensivo extra antes del encuentro.",
          detail: "Arriesgas más cansancio a cambio de aumentar tus probabilidades de mejora física.",
          effectText: "+10% Fatiga | 50% Probabilidad de +1 en Atributo Clave",
          type: "extra_training"
        }
      ]
    },
    {
      id: "vestuario_tension_1",
      category: "Vestuario",
      speakerTitle: "👥 TENSIÓN EN EL VESTUARIO",
      speakerIcon: "👥",
      title: "Rivalidad interna tras el entrenamiento",
      quote: `"Dos compañeros veteranos han discutido acaloradamente sobre la distribución de minutos en el equipo. El ambiente está tenso."`,
      contextInfo: "Relación actual con el vestuario: " + activeSeason.lockerRoomRel + "/100.",
      options: [
        {
          id: "mediate",
          badgeText: "🤝 Mediar y Unir",
          text: "Intervenir para calmar los ánimos y recordar la importancia del grupo.",
          detail: "Muestras madurez y madera de líder ante la plantilla.",
          effectText: "+10 Relación Vestuario | +5 Reputación | +2 Moral",
          type: "vestuario"
        },
        {
          id: "neutral",
          badgeText: "🤐 Mantenerse al Margen",
          text: "No tomar partido y centrarte exclusivamente en tu trabajo diario.",
          detail: "Evitas conflictos pero dejas pasar una oportunidad de liderazgo.",
          effectText: "Sin cambios en la dinámica del vestuario",
          type: "custom"
        },
        {
          id: "talk_coach",
          badgeText: "👔 Informar al Cuerpo Técnico",
          text: "Comentar discretamente la situación con el cuerpo técnico para que intervengan.",
          detail: "El entrenador aprecia tu lealtad pero algunos compañeros podrían verlo con escepticismo.",
          effectText: "+6 Confianza Míster | -4 Relación Vestuario",
          type: "custom"
        }
      ]
    },
    {
      id: "training_focus_1",
      category: "Entrenamiento",
      speakerTitle: "🏋️ SESIÓN DE ENTRENAMIENTO PERSONALIZADO",
      speakerIcon: "🏋️",
      title: "Plan de mejora individual",
      quote: `"El preparador físico te plantea un plan específico para esta semana. ¿En qué faceta de tu juego quieres enfocar tus esfuerzos?"`,
      contextInfo: "Desarrollo realista: La progresión dependerá de tu esfuerzo y descanso.",
      options: [
        {
          id: "shoot_focus",
          badgeText: "⚽ Tiro & Finalización",
          text: "Traba de cara a puerta: voleas, disparos lejanos y definición.",
          detail: "Mejora potencial en potencia y precisión de tiro.",
          effectText: "Probabilidad realista de +1 Tiro o +1 Técnica (+5% Fatiga)",
          type: "custom"
        },
        {
          id: "speed_focus",
          badgeText: "⚡ Velocidad & Regate",
          text: "Sprints cortos, cambios de ritmo y desbordes en velocidad.",
          detail: "Incisividad para ganar duelos individuales.",
          effectText: "Probabilidad realista de +1 Velocidad o +1 Regate (+6% Fatiga)",
          type: "custom"
        },
        {
          id: "pass_focus",
          badgeText: "🎯 Pase & Visión Táctica",
          text: "Pases filtrados, cambios de juego y control orientado.",
          detail: "Visión para organizar el juego ofensivo.",
          effectText: "Probabilidad realista de +1 Pase o +1 Técnica",
          type: "custom"
        },
        {
          id: "rest_physio",
          badgeText: "💆 Fisioterapia & Recuperación",
          text: "Priorizar descarga muscular, baño de hielo y masajes.",
          detail: "Elimina la fatiga acumulada y llega en plena forma al próximo partido.",
          effectText: "-25% Cansancio | +30% Energía | +5 Forma Física",
          type: "rest"
        }
      ]
    },
    {
      id: "press_transfer_1",
      category: "Prensa",
      speakerTitle: "🗞️ RUMORES EN LOS MEDIOS",
      speakerIcon: "🗞️",
      title: "Interés de clubes europeos",
      quote: `"Un periódico deportivo titula que grandes clubes europeos están enviando ojeadores a los partidos del ${p.club} para seguirte."`,
      contextInfo: `Valor de mercado actual: ${p.marketValue.toLocaleString()} €.`,
      options: [
        {
          id: "loyalty",
          badgeText: "❤️ Declarar Lealtad",
          text: `"Estoy muy feliz en el ${p.club} y solo pienso en darlo todo por esta camiseta."`,
          detail: "Conquistas a la afición, a tus compañeros y a la directiva.",
          effectText: "+10 Confianza Míster | +10 Relación Vestuario | +5 Moral",
          type: "press"
        },
        {
          id: "open_door",
          badgeText: "💼 Escuchar Ofertas",
          text: `"Es un orgullo que se fijen en mí, mi agente evaluará el futuro cuando acabe la temporada."`,
          detail: "Aumentas tu atractivo en el mercado pero generas dudas en el club.",
          effectText: "+12% Valor de Mercado | -8 Confianza Míster",
          type: "renewal"
        },
        {
          id: "no_comment",
          badgeText: "🤐 Sin Comentarios",
          text: `"No leo la prensa, estoy centrado únicamente en el entrenamiento."`,
          detail: "Mantienes la cabeza fría y evitas distracciones.",
          effectText: "+5 Confianza | +2 Forma Física",
          type: "custom"
        }
      ]
    },
    {
      id: "young_prospect_1",
      category: "Vestuario",
      speakerTitle: "🌟 CONSEJO A UN CANTERANO",
      speakerIcon: "🌟",
      title: "Mentoría antes del debut",
      quote: `"Un canterano de 17 años que acaba de subir al primer equipo te pide consejo en el vestuario porque está muy nervioso."`,
      contextInfo: "Tu liderazgo en la plantilla inspira a los jóvenes talentos.",
      options: [
        {
          id: "mentor_freedom",
          badgeText: "📖 Dar Confianza",
          text: "Dile que juegue suelto, disfrute de la oportunidad y no tenga miedo al fallo.",
          detail: "Ganas el respeto de todo el vestuario.",
          effectText: "+12 Relación Vestuario | +8 Reputación | +3 Moral",
          type: "vestuario"
        },
        {
          id: "mentor_tactics",
          badgeText: "🎯 Aconsejar Táctica",
          text: "Recomiéndale jugar simple, dar pases seguros y no complicarse en defensa.",
          detail: "Transmites conceptos inteligentes.",
          effectText: "+5 Confianza Míster | +2 Visión Táctica",
          type: "custom"
        }
      ]
    },
    {
      id: "captain_offer_1",
      category: "Carrera",
      speakerTitle: "👑 PROPUESTA DE BRAZALETE",
      speakerIcon: "👑",
      title: "Liderazgo en el terreno de juego",
      quote: `"Ante la baja por lesión del capitán habitual, el vestuario y el míster sugieren que tú portes el brazalete de capitán."`,
      contextInfo: `OVR actual: ${Math.round(p.level)} | Reputación: ${activeSeason.reputation}/100.`,
      options: [
        {
          id: "accept_captain",
          badgeText: "👑 Aceptar Brazalete",
          text: "Aceptar la responsabilidad con orgullo y liderar al equipo.",
          detail: "Asumes la máxima responsabilidad del vestuario.",
          effectText: "+15 Reputación | +10 Confianza Míster | +10 Relación Vestuario",
          type: "captain"
        },
        {
          id: "decline_captain",
          badgeText: "🛡️ Ceder a un Veterano",
          text: "Sugerir que lo lleve otro compañero con más años en la entidad.",
          detail: "Muestras humildad extrema.",
          effectText: "+6 Relación Vestuario | Sin presión adicional",
          type: "custom"
        }
      ]
    }
  ];

  if (isCrucial) {
    eventPool.unshift({
      id: "crucial_match_talk",
      category: "Míster",
      speakerTitle: "🔥 CHARLA MOTIVACIONAL ANTES DEL DERBI / FINAL",
      speakerIcon: "🔥",
      title: "Encuentro trascendental frente al " + opp,
      quote: `"Mañana nos jugamos muchísimo contra el ${opp}. La afición espera lo máximo de ti. ¿Cómo afrontamos tácticamente tu partido?"`,
      contextInfo: "Partido Crucial de Alta Intensidad.",
      options: [
        {
          id: "total_attack",
          badgeText: "⚡ Presión Alta y Ataque",
          text: "Presionar arriba sin complejos y buscar el gol desde el minuto 1.",
          detail: "Aumentas la vocación ofensiva pero gastarás más energía.",
          effectText: "+10% Confianza | +15% Consumo de Energía | +8% Forma",
          type: "starter"
        },
        {
          id: "tactical_control",
          badgeText: "🧠 Control Táctico y Orden",
          text: "Mantener el orden defensivo y esperar el momento oportuno para golpear.",
          detail: "Reduces riesgos de error no forzado.",
          effectText: "+8 Confianza Míster | +5% Visión y Pase",
          type: "tactics"
        }
      ]
    });
  }

  return pick(eventPool);
}

export function processCareerEventChoice(
  option: CareerEventOption,
  activeSeason: ActiveSeasonState,
  p: Player
): {
  toastMsg: string;
  newsHeadline?: string;
  ovrDelta?: number;
} {
  let toastMsg = "";
  let newsHeadline = "";
  let ovrDelta = 0;

  const attrs = activeSeason.attributes;

  if (option.type === "starter") {
    activeSeason.coachTrust = clamp(activeSeason.coachTrust + 5, 0, 100);
    activeSeason.confidence = clamp(activeSeason.confidence + 5, 0, 100);
    activeSeason.morale = clamp(activeSeason.morale + 3, 0, 100);
    toastMsg = "🟢 Has aceptado la titularidad. El míster confía en tu rendimiento.";
    newsHeadline = `📰 "El técnico del ${p.club} confirma que ${p.name} será titular indiscutible en el próximo partido."`;
  } else if (option.type === "bench") {
    activeSeason.coachTrust = clamp(activeSeason.coachTrust + 1, 0, 100);
    activeSeason.fatigue = clamp(activeSeason.fatigue - 15, 0, 100);
    activeSeason.energy = clamp(activeSeason.energy + 15, 10, 100);
    activeSeason.morale = clamp(activeSeason.morale + 4, 0, 100);
    toastMsg = "🔵 Entrarás como revulsivo en la 2ª parte. Conservas frescura física.";
    newsHeadline = `📰 "El entrenador reservará a ${p.name} como baza estratégica para la segunda mitad."`;
  } else if (option.type === "extra_training") {
    activeSeason.fatigue = clamp(activeSeason.fatigue + 10, 0, 100);
    activeSeason.energy = clamp(activeSeason.energy - 10, 10, 100);
    
    // Probabilistic attribute progression (Realistic)
    const roll = Math.random();
    if (roll < 0.40) {
      const keyAttr = pick<keyof PlayerAttributes>(["velocidad", "tiro", "regate", "pase", "fisico", "tecnica"]);
      attrs[keyAttr] = clamp(attrs[keyAttr] + 1, 40, 99);
      ovrDelta = 0.2;
      p.level = clamp(p.level + 0.2, 40, 99);
      toastMsg = `🏋️ ¡Entrenamiento intensivo de éxito! Mejora en ${keyAttr.toUpperCase()} (+1 Atributo).`;
      newsHeadline = `📰 "Impresionante dedicación de ${p.name} completando sesiones extra de entrenamiento."`;
    } else if (roll < 0.80) {
      activeSeason.form = clamp(activeSeason.form + 5, 0, 100);
      toastMsg = "🏋️ Sesión completada con éxito. Mejoras en ritmo de juego y forma física.";
      newsHeadline = `📰 "El cuerpo técnico destaca el gran estado de forma de ${p.name}."`;
    } else {
      toastMsg = "⚠️ Sesión exigente. Sientes cierta carga acumulada en las piernas sin avances mayores.";
      newsHeadline = `📰 "${p.name} completa una exigente jornada de trabajo físico."`;
    }
  } else if (option.type === "rest") {
    activeSeason.fatigue = clamp(activeSeason.fatigue - 25, 0, 100);
    activeSeason.energy = clamp(activeSeason.energy + 30, 10, 100);
    activeSeason.form = clamp(activeSeason.form + 5, 0, 100);
    toastMsg = "💆 Sesión de fisioterapia y descanso completada. Recuperas máxima energía.";
    newsHeadline = `📰 "${p.name} realiza una sesión de recuperación activa para llegar al 100%."`;
  } else if (option.type === "vestuario") {
    activeSeason.lockerRoomRel = clamp(activeSeason.lockerRoomRel + 12, 0, 100);
    activeSeason.reputation = clamp(activeSeason.reputation + 5, 0, 100);
    activeSeason.morale = clamp(activeSeason.morale + 4, 0, 100);
    toastMsg = "🤝 Gran iniciativa. Refuerzas enormemente tu estatus y amistad en el vestuario.";
    newsHeadline = `📰 "Ambiente excelente en el vestuario del ${p.club} liderado por ${p.name}."`;
  } else if (option.type === "press") {
    activeSeason.coachTrust = clamp(activeSeason.coachTrust + 8, 0, 100);
    activeSeason.lockerRoomRel = clamp(activeSeason.lockerRoomRel + 8, 0, 100);
    activeSeason.morale = clamp(activeSeason.morale + 5, 0, 100);
    toastMsg = "❤️ Declaraciones muy aplaudidas. Te ganas el cariño de la afición y el vestuario.";
    newsHeadline = `📰 "${p.name} reafirma su lealtad al ${p.club} en rueda de prensa."`;
  } else if (option.type === "renewal") {
    p.marketValue = Math.round(p.marketValue * 1.12);
    activeSeason.coachTrust = clamp(activeSeason.coachTrust - 6, 0, 100);
    toastMsg = "💼 Has dejado abiertas las opciones de futuro. Sube tu cotización de mercado.";
    newsHeadline = `📰 "Especulaciones sobre el futuro de ${p.name} despiertan el interés de varios clubes."`;
  } else if (option.type === "captain") {
    activeSeason.reputation = clamp(activeSeason.reputation + 15, 0, 100);
    activeSeason.coachTrust = clamp(activeSeason.coachTrust + 10, 0, 100);
    activeSeason.lockerRoomRel = clamp(activeSeason.lockerRoomRel + 10, 0, 100);
    toastMsg = "👑 ¡Portarás el brazalete de capitán! Asumes el liderazgo del equipo.";
    newsHeadline = `📰 "${p.name} será el nuevo capitán del ${p.club} en el próximo encuentro."`;
  } else {
    // Custom option
    activeSeason.confidence = clamp(activeSeason.confidence + 4, 0, 100);
    activeSeason.form = clamp(activeSeason.form + 3, 0, 100);
    toastMsg = "✅ Decisión tomada con éxito. Te centras en tu rendimiento diario.";
    newsHeadline = `📰 "${p.name} sigue enfocado en seguir creciendo como futbolista."`;
  }

  if (newsHeadline) {
    if (!activeSeason.recentNews) activeSeason.recentNews = [];
    activeSeason.recentNews.unshift(newsHeadline);
    if (activeSeason.recentNews.length > 6) activeSeason.recentNews.pop();
  }

  return { toastMsg, newsHeadline, ovrDelta };
}
