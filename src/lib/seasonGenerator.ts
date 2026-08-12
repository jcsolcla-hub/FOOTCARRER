import { 
  Player, 
  PositionKey, 
  SquadRole, 
  PlayerAttributes, 
  SeasonMatchFixture, 
  SeasonObjective, 
  LeagueTableTeam, 
  ScorerEntry, 
  ActiveSeasonState, 
  SeasonMatchResult,
  MatchKeyMoment
} from "../types";
import { CLUBS, randInt, pick, clamp, OPPONENTS_POOL } from "../data/clubsAndLeagues";

export function generateInitialAttributes(position: PositionKey, level: number): PlayerAttributes {
  const base = Math.round(level);
  let vel = base;
  let tir = base;
  let reg = base;
  let pas = base;
  let def = base;
  let fis = base;
  let res = base;
  let tec = base;

  if (position === "POR") {
    def = base + 12;
    tec = base + 8;
    fis = base + 5;
    reg = base - 15;
    tir = base - 20;
  } else if (position === "DEF") {
    def = base + 10;
    fis = base + 8;
    pas = base + 2;
    tir = base - 8;
  } else if (position === "MED") {
    pas = base + 10;
    tec = base + 8;
    reg = base + 5;
    res = base + 6;
  } else if (position === "EXT") {
    vel = base + 12;
    reg = base + 10;
    tec = base + 6;
    tir = base + 4;
    def = base - 10;
  } else if (position === "DEL") {
    tir = base + 12;
    fis = base + 6;
    vel = base + 4;
    def = base - 12;
  }

  return {
    velocidad: clamp(vel, 40, 99),
    tiro: clamp(tir, 40, 99),
    regate: clamp(reg, 40, 99),
    pase: clamp(pas, 40, 99),
    defensa: clamp(def, 40, 99),
    fisico: clamp(fis, 40, 99),
    resistencia: clamp(res, 40, 99),
    tecnica: clamp(tec, 40, 99),
  };
}

export function getRoleFromTrust(trust: number): SquadRole {
  if (trust >= 88) return "Estrella";
  if (trust >= 75) return "Jugador Importante";
  if (trust >= 58) return "Titular";
  if (trust >= 38) return "Rotación";
  return "Suplente";
}

export function generateSeasonSchedule(p: Player, userClub: string): SeasonMatchFixture[] {
  const clubObj = CLUBS.find(c => c.name === userClub) || { name: userClub, tier: 3, country: "España" };
  const sameTierRivals = CLUBS.filter(c => c.name !== userClub && Math.abs(c.tier - clubObj.tier) <= 1).map(c => c.name);
  const topGlobalRivals = ["Real Madrid", "FC Barcelona", "Manchester City", "Bayern München", "PSG", "Liverpool", "Arsenal", "Inter"];
  
  const pool = Array.from(new Set([...sameTierRivals, ...topGlobalRivals, ...OPPONENTS_POOL])).filter(c => c !== userClub);

  const fixtures: SeasonMatchFixture[] = [];
  let idCounter = 1;

  // Preseason (3 friendly matches)
  const preseasonRivals = [pick(pool), pick(pool), pick(pool)];
  preseasonRivals.forEach((opp, i) => {
    fixtures.push({
      id: idCounter++,
      week: i + 1,
      dateLabel: `Ago 2026 · Semana ${i + 1}`,
      competition: "Amistoso",
      jornadaName: `Pretemporada #${i + 1}`,
      opponent: opp,
      isHome: i % 2 === 0,
      importance: "Baja",
      played: false
    });
  });

  // League Schedule (12 Matchdays)
  const leagueRivals = [...pool].sort(() => Math.random() - 0.5).slice(0, 12);
  const months = ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"];

  leagueRivals.forEach((opp, i) => {
    const weekNum = i + 4;
    const month = months[Math.floor(i / 1.5)] || "May";
    const isDerbyOrClassic = opp === "Real Madrid" || opp === "FC Barcelona" || opp === "Atlético de Madrid" || opp === "Manchester City";

    fixtures.push({
      id: idCounter++,
      week: weekNum,
      dateLabel: `${month} 2026/27 · Sem ${weekNum}`,
      competition: "Liga",
      jornadaName: `Jornada ${i + 1}`,
      opponent: opp,
      isHome: Math.random() > 0.5,
      importance: isDerbyOrClassic ? "Crucial" : (i > 8 ? "Alta" : "Media"),
      played: false
    });

    // Insert Copa del Rey after League Match 3 & Match 7
    if (i === 2) {
      fixtures.push({
        id: idCounter++,
        week: weekNum + 0.5,
        dateLabel: `${month} 2026/27 · Copa`,
        competition: "Copa",
        jornadaName: "Copa · Octavos de Final",
        opponent: pick(pool),
        isHome: true,
        importance: "Alta",
        played: false
      });
    }

    if (i === 6) {
      fixtures.push({
        id: idCounter++,
        week: weekNum + 0.5,
        dateLabel: `${month} 2027 · Champions`,
        competition: "Champions",
        jornadaName: "Champions · Fase de Grupos",
        opponent: pick(topGlobalRivals.filter(r => r !== userClub)),
        isHome: false,
        importance: "Crucial",
        played: false
      });
    }

    if (i === 10) {
      fixtures.push({
        id: idCounter++,
        week: weekNum + 0.5,
        dateLabel: `May 2027 · Copa Final`,
        competition: "Copa",
        jornadaName: "Copa · Gran Final",
        opponent: pick(topGlobalRivals),
        isHome: false,
        importance: "Crucial",
        played: false
      });
    }
  });

  return fixtures;
}

export function generateInitialStandings(userClub: string): LeagueTableTeam[] {
  const clubObj = CLUBS.find(c => c.name === userClub) || { tier: 3 };
  const rivals = CLUBS.filter(c => c.name !== userClub && Math.abs(c.tier - clubObj.tier) <= 1)
    .map(c => c.name)
    .slice(0, 7);

  if (rivals.length < 7) {
    const backup = ["Real Madrid", "FC Barcelona", "Atlético de Madrid", "Sevilla FC", "Real Betis", "Villarreal CF", "Real Sociedad"];
    backup.forEach(b => {
      if (b !== userClub && !rivals.includes(b)) rivals.push(b);
    });
  }

  const teamList = [userClub, ...rivals.slice(0, 7)];
  return teamList.map((t, idx) => ({
    rank: idx + 1,
    team: t,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    pts: 0,
    isUser: t === userClub
  }));
}

export function generateInitialTopScorers(userName: string, userClub: string): ScorerEntry[] {
  const rivals = ["Kylian Mbappé", "Erling Haaland", "Robert Lewandowski", "Vinícius Jr", "Jude Bellingham", "Lamine Yamal", "Antoine Griezmann"];
  const list: ScorerEntry[] = [
    { name: userName, club: userClub, goals: 0, assists: 0, isUser: true }
  ];

  rivals.forEach(r => {
    list.push({
      name: r,
      club: r.includes("Mbappé") || r.includes("Vinícius") || r.includes("Bellingham") ? "Real Madrid" : (r.includes("Haaland") ? "Manchester City" : "FC Barcelona"),
      goals: 0,
      assists: 0,
      isUser: false
    });
  });

  return list;
}

export function generateSeasonObjectives(p: Player, squadRole: SquadRole): SeasonObjective[] {
  const isAttacker = p.position === "DEL" || p.position === "EXT";
  const isMid = p.position === "MED";
  const isDef = p.position === "DEF" || p.position === "POR";

  const objList: SeasonObjective[] = [
    {
      id: "obj_matches",
      title: "Jugar un número destacado de partidos",
      target: squadRole === "Titular" || squadRole === "Estrella" ? 12 : 8,
      current: 0,
      rewardText: "+200.000 € y +15% Confianza del Míster",
      completed: false
    },
    {
      id: "obj_goals",
      title: isAttacker ? "Marcar al menos 8 goles en la temporada" : (isMid ? "Marcar al menos 4 goles" : "Marcar o provocar 2 goles"),
      target: isAttacker ? 8 : (isMid ? 4 : 2),
      current: 0,
      rewardText: "+300.000 € y +500 Valor de Mercado",
      completed: false
    },
    {
      id: "obj_assists",
      title: isAttacker || isMid ? "Repartir al menos 5 asistencias" : "Dar al menos 2 asistencias",
      target: isAttacker || isMid ? 5 : 2,
      current: 0,
      rewardText: "+150.000 € y +1.0 OVR XP",
      completed: false
    },
    {
      id: "obj_rating",
      title: "Mantener una nota media superior a 7.2",
      target: 7.2,
      current: 0,
      rewardText: "+10 Confianza y Oportunidad de Renovación",
      completed: false
    }
  ];

  return objList;
}

export function initializeActiveSeason(p: Player, clubTier: number): ActiveSeasonState {
  const attributes = generateInitialAttributes(p.position, p.level);
  const coachTrust = 68;
  const role = getRoleFromTrust(coachTrust);
  const fixtures = generateSeasonSchedule(p, p.club);
  const standings = generateInitialStandings(p.club);
  const topScorers = generateInitialTopScorers(p.name, p.club);
  const objectives = generateSeasonObjectives(p, role);

  return {
    yearLabel: `${p.seasonYearStart}/${(p.seasonYearStart + 1).toString().slice(2)}`,
    currentFixtureIndex: 0,
    energy: 100,
    fatigue: 0,
    morale: 80,
    coachTrust,
    confidence: 75,
    form: 80,
    lockerRoomRel: 82,
    reputation: Math.min(99, Math.max(40, Math.round(p.level * 0.95))),
    squadRole: role,
    attributes,
    attributeXP: {
      velocidad: 0,
      tiro: 0,
      regate: 0,
      pase: 0,
      defensa: 0,
      fisico: 0,
      resistencia: 0,
      tecnica: 0
    },
    yellowCards: 0,
    redCards: 0,
    suspendedMatches: 0,
    injury: null,
    seasonGoals: 0,
    seasonAssists: 0,
    seasonMatches: 0,
    seasonMinutes: 0,
    seasonRatings: [],
    fixtures,
    standings,
    topScorers,
    objectives,
    recentEventsLog: [
      `¡Arranca la Temporada ${p.season} en ${p.club}!`,
      `El entrenador te considera en el rol de '${role}'. ¡Demuestra tu talento en los entrenamientos y decisiones!`
    ],
    recentNews: [
      `📰 "El entrenador de ${p.club} deposita su confianza en ${p.name} para esta nueva campaña."`,
      `📰 "Los analistas ven en ${p.name} una pieza con gran margen de progresión."`
    ]
  };
}

export function generateMatchKeyMoments(p: Player, fixture: SeasonMatchFixture, attributes: PlayerAttributes, role: SquadRole): MatchKeyMoment[] {
  const isAttacker = p.position === "DEL" || p.position === "EXT";
  const isMid = p.position === "MED";

  const moments: MatchKeyMoment[] = [
    {
      id: "moment_1",
      minute: randInt(18, 38),
      title: "🔥 Ocasión de Contraataque peligroso",
      description: `Minuto ${randInt(18, 38)}: Recibes el balón en tres cuartos de campo rival frente a ${fixture.opponent}. La defensa contraria está descompensada.`,
      choices: [
        {
          text: "⚽ Disparo potente raso a la cepa del poste",
          statReq: "tiro",
          minStatVal: 65,
          outcomeSuccess: { text: "¡GOLAZO! Tu disparo entra lamiendo el poste derecho. ¡El estadio estalla de júbilo!", goalDelta: 1, assistDelta: 0, ratingDelta: 1.5 },
          outcomeFail: { text: "El guardameta adivina tu intención y desvía la pelota a córner.", goalDelta: 0, assistDelta: 0, ratingDelta: 0.2 }
        },
        {
          text: "🎯 Pase filtrado al hueco para tu compañero",
          statReq: "pase",
          minStatVal: 62,
          outcomeSuccess: { text: "¡ASISTENCIA DE CRACK! Tu pase medido al milímetro deja a tu compañero solo para marcar a placer.", goalDelta: 0, assistDelta: 1, ratingDelta: 1.4 },
          outcomeFail: { text: "El pase se va con demasiada potencia y acaba perdiéndose por la línea de fondo.", goalDelta: 0, assistDelta: 0, ratingDelta: -0.1 }
        },
        {
          text: "⚡ Regatear al último central con un caño mágico",
          statReq: "regate",
          minStatVal: 68,
          outcomeSuccess: { text: "¡MÁGICO! Le tiras un caño espectacular al central, te plantas ante el portero y la picas suavemente. ¡GOL!", goalDelta: 1, assistDelta: 0, ratingDelta: 1.8 },
          outcomeFail: { text: "El defensa mete la pierna a tiempo y frena tu incursión.", goalDelta: 0, assistDelta: 0, ratingDelta: -0.3 }
        }
      ]
    },
    {
      id: "moment_2",
      minute: randInt(55, 75),
      title: "⚽ Falta peligrosa / Saque de esquina a favor",
      description: `Minuto ${randInt(55, 75)}: Balón parado muy cerca del área del ${fixture.opponent}. Tienes la oportunidad de marcar la diferencia.`,
      choices: [
        {
          text: "✨ Ejecutar lanzamiento directo con rosca por encima de la barrera",
          statReq: "tecnica",
          minStatVal: 66,
          outcomeSuccess: { text: "¡IMPRESIONANTE! La rosca es perfecta y entra limpiamente por la escuadra. ¡Menuda obra de arte!", goalDelta: 1, assistDelta: 0, ratingDelta: 1.6 },
          outcomeFail: { text: "El balón se estrella contra la barrera humana.", goalDelta: 0, assistDelta: 0, ratingDelta: 0.0 }
        },
        {
          text: "💪 Rematar de cabeza imponiéndote con fuerza física",
          statReq: "fisico",
          minStatVal: 64,
          outcomeSuccess: { text: "¡CABEZAZO IMPLACABLE! Te elevas por encima de los centrales y mandas el balón a la red.", goalDelta: 1, assistDelta: 0, ratingDelta: 1.5 },
          outcomeFail: { text: "Rematas pero el balón sale por encima del travesaño.", goalDelta: 0, assistDelta: 0, ratingDelta: 0.1 }
        },
        {
          text: "🔄 Presión defensiva alta para recuperar y dar el pase de gol",
          statReq: "defensa",
          minStatVal: 60,
          outcomeSuccess: { text: "¡ROBO Y ASISTENCIA! Le robas la cartera al pivote y le regalas el gol a tu delantero.", goalDelta: 0, assistDelta: 1, ratingDelta: 1.3 },
          outcomeFail: { text: "Haces falta táctica y el árbitro te señala advertencia verbal.", goalDelta: 0, assistDelta: 0, ratingDelta: -0.1 }
        }
      ]
    },
    {
      id: "moment_3",
      minute: randInt(80, 90),
      title: "⏱️ Tramo decisivo en los minutos finales",
      description: `Minuto ${randInt(80, 90)}: El partido está al límite y el esfuerzo físico es máximo. ¿Cómo afrontas los minutos decisivos contra ${fixture.opponent}?`,
      choices: [
        {
          text: "🏃 Tirar de pulmón y resistencia para romper a la contra",
          statReq: "resistencia",
          minStatVal: 62,
          outcomeSuccess: { text: "¡ENERGÍA PURA! Sacas fuerzas de donde no hay, te escapas en velocidad y sentencias el partido.", goalDelta: 1, assistDelta: 0, ratingDelta: 1.4 },
          outcomeFail: { text: "Te faltan las fuerzas en el último control y el rival recupera la posesión.", goalDelta: 0, assistDelta: 0, ratingDelta: -0.2 }
        },
        {
          text: "🧠 Mantener la posesión con pases seguros y temple",
          statReq: "pase",
          minStatVal: 60,
          outcomeSuccess: { text: "¡CONTROL ABSOLUTO! Duermes el partido con maestría y aseguras un gran resultado para tu equipo.", goalDelta: 0, assistDelta: 0, ratingDelta: 1.1 },
          outcomeFail: { text: "Pierdes un pase arriesgado y la grada murmura.", goalDelta: 0, assistDelta: 0, ratingDelta: -0.2 }
        }
      ]
    }
  ];

  return moments;
}

export function simulateSingleMatch(
  fixture: SeasonMatchFixture, 
  p: Player, 
  activeSeason: ActiveSeasonState
): SeasonMatchResult {
  const isStarter = activeSeason.squadRole === "Titular" || activeSeason.squadRole === "Jugador Importante" || activeSeason.squadRole === "Estrella";
  const playerMinutes = isStarter ? randInt(72, 90) : (activeSeason.squadRole === "Rotación" ? randInt(35, 65) : randInt(10, 30));

  const energyFactor = activeSeason.energy / 100;
  const levelSkill = (p.level / 99) * energyFactor;

  // Outcome odds
  const homeBonus = fixture.isHome ? 0.3 : -0.2;
  const matchDifficulty = fixture.importance === "Crucial" ? 0.2 : 0;
  
  const goalOdds = (isAttacker(p.position) ? 0.45 : (p.position === "MED" ? 0.22 : 0.08)) * levelSkill;
  const assistOdds = (p.position === "MED" || isAttacker(p.position) ? 0.35 : 0.12) * levelSkill;

  let playerGoals = 0;
  let playerAssists = 0;

  if (Math.random() < goalOdds) playerGoals += 1;
  if (Math.random() < goalOdds * 0.3) playerGoals += 1;
  if (Math.random() < assistOdds) playerAssists += 1;

  const teamPower = levelSkill + homeBonus + Math.random() * 0.4;
  const oppPower = 0.5 + matchDifficulty + Math.random() * 0.4;

  let homeGoals = 0;
  let awayGoals = 0;

  if (fixture.isHome) {
    homeGoals = Math.max(playerGoals, randInt(0, 3) + (teamPower > oppPower ? 1 : 0));
    awayGoals = randInt(0, 2);
  } else {
    awayGoals = Math.max(playerGoals, randInt(0, 3) + (teamPower > oppPower ? 1 : 0));
    homeGoals = randInt(0, 2);
  }

  let baseRating = 6.0 + playerGoals * 1.5 + playerAssists * 1.0 + (playerMinutes > 60 ? 0.5 : 0) + (Math.random() * 0.8 - 0.4);
  baseRating = clamp(Math.round(baseRating * 10) / 10, 5.0, 10.0);

  return {
    homeGoals,
    awayGoals,
    playerGoals,
    playerAssists,
    playerRating: baseRating,
    playerMinutes,
    wasSimulated: true,
    matchHighlights: [
      `Resultado final: ${fixture.isHome ? p.club : fixture.opponent} ${homeGoals} - ${awayGoals} ${fixture.isHome ? fixture.opponent : p.club}`,
      `Jugaste ${playerMinutes} minutos con una nota de ${baseRating}.`
    ]
  };
}

function isAttacker(pos: PositionKey): boolean {
  return pos === "DEL" || pos === "EXT";
}

export function updateStandingsAndScorers(
  activeSeason: ActiveSeasonState, 
  userResult: SeasonMatchResult, 
  fixture: SeasonMatchFixture, 
  userName: string, 
  userClub: string
): void {
  // Update user team standings
  const userTeamObj = activeSeason.standings.find(s => s.team === userClub);
  const oppTeamObj = activeSeason.standings.find(s => s.team === fixture.opponent);

  const userGoals = fixture.isHome ? userResult.homeGoals : userResult.awayGoals;
  const oppGoals = fixture.isHome ? userResult.awayGoals : userResult.homeGoals;

  if (userTeamObj) {
    userTeamObj.played += 1;
    userTeamObj.gf += userGoals;
    userTeamObj.ga += oppGoals;
    if (userGoals > oppGoals) {
      userTeamObj.won += 1;
      userTeamObj.pts += 3;
    } else if (userGoals === oppGoals) {
      userTeamObj.drawn += 1;
      userTeamObj.pts += 1;
    } else {
      userTeamObj.lost += 1;
    }
  }

  if (oppTeamObj) {
    oppTeamObj.played += 1;
    oppTeamObj.gf += oppGoals;
    oppTeamObj.ga += userGoals;
    if (oppGoals > userGoals) {
      oppTeamObj.won += 1;
      oppTeamObj.pts += 3;
    } else if (userGoals === oppGoals) {
      oppTeamObj.drawn += 1;
      oppTeamObj.pts += 1;
    } else {
      oppTeamObj.lost += 1;
    }
  }

  // Simulate other rival teams matches
  activeSeason.standings.forEach(st => {
    if (st.team !== userClub && st.team !== fixture.opponent) {
      st.played += 1;
      const g1 = randInt(0, 3);
      const g2 = randInt(0, 3);
      st.gf += g1;
      st.ga += g2;
      if (g1 > g2) {
        st.won += 1;
        st.pts += 3;
      } else if (g1 === g2) {
        st.drawn += 1;
        st.pts += 1;
      } else {
        st.lost += 1;
      }
    }
  });

  // Sort standings by Pts -> Goal Difference -> GF
  activeSeason.standings.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const dgB = b.gf - b.ga;
    const dgA = a.gf - a.ga;
    if (dgB !== dgA) return dgB - dgA;
    return b.gf - a.gf;
  });

  // Update ranks
  activeSeason.standings.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  // Update Top Scorers
  const userScorer = activeSeason.topScorers.find(s => s.isUser);
  if (userScorer) {
    userScorer.goals += userResult.playerGoals;
    userScorer.assists += userResult.playerAssists;
  }

  // AI rival scorers increment
  activeSeason.topScorers.forEach(s => {
    if (!s.isUser) {
      if (Math.random() < 0.45) s.goals += 1;
      if (Math.random() < 0.25) s.assists += 1;
    }
  });

  activeSeason.topScorers.sort((a, b) => b.goals !== a.goals ? b.goals - a.goals : b.assists - a.assists);
}

export function evaluateObjectives(activeSeason: ActiveSeasonState): void {
  activeSeason.objectives.forEach(obj => {
    if (obj.id === "obj_matches") {
      obj.current = activeSeason.seasonMatches;
    } else if (obj.id === "obj_goals") {
      obj.current = activeSeason.seasonGoals;
    } else if (obj.id === "obj_assists") {
      obj.current = activeSeason.seasonAssists;
    } else if (obj.id === "obj_rating") {
      const avg = activeSeason.seasonRatings.length > 0 
        ? activeSeason.seasonRatings.reduce((a, b) => a + b, 0) / activeSeason.seasonRatings.length 
        : 0;
      obj.current = Math.round(avg * 10) / 10;
    }

    if (obj.current >= obj.target) {
      obj.completed = true;
    }
  });
}
