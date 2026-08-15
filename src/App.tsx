import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { 
  auth, 
  onAuthStateChanged, 
  ensureUserDoc, 
  syncCareerToFirestore, 
  loadCareerFromFirestore, 
  deleteCareerFromFirestore 
} from "./lib/firebase";
import { 
  doLogout, 
  doGoogleLogin, 
  doAppleLogin, 
  doEmailSignup 
} from "./lib/firebaseHelpers";
import { 
  CareerState, 
  ActiveSeasonState,
  SeasonSummary, 
  ChampionsOverview,
  TopTeam,
  TopPlayer,
  GalaAwards,
  AwardWinner,
  GroupResult, 
  Offer, 
  PositionKey,
  PressQuestion,
  PressOption
} from "./types";
import { 
  CLUBS, 
  LEAGUES, 
  NATION_INFO, 
  OPPONENTS_POOL, 
  flagOf, 
  clamp, 
  randInt, 
  randomChance, 
  pick, 
  fmtMoney, 
  fmtSalary, 
  POS_NAMES,
  calculateRealisticMarketValue,
  calculateRealisticSalary
} from "./data/clubsAndLeagues";

import { LoginView } from "./components/LoginView";
import { WelcomeView } from "./components/WelcomeView";
import { DashboardView } from "./components/DashboardView";
import { RetirementView } from "./components/RetirementView";
import { InteractiveSeasonView } from "./components/InteractiveSeasonView";
import { SeoPagesView } from "./components/SeoPagesView";
import { initializeActiveSeason } from "./lib/seasonGenerator";
import { CelebrationModal, MultiTitleModal } from "./components/CelebrationModal";
import { 
  LuckSpinnerModal, 
  CallUpModal, 
  GroupStageModal, 
  GroupResultModal, 
  SimpleMatchesModal, 
  TournamentResultModal, 
  SeasonSummaryModal, 
  ContractModal, 
  SingleOfferModal, 
  MultiOfferModal, 
  PositionChangeModal, 
  SponsorModal, 
  ConfirmModal, 
  LinkAccountModal,
  PressQuestionModal
} from "./components/SeasonModals";
import { getRandomPressQuestion, getRandomManagementQuestion } from "./data/pressQuestions";
import { TrainingQuestionModal, CupFinalModal } from "./components/SeasonDecisionModals";

const SAVE_KEY = "leyenda_career_save_v2";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState<boolean>(false);

  const [currentPath, setCurrentPath] = useState<string>(typeof window !== "undefined" ? window.location.pathname : "/");

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [careerState, setCareerState] = useState<CareerState | null>(null);
  const [inInteractiveMode, setInInteractiveMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals / Flow States
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [simPhaseText, setSimPhaseText] = useState<string>("Iniciando pretemporada...");
  const [callUpData, setCallUpData] = useState<{ nationality: string; flag: string; tourName: string; onContinue: () => void } | null>(null);
  const [groupStageData, setGroupStageData] = useState<{ nationality: string; tourName: string; result: GroupResult; onContinue: () => void } | null>(null);
  const [groupResultData, setGroupResultData] = useState<{ nationality: string; tourName: string; result: GroupResult; onContinue: () => void } | null>(null);
  const [simpleMatchesData, setSimpleMatchesData] = useState<{ flag: string; tourName: string; matches: any[]; onContinue: () => void } | null>(null);
  const [tourResultData, setTourResultData] = useState<{
    flag: string;
    tourName: string;
    nationality: string;
    resultLabel: string;
    matchDetail?: {
      opp: string;
      oppFlag: string;
      gf: number;
      ga: number;
      isPenalties: boolean;
      penScore?: string;
      stageName: string;
    };
    onContinue: () => void;
  } | null>(null);

  const [celebrationModalData, setCelebrationModalData] = useState<{ title: string; subtitle: string; level: "big" | "huge" | "max"; onContinue: () => void } | null>(null);
  const [multiTitleData, setMultiTitleData] = useState<{ titlesWon: string[]; onContinue: () => void } | null>(null);

  const [summaryModalData, setSummaryModalData] = useState<{ summary: SeasonSummary; onContinue: () => void } | null>(null);

  const [contractModalData, setContractModalData] = useState<{ club: string; onRenew: () => void; onLeave: () => void } | null>(null);
  const [singleOfferData, setSingleOfferData] = useState<{ currentClub: string; currentSalary: number; offer: Offer; onStay: () => void; onAccept: () => void } | null>(null);
  const [multiOfferData, setMultiOfferData] = useState<{ currentClub: string; offers: Offer[]; onAcceptOffer: (offer: Offer) => void; onStay: () => void } | null>(null);
  const [positionChangeData, setPositionChangeData] = useState<{ currentPos: string; newPosKey: PositionKey; onAccept: () => void; onReject: () => void } | null>(null);
  const [sponsorModalData, setSponsorModalData] = useState<{ sponsorName: string; bonus: number; onAccept: () => void; onReject: () => void } | null>(null);
  const [pressQuestionModalData, setPressQuestionModalData] = useState<{ questionData: PressQuestion; onSelectOption: (option: PressOption) => void } | null>(null);

  const [confirmModalData, setConfirmModalData] = useState<{ title: string; text: string; confirmText?: string; cancelText?: string; onConfirm: () => void; onCancel?: () => void } | null>(null);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [trainingModalData, setTrainingModalData] = useState<{ seasonYear: number; clubName: string; onSelectOption: (choice: "intensive" | "tactical" | "rest") => void } | null>(null);
  const [showCupFinalModalData, setShowCupFinalModalData] = useState<{
    finalTitle: string;
    opponent: string;
    userClub: string;
    onSelectOption: (choice: "starter" | "bench" | "rest") => void;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // Auth Listener & Initial Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);
      setAuthError(null);
      setAuthBusy(false);

      if (user) {
        ensureUserDoc(user);
        const remoteState = await loadCareerFromFirestore(user.uid);
        if (remoteState) {
          setCareerState(remoteState);
        } else {
          // fallback to localStorage
          const local = localStorage.getItem(SAVE_KEY);
          if (local) {
            try {
              setCareerState(JSON.parse(local));
            } catch (e) {
              console.error(e);
            }
          }
        }
      } else {
        setCareerState(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveState = (newState: CareerState) => {
    setCareerState(newState);
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error(e);
    }
    syncCareerToFirestore(currentUser, newState);
  };

  const clearGame = () => {
    localStorage.removeItem(SAVE_KEY);
    if (currentUser) {
      deleteCareerFromFirestore(currentUser.uid);
    }
    setCareerState(null);
  };

  const addTimeline = (p: any, age: number, text: string) => {
    p.timeline.push({ age, text });
  };

  /* ---------------------- Season Simulation Orchestration ---------------------- */
  const handleStartInteractiveSeason = () => {
    if (!careerState) return;
    const p = careerState.player;
    const clubObj = CLUBS.find((c) => c.name === p.club) || { tier: 3 };
    
    let updatedState: CareerState = { ...careerState };
    if (!updatedState.activeSeason) {
      updatedState.activeSeason = initializeActiveSeason(p, clubObj.tier);
      saveState(updatedState);
    }
    setInInteractiveMode(true);
  };

  const handleUpdateActiveSeason = (updatedActiveSeason: ActiveSeasonState) => {
    if (!careerState) return;
    const updatedState: CareerState = {
      ...careerState,
      activeSeason: updatedActiveSeason
    };
    saveState(updatedState);
  };

  const handleFinishInteractiveSeason = (completedActiveSeason: ActiveSeasonState) => {
    setInInteractiveMode(false);
    runSeasonSimulation({ interactiveData: completedActiveSeason });
  };

  const handleFastForwardInteractiveSeason = () => {
    setInInteractiveMode(false);
    runSeasonSimulation(careerState?.activeSeason ? { interactiveData: careerState.activeSeason } : undefined);
  };

  const handleOpenPressQuestionModal = () => {
    const qData = getRandomPressQuestion();
    setPressQuestionModalData({
      questionData: qData,
      onSelectOption: (option: PressOption) => {
        setPressQuestionModalData(null);
        if (careerState) {
          const stateCopy = JSON.parse(JSON.stringify(careerState));
          if (option.statBonus?.levelDelta && stateCopy.player) {
            stateCopy.player.level = clamp(stateCopy.player.level + option.statBonus.levelDelta, 40, 99);
          }
          if (option.statBonus?.moneyDelta && stateCopy.player) {
            stateCopy.player.money += option.statBonus.moneyDelta;
          }
          if (stateCopy.activeSeason) {
            stateCopy.activeSeason.morale = clamp(stateCopy.activeSeason.morale + 10, 0, 100);
            stateCopy.activeSeason.coachTrust = clamp(stateCopy.activeSeason.coachTrust + 5, 0, 100);
            stateCopy.activeSeason.recentEventsLog.unshift(`Prensa: "${option.effectText}"`);
          }
          saveState(stateCopy);
        }
        showToast(`🎤 ${option.effectText}`);
      }
    });
  };

  const handlePlaySeason = () => {
    setIsSpinning(true);
    setSimPhaseText("Simulando temporada...");

    setTimeout(() => {
      setIsSpinning(false);
      runSeasonSimulation();
    }, 600);
  };

  const handleRetirePlayerVoluntarily = () => {
    if (!careerState) return;
    const p = careerState.player;
    setConfirmModalData({
      title: `👴 RETIRADA PROFESIONAL (${p.age} AÑOS)`,
      text: `¿Estás seguro de que deseas colgar las botas y poner fin a tu carrera deportiva profesional a los ${p.age} años?`,
      confirmText: "🏆 Sí, retirarme ahora",
      cancelText: "⚽ Seguir jugando",
      onConfirm: () => {
        setConfirmModalData(null);
        const stateCopy = JSON.parse(JSON.stringify(careerState));
        stateCopy.player.retired = true;
        addTimeline(stateCopy.player, stateCopy.player.age, `RETIRADA VOLUNTARIA. Anuncias tu retirada oficial del fútbol profesional a los ${stateCopy.player.age} años.`);
        saveState(stateCopy);
        showToast(`¡Has anunciado tu retirada oficial del fútbol a los ${p.age} años!`);
      },
      onCancel: () => {
        setConfirmModalData(null);
      }
    });
  };

  const getAgeStage = (age: number) => {
    if (age <= 23) return "growth";
    if (age <= 28) return "peak";
    if (age <= 32) return "sustain";
    if (age <= 35) return "decline";
    return "lateDecline";
  };

  const runSeasonSimulation = (
    options?: { finalChoice?: "starter" | "bench" | "rest"; interactiveData?: ActiveSeasonState },
    currentState?: CareerState
  ) => {
    const activeState = currentState || careerState;
    if (!activeState) return;
    const stateCopy = JSON.parse(JSON.stringify(activeState));
    const p = stateCopy.player;
    const stage = getAgeStage(p.age);
    const clubObj = CLUBS.find((c) => c.name === p.club) || { tier: 3, league: "LL" };
    const clubTier = clubObj.tier;
    const leagueInfo = LEAGUES[clubObj.league] || LEAGUES.LL;

    // Reset activeSeason for next season
    stateCopy.activeSeason = null;

    const interactiveData = options?.interactiveData;
    let matches = interactiveData ? interactiveData.seasonMatches : randInt(28, 48);
    let goals = interactiveData ? interactiveData.seasonGoals : 0;
    let assists = interactiveData ? interactiveData.seasonAssists : 0;

    const finalChoice = options?.finalChoice;
    if (finalChoice === "starter") {
      matches = Math.min(54, matches + randInt(2, 5));
    } else if (finalChoice === "rest") {
      matches = Math.max(12, matches - randInt(4, 8));
    }

    const perfRoll = Math.random();
    const skillFactor = p.level / 99;
    const performanceScore = interactiveData
      ? clamp(0.5 + (goals + assists * 0.7) / (matches || 1), 0.1, 0.99)
      : clamp(perfRoll * 0.55 + skillFactor * 0.35 + (clubTier / 5) * 0.10, 0, 1);

    let perfTier: string;
    if (performanceScore > 0.82) perfTier = "extraordinary";
    else if (performanceScore > 0.62) perfTier = "great";
    else if (performanceScore > 0.4) perfTier = "normal";
    else if (performanceScore > 0.22) perfTier = "poor";
    else perfTier = "disastrous";

    let injuryText: string | null = null;
    let injuryReduction = 0;

    const posMultiplier: Record<string, number> = { POR: 0.02, DEF: 0.18, MED: 0.35, EXT: 0.55, DEL: 0.85 };
    const assistMultiplier: Record<string, number> = { POR: 0.01, DEF: 0.22, MED: 0.5, EXT: 0.6, DEL: 0.35 };
    const perfMult: Record<string, number> = { extraordinary: 1.5, great: 1.15, normal: 0.85, poor: 0.5, disastrous: 0.25 };

    if (!interactiveData) {
      const injuryRoll = Math.random();
      const injuryProbability = 0.16 + (p.age > 30 ? (p.age - 30) * 0.015 : 0);

      if (injuryRoll < injuryProbability) {
        const severity = Math.random();
        if (severity < 0.5) {
          injuryReduction = randInt(3, 8);
          injuryText = "Sufriste una lesión leve que te dejó fuera varias semanas.";
        } else if (severity < 0.85) {
          injuryReduction = randInt(9, 16);
          injuryText = "Una lesión moderada te apartó de los terrenos de juego durante meses.";
        } else {
          injuryReduction = randInt(17, 28);
          injuryText = "Sufriste una lesión grave que condicionó gran parte de tu temporada.";
        }
        matches = clamp(matches - injuryReduction, 2, 50);
        p.injuredMatchesLost += injuryReduction;
      }

      let goalBoost = finalChoice === "starter" ? 1.25 : finalChoice === "rest" ? 0.75 : 1.0;
      goals = Math.round(matches * (posMultiplier[p.position] || 0.4) * (perfMult[perfTier] || 1) * (0.5 + Math.random() * 0.7) * goalBoost);
      assists = Math.round(matches * (assistMultiplier[p.position] || 0.3) * (perfMult[perfTier] || 1) * (0.5 + Math.random() * 0.7) * goalBoost);
    }

    p.matches += matches;
    p.goals += goals;
    p.assists += assists;

    /* Titles - Probabilidades estrictamente reducidas según el nivel/tier del club */
    const possibleTitles = [leagueInfo.title, leagueInfo.cup];
    if (leagueInfo.continental) {
      if (clubTier >= 4) possibleTitles.push("Champions League");
      else if (clubTier === 3) possibleTitles.push("Europa League");
      else possibleTitles.push("Conference League");
    }
    if (clubTier >= 5 && randomChance(0.2)) possibleTitles.push("Mundial de Clubes");
    if (randomChance(0.2)) possibleTitles.push("Supercopa");

    // Factor de jerarquía según el nivel del equipo y decisiones en partidos decisivos
    const baseTierFactor = clubTier === 5 ? 1.0 : clubTier === 4 ? 0.38 : clubTier === 3 ? 0.12 : clubTier === 2 ? 0.03 : 0.008;
    const finalBoost = finalChoice === "starter" ? 1.35 : finalChoice === "rest" ? 0.65 : 1.0;
    const tierFactor = baseTierFactor * finalBoost;

    const wonTitles: string[] = [];
    possibleTitles.forEach((t) => {
      let baseProb: number;
      if (t === "Champions League") {
        baseProb = 0.10 * tierFactor; // Tier 5: 10%, Tier 4: ~3.8%
      } else if (t === "Mundial de Clubes") {
        baseProb = 0.12 * tierFactor; // Tier 5: 12%, Tier 4: ~4.5%
      } else if (t === leagueInfo.title) {
        baseProb = 0.14 * tierFactor; // Tier 5: 14%, Tier 4: ~5.3%
      } else if (t === "Europa League" || t === "Conference League") {
        baseProb = 0.09 * tierFactor;
      } else {
        baseProb = 0.10 * tierFactor; // Copa del Rey / FA Cup / Supercopa
      }

      // El rendimiento individual del jugador (performanceScore) y su media ajustan levemente la probabilidad
      const perfBoost = (performanceScore - 0.5) * 0.05 * tierFactor + (p.level - 75) * 0.0015 * tierFactor;
      const prob = clamp(baseProb + perfBoost, 0.001, 0.22);
      if (randomChance(prob)) wonTitles.push(t);
    });

    wonTitles.forEach((t) => {
      p.titles += 1;
      p.trophiesList[t] = (p.trophiesList[t] || 0) + 1;
      if (!p.flags.firstTitleLogged) {
        p.flags.firstTitleLogged = true;
        addTimeline(p, p.age, `Primer gran título: ${t}.`);
      }
    });

    // Determinar los equipos Campeones "Prime" de la temporada
    let clWinner = wonTitles.includes("Champions League") ? p.club : null;
    if (!clWinner) {
      const topClubs = ["Real Madrid", "Manchester City", "Bayern Múnich", "Paris Saint-Germain", "FC Barcelona", "Inter de Milán", "Arsenal", "Liverpool"].filter(c => c !== p.club);
      clWinner = pick(topClubs);
    }

    let leagueWinner = wonTitles.includes(leagueInfo.title) ? p.club : null;
    if (!leagueWinner) {
      const leagueClubs = CLUBS.filter(c => c.league === clubObj.league && c.name !== p.club);
      const maxTier = Math.max(...leagueClubs.map(c => c.tier), 1);
      const topTierLeagueClubs = leagueClubs.filter(c => c.tier === maxTier);
      leagueWinner = topTierLeagueClubs.length > 0 ? pick(topTierLeagueClubs).name : "Rival directo";
    }

    let cwcWinner = wonTitles.includes("Mundial de Clubes") ? p.club : null;
    if (!cwcWinner) {
      const cwcClubs = ["Real Madrid", "Manchester City", "Bayern Múnich", "Paris Saint-Germain", "FC Barcelona", "Flamengo", "Palmeiras"].filter(c => c !== p.club);
      cwcWinner = pick(cwcClubs);
    }

    /* Individual awards */
    const awards: string[] = [];
    let ballonProb = 0;
    
    // El Balón de Oro exige nivel de estrella mundial (>= 85) y rendimiento descomunal
    if (p.level >= 84 && perfTier === "extraordinary") {
      ballonProb = 0.08;
      if (wonTitles.includes("Champions League")) ballonProb += 0.12;
      if (wonTitles.includes("Mundial") || wonTitles.includes("Eurocopa") || wonTitles.includes("Copa América")) ballonProb += 0.10;
      if (goals >= 35) ballonProb += 0.08;
    } else if (p.level >= 88 && perfTier === "great" && wonTitles.includes("Champions League")) {
      ballonProb = 0.05;
    }
    ballonProb = clamp(ballonProb * (p.level / 99), 0, 0.35);

    const wonBallon = randomChance(ballonProb);
    if (wonBallon) {
      p.ballonsDor += 1;
      awards.push("Balón de Oro");
      if (!p.flags.firstBallonLogged) {
        p.flags.firstBallonLogged = true;
        addTimeline(p, p.age, "Primer Balón de Oro de su carrera.");
      }
    }

    let wonBota = false;
    // Bota de oro: requiere cifra goleadora alta (>= 30 goles) y ser el máximo artillero
    if (goals >= 30 && (perfTier === "extraordinary" || perfTier === "great") && (posMultiplier[p.position] || 0) >= 0.5) {
      const botaProb = clamp(0.10 + (goals - 30) * 0.025, 0.05, 0.40);
      if (randomChance(botaProb)) {
        p.goldenBoots += 1;
        awards.push("Bota de Oro");
        wonBota = true;
      }
    }

    if (p.level >= 82 && (perfTier === "extraordinary" || perfTier === "great") && randomChance(0.12)) awards.push("Equipo del Año");
    if (p.age <= 21 && p.level >= 75 && (perfTier === "extraordinary" || perfTier === "great") && randomChance(0.15)) awards.push("Mejor Joven");
    if (wonTitles.includes("Champions League") && p.level >= 82 && randomChance(0.18)) awards.push("Mejor jugador de Champions");
    p.individualAwards += awards.length;

    // Generar Top 3 Equipos del Año
    const top3TeamsList: TopTeam[] = [];
    const isUserTopTeam = wonTitles.length > 0 || (clubObj.tier >= 4 && performanceScore > 0.65);
    if (isUserTopTeam) {
      top3TeamsList.push({
        rank: 1,
        name: p.club,
        reason: wonTitles.length > 0 
          ? `Campeón de ${wonTitles.join(", ")}` 
          : `Temporada estelar en ${clubObj.league}`,
        isUser: true,
      });
    }

    const potentialTeams = [
      { name: clWinner, reason: "Campeón de Champions League" },
      { name: cwcWinner, reason: "Campeón del Mundial de Clubes" },
      { name: leagueWinner, reason: `Campeón de ${leagueInfo.title}` },
      { name: "Real Madrid", reason: "Gigante europeo" },
      { name: "Manchester City", reason: "Campeón Premier League & Supercopa" },
      { name: "Bayern Múnich", reason: "Campeón de Bundesliga" },
      { name: "Paris Saint-Germain", reason: "Campeón de Ligue 1" },
      { name: "FC Barcelona", reason: "Semifinalista de Champions League" },
      { name: "Inter de Milán", reason: "Campeón de Serie A" },
    ];

    potentialTeams.forEach(pt => {
      if (top3TeamsList.length < 3 && pt.name && !top3TeamsList.some(t => t.name === pt.name)) {
        top3TeamsList.push({
          rank: top3TeamsList.length + 1,
          name: pt.name,
          reason: pt.reason,
          isUser: pt.name === p.club,
        });
      }
    });
    top3TeamsList.forEach((t, i) => t.rank = i + 1);

    // Generar Pool Dinámico de Estrellas Rivales
    const starCandidatesPool = [
      { name: "Kylian Mbappé", club: "Real Madrid", g: randInt(36, 50), a: randInt(8, 16), award: wonBallon ? "Bota de Plata" : "Balón de Oro" },
      { name: "Erling Haaland", club: "Manchester City", g: randInt(38, 52), a: randInt(4, 10), award: wonBota ? "Bota de Plata" : "Bota de Oro" },
      { name: "Vinícius Jr", club: "Real Madrid", g: randInt(22, 32), a: randInt(14, 22), award: "Mejor Jugador UEFA" },
      { name: "Jude Bellingham", club: "Real Madrid", g: randInt(18, 26), a: randInt(12, 18) },
      { name: "Lamine Yamal", club: "FC Barcelona", g: randInt(16, 26), a: randInt(18, 26), award: "Trofeo Kopa" },
      { name: "Florian Wirtz", club: "Bayer Leverkusen", g: randInt(18, 28), a: randInt(16, 24) },
      { name: "Jamal Musiala", club: "Bayern Múnich", g: randInt(20, 28), a: randInt(12, 18) },
      { name: "Cole Palmer", club: "Chelsea", g: randInt(22, 30), a: randInt(12, 18) },
      { name: "Bukayo Saka", club: "Arsenal", g: randInt(18, 26), a: randInt(14, 20) },
      { name: "Harry Kane", club: "Bayern Múnich", g: randInt(32, 45), a: randInt(6, 12) },
      { name: "Lautaro Martínez", club: "Inter de Milán", g: randInt(26, 36), a: randInt(6, 12) },
      { name: "Pedri", club: "FC Barcelona", g: randInt(10, 16), a: randInt(16, 24) },
      { name: "Rodri", club: "Manchester City", g: randInt(8, 14), a: randInt(10, 16) },
      { name: "Arda Güler", club: "Real Madrid", g: randInt(14, 22), a: randInt(10, 16) },
      { name: "Endrick", club: "Real Madrid", g: randInt(18, 28), a: randInt(6, 12) },
      { name: "Julian Alvarez", club: "Atlético de Madrid", g: randInt(20, 30), a: randInt(8, 14) },
      { name: "Mohamed Salah", club: "Liverpool", g: randInt(24, 34), a: randInt(10, 16) },
    ].filter(s => s.name.toLowerCase() !== p.name.toLowerCase());

    // Mezclar candidatos para variedad cada temporada
    const shuffledRivals = starCandidatesPool.sort(() => Math.random() - 0.5);

    // Dynamic Goalkeeper Pool for Trofeo Yashin
    const goalkeeperCandidates = [
      { name: "Thibaut Courtois", club: "Real Madrid" },
      { name: "Gianluigi Donnarumma", club: "Paris Saint-Germain" },
      { name: "Marc-André ter Stegen", club: "FC Barcelona" },
      { name: "Alisson Becker", club: "Liverpool" },
      { name: "Ederson", club: "Manchester City" },
      { name: "Gregor Kobel", club: "Borussia Dortmund" },
      { name: "Jan Oblak", club: "Atlético de Madrid" },
      { name: "Emiliano Martínez", club: "Aston Villa" },
      { name: "David Raya", club: "Arsenal" },
      { name: "Mike Maignan", club: "AC Milan" },
      { name: "Unai Simón", club: "Athletic Club" },
    ].filter(gk => gk.name.toLowerCase() !== p.name.toLowerCase());

    const topGk = pick(goalkeeperCandidates);

    // Gala de Premios del Año
    const topScorerRival = pick(shuffledRivals.filter(r => r.g >= 30)) || shuffledRivals[0];
    const topBallonRival = shuffledRivals[0];

    const galaAwards: GalaAwards = {
      ballonDor: wonBallon ? {
        name: `${p.name} (Tú)`,
        club: p.club,
        stats: `${goals}G / ${assists}A · ${wonTitles.length} Títulos`,
        isUser: true,
      } : {
        name: topBallonRival.name,
        club: topBallonRival.club,
        stats: `${topBallonRival.g}G / ${topBallonRival.a}A · Campeón Europa`,
        isUser: false,
      },

      goldenBoot: wonBota ? {
        name: `${p.name} (Tú)`,
        club: p.club,
        stats: `${goals} Goles en temporada`,
        isUser: true,
      } : {
        name: topScorerRival.name,
        club: topScorerRival.club,
        stats: `${topScorerRival.g} Goles`,
        isUser: false,
      },

      bestGoalkeeper: (p.position === "POR" && (perfTier === "extraordinary" || perfTier === "great" || randomChance(0.35))) ? {
        name: `${p.name} (Tú)`,
        club: p.club,
        stats: `${randInt(20, 28)} partidos imbatido`,
        isUser: true,
      } : {
        name: topGk.name,
        club: topGk.club,
        stats: `${randInt(22, 29)} partidos a cero`,
        isUser: false,
      }
    };

    // Generar Top 3 Jugadores del Año
    const top3PlayersList: TopPlayer[] = [];
    const userRatingScore = goals * 2 + assists * 1.5 + (wonBallon ? 250 : 0) + (wonBota ? 120 : 0) + wonTitles.length * 35 + (p.level >= 85 ? 60 : 0);

    const userPlayerEntry: TopPlayer = {
      rank: 1,
      name: `${p.name} (Tú)`,
      club: p.club,
      stats: `${goals}G / ${assists}A`,
      award: wonBallon ? "🥇 Balón de Oro" : wonBota ? "🥇 Bota de Oro" : wonTitles.includes("Champions League") ? "🏆 Campeón Europa" : undefined,
      isUser: true,
    };

    if (wonBallon || userRatingScore >= 130) {
      top3PlayersList.push(userPlayerEntry);
    }

    shuffledRivals.forEach(rs => {
      if (top3PlayersList.length < 3) {
        top3PlayersList.push({
          rank: top3PlayersList.length + 1,
          name: rs.name,
          club: rs.club,
          stats: `${rs.g}G / ${rs.a}A`,
          award: rs.award,
          isUser: false,
        });
      }
    });

    if (!top3PlayersList.some(tp => tp.isUser)) {
      if (userRatingScore >= 65 || wonTitles.length > 0 || perfTier === "extraordinary" || perfTier === "great") {
        const pos = userRatingScore >= 95 ? 1 : 2;
        top3PlayersList.splice(pos, 0, userPlayerEntry);
        if (top3PlayersList.length > 3) top3PlayersList.pop();
      }
    }

    top3PlayersList.forEach((tp, i) => tp.rank = i + 1);

    const championsOverview: ChampionsOverview = {
      championsLeague: clWinner,
      leagueTitle: leagueWinner,
      leagueName: leagueInfo.title,
      clubWorldCup: cwcWinner,
      top3Teams: top3TeamsList,
      top3Players: top3PlayersList,
      galaAwards,
    };

    /* Progression */
    let levelChange = 0;
    if (stage === "growth") levelChange = randInt(1, 4) + (perfTier === "extraordinary" ? 2 : perfTier === "great" ? 1 : 0);
    else if (stage === "peak") levelChange = randInt(-1, 2) + (perfTier === "extraordinary" ? 1 : 0);
    else if (stage === "sustain") levelChange = randInt(-2, 1);
    else if (stage === "decline") levelChange = randInt(-4, -1);
    else levelChange = randInt(-7, -2);

    if (perfTier === "disastrous") levelChange -= 2;
    if (injuryReduction > 15) levelChange -= 2;

    if ((stage === "decline" || stage === "lateDecline") && !p.flags.declineLogged) {
      p.flags.declineLogged = true;
      addTimeline(p, p.age, "Comienza el declive físico.");
    }

    const oldLevel = p.level;
    const oldValue = p.marketValue;
    const oldSalary = p.salary;

    p.level = clamp(p.level + levelChange, 40, Math.max(p.potential, 99));
    if (stage === "growth" || stage === "peak" || stage === "sustain") {
      p.level = clamp(p.level, 40, p.potential + (stage === "growth" ? 0 : 5));
    }
    p.level = Math.round(p.level * 10) / 10;

    /* Market Value & Salary - Ajuste ultra realista */
    const performanceBoost = (performanceScore - 0.5) * 0.15;
    const calculatedVal = calculateRealisticMarketValue(p.level, p.age, p.potential);
    p.marketValue = Math.max(0.1, Math.round((calculatedVal * (1 + performanceBoost)) * 10) / 10);

    if (p.marketValue > p.maxMarketValue) {
      p.maxMarketValue = p.marketValue;
      if (p.marketValue > 60 && !p.flags.maxValueLogged) {
        p.flags.maxValueLogged = true;
        addTimeline(p, p.age, `Alcanza su máximo valor de mercado: ${fmtMoney(p.marketValue)}.`);
      }
    }

    p.salary = calculateRealisticSalary(p.marketValue, p.level);
    p.maxSalary = Math.max(p.maxSalary || 0, p.salary);

    /* Money events */
    const moneyEvents: Array<{ label: string; amount: number }> = [];
    let seasonIncome = p.salary;
    moneyEvents.push({ label: `Salario anual (${p.club})`, amount: p.salary });

    if (wonTitles.length) {
      const prizeAmt = Math.round(wonTitles.length * (0.8 + clubTier * 0.4) * 10) / 10;
      moneyEvents.push({ label: `Primas por títulos (${wonTitles.join(", ")})`, amount: prizeAmt });
      seasonIncome += prizeAmt;
    }
    if (awards.length) {
      const awardAmt = Math.round(awards.length * 1.2 * 10) / 10;
      moneyEvents.push({ label: "Bonus por premios individuales", amount: awardAmt });
      seasonIncome += awardAmt;
    }
    if (perfTier === "extraordinary") {
      const amt = randomChance(0.5) ? randInt(3, 6) : randInt(1, 3);
      moneyEvents.push({ label: "Prima por rendimiento extraordinario", amount: amt });
      seasonIncome += amt;
    } else if (perfTier === "disastrous") {
      const amt = randomChance(0.5) ? -randInt(3, 6) : -randInt(1, 3);
      moneyEvents.push({ label: "Penalización por temporada muy floja", amount: amt });
      seasonIncome += amt;
    } else if (perfTier === "poor" && randomChance(0.4)) {
      const amt = -randInt(1, 3);
      moneyEvents.push({ label: "Multa del club por bajo rendimiento", amount: amt });
      seasonIncome += amt;
    }

    if (randomChance(0.3)) {
      if (randomChance(0.5)) {
        const kind = pick(["Un patrocinador te ofrece una campaña puntual", "Ganas una apuesta amistosa con un compañero", "Inversión inmobiliaria sale bien"]);
        const amt = randInt(1, 4);
        moneyEvents.push({ label: kind, amount: amt });
        seasonIncome += amt;
      } else {
        const kind = pick(["Multa de tráfico y gastos imprevistos", "Mala inversión financiera", "Robo o pérdida de bienes personales"]);
        const amt = -randInt(1, 3);
        moneyEvents.push({ label: kind, amount: amt });
        seasonIncome += amt;
      }
    }

    p.money = Math.max(0, Math.round((p.money + seasonIncome) * 10) / 10);
    p.totalMoneyEarned += Math.max(0, seasonIncome);

    let sponsorOfferName: string | null = null;
    if (!p.sponsor && p.level >= 70 && randomChance(0.22)) {
      sponsorOfferName = pick(["VoltSport", "Aurora Boots", "Halcón Energy", "Titan Wear", "NovaKick"]);
    }

    const perfPhraseMap: Record<string, string> = {
      extraordinary: "una temporada espectacular",
      great: "una gran temporada",
      normal: "una temporada correcta",
      poor: "una temporada complicada",
      disastrous: "una temporada para olvidar",
    };

    let narrationText = `Con ${p.age} años has completado ${perfPhraseMap[perfTier]} en el ${p.club}. `;
    if (goals > 0 || assists > 0) {
      narrationText += `Sumaste ${goals} goles y ${assists} asistencias en ${matches} partidos. `;
    } else {
      narrationText += `Disputaste ${matches} partidos a lo largo del curso. `;
    }
    if (injuryText) narrationText += injuryText + " ";

    const avgRating = clamp(Math.round((5.7 + performanceScore * 3.3 + ((goals + assists) / Math.max(matches, 1)) * 0.4) * 10) / 10, 4.0, 9.9);

    const summary: SeasonSummary = {
      year: `${p.seasonYearStart}/${(p.seasonYearStart + 1).toString().slice(2)}`,
      age: p.age,
      club: p.club,
      matches,
      goals,
      assists,
      avgRating,
      wonTitles,
      awards,
      valueFrom: oldValue,
      valueTo: p.marketValue,
      salaryFrom: oldSalary,
      salaryTo: p.salary,
      levelFrom: oldLevel,
      levelTo: p.level,
      moneyEvents,
      injuryText,
      nationalText: null,
      narration: narrationText,
      perfTier,
      ballonWon: wonBallon,
      botaWon: wonBota,
      championsOverview,
    };

    p.score += goals * 2 + assists * 1.5 + wonTitles.length * 40 + awards.length * 30 + (wonBallon ? 150 : 0) + performanceScore * 10;

    p.log.push({
      title: `Temporada ${p.season} (${summary.year}) — ${p.age} años`,
      text: `Nota media ${avgRating} · ${goals} goles, ${assists} asistencias${wonTitles.length ? ", " + wonTitles.join(", ") : ""}${awards.length ? ", " + awards.join(", ") : ""}.`,
    });

    // Track max level reached in career
    p.maxLevel = Math.max(p.maxLevel || p.level, Math.round(p.level));

    // Best season check
    const seasonScore = goals * 2 + assists * 1.5 + wonTitles.length * 40 + awards.length * 30 + (wonBallon ? 150 : 0);
    if (!p.bestSeason || seasonScore > p.bestSeason.score) {
      p.bestSeason = {
        label: `${summary.year} — ${p.age} años`,
        club: p.club,
        matches,
        goals,
        assists,
        titles: wonTitles.slice(),
        awards: awards.slice(),
        score: seasonScore,
        peakLevelInSeason: Math.round(p.level),
        avgRating,
      };
    }

    // Update state first
    saveState(stateCopy);

    // Chain international window -> celebrations -> summary -> post season
    runInternationalWindowStep(stateCopy, performanceScore, () => {
      runCelebrationSequenceStep(summary, () => {
        setSummaryModalData({
          summary,
          onContinue: () => {
            setSummaryModalData(null);
            runPostSeasonEventQueueStep(stateCopy, sponsorOfferName, summary);
          },
        });
      });
    });
  };

  /* ---------------------- International Window Step ---------------------- */
  const runInternationalWindowStep = (stateCopy: CareerState, performanceScore: number, callback: () => void) => {
    const p = stateCopy.player;
    const info = NATION_INFO[p.nationality] || { conf: "UEFA", flag: "🏳️" };

    const tournaments = [
      { yearOffset: 0, name: "Mundial", scope: "global", stages: ["Octavos", "Cuartos", "Semifinal", "Final"] },
      { yearOffset: 2, name: "Eurocopa", scope: "UEFA", stages: ["Cuartos", "Semifinal", "Final"] },
      { yearOffset: 2, name: "Copa América", scope: "CONMEBOL", stages: ["Cuartos", "Semifinal", "Final"] },
      { yearOffset: 1, name: "Copa Africana de Naciones", scope: "CAF", stages: ["Cuartos", "Semifinal", "Final"] },
      { yearOffset: 1, name: "Copa Asiática", scope: "AFC", stages: ["Cuartos", "Semifinal", "Final"] },
      { yearOffset: 1, name: "Copa Oro", scope: "CONCACAF", stages: ["Cuartos", "Semifinal", "Final"] },
      { yearOffset: 1, name: "Eurocopa Sub-21", scope: "UEFA-21", stages: ["Semifinal", "Final"] },
    ];

    const tours = tournaments.filter((t) => {
      const year = p.seasonYearStart;
      if (t.name === "Mundial" && (year - 2026) % 4 !== 0) return false;
      if ((t.name === "Eurocopa" || t.name === "Copa América") && (year - 2028) % 4 !== 0) return false;
      if ((t.name === "Copa Africana de Naciones" || t.name === "Copa Oro" || t.name === "Eurocopa Sub-21") && (year - 2027) % 2 !== 0) return false;
      if (t.name === "Copa Asiática" && (year - 2027) % 4 !== 0) return false;

      if (t.scope === "global") return true;
      if (t.scope === "UEFA-21") return info.conf === "UEFA" && p.age <= 21;
      return t.scope === info.conf;
    });

    if (!tours.length || p.level < 74) {
      callback();
      return;
    }

    const tour = tours[0];
    const callupProb = clamp(0.30 + (p.level - 74) * 0.012 + (performanceScore - 0.5) * 0.3, 0.05, 0.9);
    if (!randomChance(callupProb)) {
      callback();
      return;
    }

    p.caps += randInt(2, 3);
    saveState(stateCopy);

    setCallUpData({
      nationality: p.nationality,
      flag: info.flag,
      tourName: tour.name,
      onContinue: () => {
        setCallUpData(null);
        if (["Mundial", "Eurocopa"].includes(tour.name)) {
          const groupRes = simulateGroupStageDetailed(p, tour.name);
          setGroupStageData({
            nationality: p.nationality,
            tourName: tour.name,
            result: groupRes,
            onContinue: () => {
              setGroupStageData(null);
              setGroupResultData({
                nationality: p.nationality,
                tourName: tour.name,
                result: groupRes,
                onContinue: () => {
                  setGroupResultData(null);
                  if (groupRes.advanced) {
                    proceedKnockoutStep(stateCopy, info, tour, callback);
                  } else {
                    callback();
                  }
                },
              });
            },
          });
        } else {
          // simple matches
          const matches = playSimpleTournamentMatches(p);
          setSimpleMatchesData({
            flag: info.flag,
            tourName: tour.name,
            matches,
            onContinue: () => {
              setSimpleMatchesData(null);
              const groupAdvanceProb = clamp(0.5 + (p.level - 72) * 0.012, 0.15, 0.85);
              if (randomChance(groupAdvanceProb)) {
                proceedKnockoutStep(stateCopy, info, tour, callback);
              } else {
                setTourResultData({
                  flag: info.flag,
                  tourName: tour.name,
                  nationality: p.nationality,
                  resultLabel: "Eliminada en fase de grupos",
                  onContinue: () => {
                    setTourResultData(null);
                    callback();
                  },
                });
              }
            },
          });
        }
      },
    });
  };

  const simulateGroupStageDetailed = (p: any, tourName: string): GroupResult => {
    const nation = p.nationality;
    const oppPool = OPPONENTS_POOL.filter((o) => o !== nation);
    const opponents: string[] = [];
    while (opponents.length < 3 && opponents.length < oppPool.length) {
      const o = pick(oppPool);
      if (!opponents.includes(o)) opponents.push(o);
    }
    const teams = [nation, ...opponents];

    const strengths: Record<string, number> = {};
    teams.forEach((t) => {
      strengths[t] = t === nation
        ? clamp(0.35 + (p.level - 55) * 0.008, 0.2, 0.95)
        : clamp(0.3 + Math.random() * 0.55, 0.2, 0.9);
    });

    const table: Record<string, any> = {};
    teams.forEach((t) => (table[t] = { team: t, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, isPlayer: t === nation }));
    const playerMatches: any[] = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const A = teams[i], B = teams[j];
        const sA = strengths[A], sB = strengths[B];
        const gA = Math.max(0, Math.round(randInt(0, 3) * (0.55 + sA * 0.7) - Math.random() * 0.4));
        const gB = Math.max(0, Math.round(randInt(0, 3) * (0.55 + sB * 0.7) - Math.random() * 0.4));
        table[A].gf += gA; table[A].ga += gB;
        table[B].gf += gB; table[B].ga += gA;
        if (gA > gB) { table[A].pts += 3; table[A].w++; table[B].l++; }
        else if (gA < gB) { table[B].pts += 3; table[B].w++; table[A].l++; }
        else { table[A].pts += 1; table[B].pts += 1; table[A].d++; table[B].d++; }

        if (A === nation || B === nation) {
          const isHome = A === nation;
          const opp = isHome ? B : A;
          const gf = isHome ? gA : gB;
          const ga = isHome ? gB : gA;
          const role = randomChance(clamp(0.5 + (p.level - 72) * 0.015, 0.15, 0.9)) ? "titular" : (randomChance(0.5) ? "suplente" : "no participa");
          playerMatches.push({ opp, gf, ga, role });
        }
      }
    }

    const standings = Object.values(table).sort((a: any, b: any) =>
      b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
    );
    const position = standings.findIndex((s: any) => s.isPlayer) + 1;
    const advanced = position <= 2;
    return { standings, playerMatches, position, advanced };
  };

  const playSimpleTournamentMatches = (p: any) => {
    const nation = p.nationality;
    const matches = [];
    for (let i = 0; i < 3; i++) {
      const opp = pick(OPPONENTS_POOL.filter((o) => o !== nation));
      const strength = clamp(0.5 + (p.level - 72) * 0.01, 0.2, 0.85);
      const gf = Math.max(0, Math.round(randInt(0, 3) * (0.6 + strength * 0.6)));
      const ga = Math.max(0, Math.round(randInt(0, 3) * (1.5 - strength * 0.6)));
      const result = gf > ga ? "W" : gf === ga ? "D" : "L";
      const role = randomChance(clamp(0.4 + (p.level - 72) * 0.015, 0.15, 0.9)) ? "titular" : (randomChance(0.5) ? "suplente" : "no participa");
      matches.push({ home: nation, away: opp, gf, ga, result, role });
    }
    return matches;
  };

  const proceedKnockoutStep = (stateCopy: CareerState, info: any, tour: any, callback: () => void) => {
    const p = stateCopy.player;
    let stageIdx = 0;

    const runRound = () => {
      if (stageIdx >= tour.stages.length) {
        // Champions!
        p.titles += 1;
        p.trophiesList[tour.name] = (p.trophiesList[tour.name] || 0) + 1;
        addTimeline(p, p.age, `¡${tour.name} con ${p.nationality}!`);
        p.score += 200;
        saveState(stateCopy);

        setCelebrationModalData({
          title: tour.name.toUpperCase(),
          subtitle: `${info.flag} ${p.nationality} — CAMPEONA`,
          level: "max",
          onContinue: () => {
            setCelebrationModalData(null);
            callback();
          },
        });
        return;
      }

      const stageName = tour.stages[stageIdx];
      // Las rondas eliminatorias de un Mundial o Eurocopa son extremas
      const winProb = clamp(0.36 + (p.level - 75) * 0.008, 0.18, 0.58);
      if (randomChance(winProb)) {
        stageIdx++;
        runRound();
      } else {
        const opp = pick(OPPONENTS_POOL.filter((o) => o !== p.nationality));
        const oppFlag = flagOf(opp);
        let gf = 0;
        let ga = 0;
        let isPenalties = false;
        let penScore = "";

        if (randomChance(0.25)) {
          // Empate en reglamentario y caída en penaltis
          gf = randInt(1, 2);
          ga = gf;
          isPenalties = true;
          penScore = `${randInt(3, 4)}-${randInt(4, 5)}`;
        } else {
          // Derrota regular
          ga = randInt(1, 3);
          gf = randInt(0, ga - 1);
        }

        const isFinal = stageIdx === tour.stages.length - 1;
        const scoreFormatted = isPenalties ? `${gf}-${ga} (${penScore} pen.)` : `${gf}-${ga}`;
        const label = isFinal 
          ? `SUBCAMPEÓN/A · Derrota ${scoreFormatted}` 
          : `Eliminado/a en ${stageName.toLowerCase()}`;

        addTimeline(p, p.age, `Mundial/Torneo: ${label} vs ${opp} ${oppFlag}.`);

        setTourResultData({
          flag: info.flag,
          tourName: tour.name,
          nationality: p.nationality,
          resultLabel: label,
          matchDetail: {
            opp,
            oppFlag,
            gf,
            ga,
            isPenalties,
            penScore: isPenalties ? penScore : undefined,
            stageName,
          },
          onContinue: () => {
            setTourResultData(null);
            callback();
          },
        });
      }
    };

    runRound();
  };

  /* ---------------------- Celebration Sequence Step ---------------------- */
  const runCelebrationSequenceStep = (summary: SeasonSummary, onDone: () => void) => {
    const queue: Array<(next: () => void) => void> = [];

    summary.wonTitles.forEach((t) => {
      const level = ["Champions League", "Europa League", "Conference League", "Mundial de Clubes", "Copa Libertadores", "Mundial", "Eurocopa"].includes(t)
        ? "huge"
        : "big";
      queue.push((next) => {
        setCelebrationModalData({
          title: t.toUpperCase(),
          subtitle: level === "huge" ? `Has ganado ${t}.` : `Has sido campeón de ${t}.`,
          level,
          onContinue: () => {
            setCelebrationModalData(null);
            next();
          },
        });
      });
    });

    if (summary.botaWon) {
      queue.push((next) => {
        setCelebrationModalData({
          title: "BOTA DE ORO",
          subtitle: "Máximo goleador de la temporada.",
          level: "big",
          onContinue: () => {
            setCelebrationModalData(null);
            next();
          },
        });
      });
    }

    if (summary.wonTitles.length > 1) {
      queue.push((next) => {
        setMultiTitleData({
          titlesWon: summary.wonTitles,
          onContinue: () => {
            setMultiTitleData(null);
            next();
          },
        });
      });
    }

    if (summary.ballonWon) {
      queue.push((next) => {
        setCelebrationModalData({
          title: "¡BALÓN DE ORO!",
          subtitle: "Has sido elegido el mejor futbolista del mundo.",
          level: "max",
          onContinue: () => {
            setCelebrationModalData(null);
            next();
          },
        });
      });
    }

    let idx = 0;
    const processQueue = () => {
      if (idx >= queue.length) {
        onDone();
        return;
      }
      const item = queue[idx++];
      item(processQueue);
    };
    processQueue();
  };

  /* ---------------------- Post Season Event Queue ---------------------- */
  const runPostSeasonEventQueueStep = (stateCopy: CareerState, sponsorOfferName: string | null, summary?: SeasonSummary) => {
    const p = stateCopy.player;
    const queue: Array<(next: () => void) => void> = [];

    const isVeryGoodSeason = summary
      ? (summary.perfTier === "extraordinary" || summary.perfTier === "great" || summary.ballonWon || summary.botaWon || summary.goals + summary.assists >= 22 || summary.wonTitles.length >= 1)
      : false;

    const contractEnds = p.season % 4 === 0;
    if (contractEnds) {
      queue.push((next) => {
        setContractModalData({
          club: p.club,
          onRenew: () => {
            setContractModalData(null);
            const raise = 1 + Math.random() * 0.25;
            p.salary = Math.round(p.salary * raise * 10) / 10;
            p.maxSalary = Math.max(p.maxSalary, p.salary);
            saveState(stateCopy);
            showToast(`Renovaste con ${p.club}. Nuevo salario: ${fmtSalary(p.salary)}`);
            next();
          },
          onLeave: () => {
            setContractModalData(null);
            const offers = generateOffers(p, 2, isVeryGoodSeason);
            setMultiOfferData({
              currentClub: p.club,
              offers,
              onAcceptOffer: (o) => {
                setMultiOfferData(null);
                acceptTransfer(stateCopy, o);
                next();
              },
              onStay: () => {
                setMultiOfferData(null);
                const raise = 1 + Math.random() * 0.15;
                p.salary = Math.round(p.salary * raise * 10) / 10;
                saveState(stateCopy);
                next();
              },
            });
          },
        });
      });
    }

    const offerChance = isVeryGoodSeason ? 0.95 : (0.30 + clamp((p.level - 70) / 100, 0, 0.25));
    if (!contractEnds && randomChance(offerChance)) {
      queue.push((next) => {
        setPressQuestionModalData({
          questionData: {
            id: "transfer_request_q",
            category: "Mercado",
            reporter: "Representante y Dirección Deportiva",
            question: `Gestión de Traspaso y Mercado: Estás compitiendo en ${p.club}. ¿Deseas pedir a tu representante que busque ofertas de otros clubes en el mercado para cambiar de equipo o prefieres seguir en tu club actual?`,
            options: [
              {
                text: "Solicitar Traspaso: Pedir a tu agente que busque ofertas de otros clubes.",
                effectText: "Tu representante escucha propuestas del mercado internacional.",
                statBonus: { scoreDelta: 20 }
              },
              {
                text: `Continuar en ${p.club}: Reafirmar tu lealtad y seguir en tu equipo.`,
                effectText: `Reafirmas tu compromiso con ${p.club} (+35 PTS Leyenda).`,
                statBonus: { scoreDelta: 35 }
              }
            ]
          },
          onSelectOption: (option) => {
            setPressQuestionModalData(null);
            if (option.text.startsWith("Solicitar Traspaso")) {
              const offers = generateOffers(p, randInt(2, 3), isVeryGoodSeason);
              setMultiOfferData({
                currentClub: p.club,
                offers,
                onAcceptOffer: (o) => {
                  setMultiOfferData(null);
                  acceptTransfer(stateCopy, o);
                  next();
                },
                onStay: () => {
                  setMultiOfferData(null);
                  showToast(`Rechazas las ofertas recibidas y decides continuar en ${p.club}.`);
                  next();
                }
              });
            } else {
              saveState(stateCopy);
              showToast(`💼 ${option.effectText}`);
              next();
            }
          }
        });
      });
    }

    if (randomChance(0.06)) {
      queue.push((next) => {
        const otherPositions = (["POR", "DEF", "MED", "EXT", "DEL"] as PositionKey[]).filter((pos) => pos !== p.position);
        const newPos = pick(otherPositions);
        setPositionChangeData({
          currentPos: POS_NAMES[p.position],
          newPosKey: newPos,
          onAccept: () => {
            setPositionChangeData(null);
            p.position = newPos;
            if (randomChance(0.5)) {
              p.level = clamp(p.level + randInt(1, 3), 40, 99);
              showToast(`Te adaptas bien a tu nueva posición: ${POS_NAMES[newPos]}`);
            } else {
              p.level = clamp(p.level - randInt(1, 4), 40, 99);
              showToast(`Cuesta adaptarte a ${POS_NAMES[newPos]}, tu rendimiento baja ligeramente.`);
            }
            saveState(stateCopy);
            next();
          },
          onReject: () => {
            setPositionChangeData(null);
            showToast("Rechazas el cambio de posición.");
            next();
          },
        });
      });
    }

    if (sponsorOfferName) {
      queue.push((next) => {
        const bonus = Math.max(0.5, Math.round(p.marketValue * 0.02 * 10) / 10);
        setSponsorModalData({
          sponsorName: sponsorOfferName,
          bonus,
          onAccept: () => {
            setSponsorModalData(null);
            p.sponsor = sponsorOfferName;
            p.money = Math.round((p.money + bonus) * 10) / 10;
            p.totalMoneyEarned += bonus;
            saveState(stateCopy);
            showToast(`Ahora eres imagen de ${sponsorOfferName}. +${fmtMoney(bonus)}`);
            next();
          },
          onReject: () => {
            setSponsorModalData(null);
            showToast(`Rechazas la oferta de ${sponsorOfferName}.`);
            next();
          },
        });
      });
    }

    // Pregunta de prensa / Entrevista / Dilema del futbolista
    if (randomChance(0.85)) {
      queue.push((next) => {
        const questionData = getRandomPressQuestion();
        setPressQuestionModalData({
          questionData,
          onSelectOption: (option) => {
            setPressQuestionModalData(null);
            if (option.statBonus) {
              if (option.statBonus.levelDelta) {
                p.level = clamp(p.level + option.statBonus.levelDelta, 40, 99);
              }
              if (option.statBonus.moneyDelta) {
                p.money = Math.round((p.money + option.statBonus.moneyDelta) * 10) / 10;
                p.totalMoneyEarned += Math.max(0, option.statBonus.moneyDelta);
              }
              if (option.statBonus.scoreDelta) {
                p.score += option.statBonus.scoreDelta;
              }
            }
            saveState(stateCopy);
            showToast(`🎙️ ${option.effectText}`);
            next();
          }
        });
      });
    }

    // Pregunta de Gestión / Decisión de Carrera, Finanzas y Equipación
    if (randomChance(0.90)) {
      queue.push((next) => {
        const mgmtData = getRandomManagementQuestion();
        setPressQuestionModalData({
          questionData: mgmtData,
          onSelectOption: (option) => {
            setPressQuestionModalData(null);
            if (option.statBonus) {
              if (option.statBonus.levelDelta) {
                p.level = clamp(p.level + option.statBonus.levelDelta, 40, 99);
              }
              if (option.statBonus.moneyDelta) {
                p.money = Math.round((p.money + option.statBonus.moneyDelta) * 10) / 10;
                p.totalMoneyEarned += Math.max(0, option.statBonus.moneyDelta);
              }
              if (option.statBonus.scoreDelta) {
                p.score += option.statBonus.scoreDelta;
              }
            }
            saveState(stateCopy);
            showToast(`💼 ${option.effectText}`);
            next();
          }
        });
      });
    }

    // Pregunta de Plan de Entrenamiento y Evolución de OVR
    if (randomChance(0.90)) {
      queue.push((next) => {
        setPressQuestionModalData({
          questionData: {
            id: "training_plan_q",
            category: "Entrenamiento",
            reporter: "Cuerpo Técnico",
            question: `Plan de Entrenamiento: ¿Qué plan sigues esta temporada en ${p.club}?`,
            options: [
              {
                text: "🏋️ Intensivo: Máxima exigencia",
                effectText: "🎲 +1.5 a +2.0 OVR (60% éxito) o molestia (-0.5 OVR)."
              },
              {
                text: "🧠 Táctico: Trabajo equilibrado",
                effectText: "Progresión segura (+0.8 OVR)."
              },
              {
                text: "😴 Descanso: Recuperación",
                effectText: "Mantienes tu OVR y evitas lesiones."
              }
            ]
          },
          onSelectOption: (option) => {
            setPressQuestionModalData(null);
            let ovrDelta = 0;
            if (option.text.includes("Intensivo")) {
              const isSuccess = randomChance(0.60);
              if (isSuccess) {
                ovrDelta = randInt(15, 20) / 10;
                showToast(`🏋️ ¡Gran progreso! +${ovrDelta} OVR.`);
              } else {
                ovrDelta = -(randInt(5, 10) / 10);
                showToast(`⚠️ Sobrecarga muscular: ${ovrDelta} OVR.`);
              }
            } else if (option.text.includes("Táctico")) {
              ovrDelta = 0.8;
              showToast("🧠 Entrenamiento completado (+0.8 OVR).");
            } else {
              ovrDelta = 0;
              showToast("😴 Descanso completado (0 OVR).");
            }

            p.level = clamp(p.level + ovrDelta, 40, 99);
            saveState(stateCopy);
            next();
          }
        });
      });
    }

    // Pregunta de Partidos Clave y Grandes Finales (Probabilidad reducida a 35% para que no sea repetitivo)
    if (randomChance(0.35)) {
      queue.push((next) => {
        const clubObj = CLUBS.find((c) => c.name === p.club) || { league: "LL", tier: 3, country: "España" };
        const leagueInfo = LEAGUES[clubObj.league] || LEAGUES.LL;
        const country = clubObj.country || leagueInfo.country || "España";

        // Selección lógica de Torneo/Final
        let possibleCups: string[] = [];
        if (country === "España" || clubObj.league === "LL" || clubObj.league === "ESP2") {
          if (clubObj.tier >= 4) {
            possibleCups = ["Copa del Rey", "Supercopa de España", "UEFA Champions League", "UEFA Europa League"];
          } else if (clubObj.tier >= 2) {
            possibleCups = ["Copa del Rey", "Supercopa de España", "UEFA Europa League", "Copa RFEF"];
          } else {
            possibleCups = ["Copa del Rey", "Playoff de Ascenso"];
          }
        } else if (country === "Inglaterra" || clubObj.league === "PL" || clubObj.league === "ENG2") {
          possibleCups = ["FA Cup", "Carabao Cup", "UEFA Champions League", "Community Shield"];
        } else if (country === "Italia" || clubObj.league === "SA" || clubObj.league === "ITA2") {
          possibleCups = ["Coppa Italia", "Supercoppa Italiana", "UEFA Champions League"];
        } else if (country === "Alemania" || clubObj.league === "BL" || clubObj.league === "GER2") {
          possibleCups = ["DFB-Pokal", "DFL-Supercup", "UEFA Champions League"];
        } else if (country === "Francia" || clubObj.league === "L1" || clubObj.league === "FRA2") {
          possibleCups = ["Coupe de France", "Trophée des Champions", "UEFA Champions League"];
        } else {
          possibleCups = [leagueInfo.cup || "Copa Nacional", "Supercopa Nacional", "Copa Continental"];
        }
        const mainCup = pick(possibleCups);

        // Selección de rival lógico
        let rivalCandidates: string[] = [];
        if (country === "España" || clubObj.league === "LL" || clubObj.league === "ESP2") {
          const SPANISH_FINALISTS = [
            "Real Madrid", "FC Barcelona", "Atlético de Madrid", "Athletic Club",
            "Real Sociedad", "Sevilla FC", "Real Betis", "Villarreal CF",
            "Valencia CF", "Girona FC", "CA Osasuna", "RCD Mallorca", "Celta de Vigo"
          ];
          rivalCandidates = SPANISH_FINALISTS.filter((o) => o !== p.club);
        } else {
          rivalCandidates = CLUBS.filter((c) => (c.country === country || c.league === clubObj.league) && c.name !== p.club && c.tier >= 2).map((c) => c.name);
        }
        if (rivalCandidates.length === 0) {
          rivalCandidates = OPPONENTS_POOL.filter((o) => o !== p.club);
        }
        const mainOpponent = pick(rivalCandidates);

        setPressQuestionModalData({
          questionData: {
            id: "cup_final_q",
            category: "Finales",
            reporter: "Prensa / Entrenador",
            question: `Final de ${mainCup} vs ${mainOpponent}. ¿Qué rol juegas?`,
            options: [
              {
                text: "🟢 Titular",
                effectText: "Máximo rol (+0.3 OVR / Más opción de título)."
              },
              {
                text: "🔵 Revulsivo",
                effectText: "Entras en la 2ª parte (+0.1 OVR)."
              },
              {
                text: "😴 Banquillo",
                effectText: "Descansas y evitas desgaste."
              }
            ]
          },
          onSelectOption: (option) => {
            setPressQuestionModalData(null);
            const isStarter = option.text.includes("Titular");
            const isSub = option.text.includes("Revulsivo");

            let winProb = 0.48;
            if (isStarter) {
              p.level = clamp(p.level + 0.3, 40, 99);
              winProb += 0.12 + (p.level >= 80 ? 0.12 : p.level >= 70 ? 0.05 : 0);
            } else if (isSub) {
              p.level = clamp(p.level + 0.1, 40, 99);
              winProb += 0.06 + (p.level >= 80 ? 0.08 : 0);
            } else {
              winProb += 0.02;
            }

            const wonMatch = randomChance(clamp(winProb, 0.25, 0.85));
            let userGoals = 0;
            let rivalGoals = 0;

            if (wonMatch) {
              userGoals = randInt(1, 3);
              rivalGoals = Math.max(0, userGoals - randInt(1, 2));
              if (userGoals === rivalGoals) userGoals++;
            } else {
              rivalGoals = randInt(1, 3);
              userGoals = Math.max(0, rivalGoals - randInt(1, 2));
              if (userGoals === rivalGoals) rivalGoals++;
            }

            if (wonMatch) {
              p.titles = (p.titles || 0) + 1;
              p.score += isStarter ? 60 : isSub ? 40 : 25;
              p.trophiesList = p.trophiesList || {};
              p.trophiesList[mainCup] = (p.trophiesList[mainCup] || 0) + 1;
              addTimeline(p, p.age, `🏆 CAMPEÓN de la ${mainCup} (${userGoals}-${rivalGoals} vs ${mainOpponent}).`);
              showToast(`🏆 ¡CAMPEONES! Ganáis ${userGoals}-${rivalGoals} al ${mainOpponent} en la Final de ${mainCup}. ¡Levantas el título!`);
            } else {
              p.score += isStarter ? 20 : isSub ? 10 : 0;
              addTimeline(p, p.age, `🥈 Subcampeón de la ${mainCup} (caéis ${userGoals}-${rivalGoals} vs ${mainOpponent}).`);
              showToast(`🥈 SUBCAMPEONES: Caéis derrotados ${userGoals}-${rivalGoals} ante el ${mainOpponent} en la Final de ${mainCup}.`);
            }

            saveState(stateCopy);
            next();
          }
        });
      });
    }

    // Retirement check
    queue.push((next) => {
      if (p.age >= 30) {
        let retireProb = 0;
        if (p.age >= 30 && p.age < 34) retireProb = 0.02 + (p.age - 30) * 0.02;
        else if (p.age >= 34 && p.age < 37) retireProb = 0.12 + (p.age - 34) * 0.08;
        else if (p.age >= 37 && p.age < 40) retireProb = 0.35 + (p.age - 37) * 0.15;
        else retireProb = clamp(0.75 + (p.age - 40) * 0.1, 0.75, 0.98);

        if (p.level < 60) retireProb += 0.1;

        if (randomChance(clamp(retireProb, 0, 0.98))) {
          p.retired = true;
          addTimeline(p, p.age, "RETIRADA. Fin de una gran carrera profesional.");
          saveState(stateCopy);
          next();
          return;
        }

        // Opción explícita de retirada al cumplir 34 años o más
        if (p.age >= 34 && !p.retired) {
          setPressQuestionModalData({
            questionData: {
              id: "retirement_decision_q",
              category: "Gestión",
              reporter: "Rueda de Prensa y Familia",
              question: `Decisión de Futuro y Retirada: Tienes ${p.age} años de edad. Tras una destacada trayectoria en el fútbol profesional, ¿has decidido colgar las botas al término de esta temporada?`,
              options: [
                {
                  text: "🏆 Anunciar tu retirada oficial del fútbol profesional.",
                  effectText: "Pones punto y final a tu carrera deportiva como una auténtica leyenda.",
                  statBonus: { scoreDelta: 100 }
                },
                {
                  text: "⚽ Continuar compitiendo en activo al menos una temporada más.",
                  effectText: "Decides seguir en activo y disputar la próxima temporada con máxima ilusión.",
                  statBonus: { scoreDelta: 20 }
                }
              ]
            },
            onSelectOption: (option) => {
              setPressQuestionModalData(null);
              if (option.text.startsWith("🏆 Anunciar")) {
                p.retired = true;
                addTimeline(p, p.age, `RETIRADA VOLUNTARIA. Te retiras del fútbol profesional a los ${p.age} años.`);
                saveState(stateCopy);
                showToast(`👴 ¡Anuncias tu retirada oficial del fútbol profesional a los ${p.age} años!`);
                next();
              } else {
                saveState(stateCopy);
                showToast("⚽ ¡Decides competir al menos una temporada más!");
                next();
              }
            }
          });
          return;
        }

        if (p.age >= 33 && randomChance(0.35)) {
          showToast("Tu físico empieza a notar el paso de los años.");
        }
      }
      next();
    });

    // Advance season
    queue.push(() => {
      if (p.retired) {
        saveState(stateCopy);
        return;
      }
      p.age += 1;
      p.season += 1;
      p.seasonYearStart += 1;
      saveState(stateCopy);
    });

    let idx = 0;
    const processPostQueue = () => {
      if (idx >= queue.length) return;
      const item = queue[idx++];
      item(processPostQueue);
    };
    processPostQueue();
  };

  const generateOffers = (p: any, count: number, isVeryGoodSeason: boolean = false): Offer[] => {
    let pool = CLUBS.filter((c) => c.name !== p.club);

    if (isVeryGoodSeason) {
      // Prioritize famous & top Tier 4/5 clubs for scouts after a great season
      const topClubs = pool.filter((c) => c.tier >= 4);
      if (topClubs.length > 0) {
        pool = topClubs;
      }
    }

    const levelTierTarget = isVeryGoodSeason ? 5 : clamp(Math.round(p.level / 20), 1, 5);
    pool.sort((a, b) => Math.abs(a.tier - levelTierTarget) - Math.abs(b.tier - levelTierTarget) + (Math.random() - 0.5) * 3);
    const chosen = pool.slice(0, count);

    return chosen.map((c) => {
      const salaryMult = 1 + (c.tier - levelTierTarget) * 0.12 + (Math.random() * 0.3 - 0.05);
      const newSalary = Math.max(0.2, Math.round(p.salary * clamp(salaryMult, 0.9, 2.2) * 10) / 10);
      const years = randInt(2, 5);
      const contractValue = Math.round(newSalary * years * 10) / 10;
      const scoutText = isVeryGoodSeason || c.tier >= 4
        ? `Un ojeador te quiere para el ${c.name}`
        : undefined;
      return { 
        club: c, 
        salary: newSalary, 
        years, 
        contractValue, 
        isScoutInterest: isVeryGoodSeason || c.tier >= 4, 
        scoutText 
      };
    });
  };

  const acceptTransfer = (stateCopy: CareerState, offer: Offer) => {
    const p = stateCopy.player;
    p.club = offer.club.name;
    p.salary = offer.salary;
    p.maxSalary = Math.max(p.maxSalary, p.salary);
    p.marketValue = Math.round(p.marketValue * (1 + Math.random() * 0.15) * 10) / 10;
    p.maxMarketValue = Math.max(p.maxMarketValue, p.marketValue);

    if (p.clubsHistory[p.clubsHistory.length - 1] !== offer.club.name) {
      p.clubsHistory.push(offer.club.name);
      addTimeline(p, p.age, `Fichaje por ${offer.club.name}.`);
    }

    saveState(stateCopy);
    showToast(`¡Fichaje realizado! Ahora juegas en ${offer.club.name}`);
  };

  /* ---------------------- Render Views ---------------------- */
  const isSeoPage = 
    currentPath.includes("simulador-carrera-futbolistica") || 
    currentPath.includes("como-funciona") || 
    currentPath.includes("football-career-simulator");

  if (isSeoPage) {
    return (
      <div>
        <div className="stripe-field"></div>
        <SeoPagesView
          pagePath={currentPath}
          onNavigateHome={() => {
            window.history.pushState({}, "", "/");
            setCurrentPath("/");
          }}
        />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginView
        currentUser={currentUser}
        authError={authError}
        authBusy={authBusy || !authReady}
        onClearError={() => setAuthError(null)}
        showToast={showToast}
      />
    );
  }

  return (
    <div>
      <div className="stripe-field"></div>
      
      {/* Toast Notification */}
      <div className={`toast ${toastMessage ? "show" : ""}`}>{toastMessage}</div>

      {/* Main Views */}
      {!careerState ? (
        <WelcomeView
          existingGame={null}
          onContinueGame={() => {}}
          onCreateGame={(newState) => saveState(newState)}
        />
      ) : careerState.player.retired ? (
        <RetirementView
          state={careerState}
          onNewCareer={() => {
            setConfirmModalData({
              title: "¿Empezar una nueva carrera?",
              text: "Se borrarán los datos de tu carrera anterior.",
              onConfirm: () => {
                setConfirmModalData(null);
                clearGame();
              },
            });
          }}
          onLogout={() => doLogout()}
        />
      ) : inInteractiveMode && careerState.activeSeason ? (
        <InteractiveSeasonView
          currentUser={currentUser}
          state={careerState}
          activeSeason={careerState.activeSeason}
          onUpdateActiveSeason={handleUpdateActiveSeason}
          onFinishSeason={handleFinishInteractiveSeason}
          onFastForwardSeason={handleFastForwardInteractiveSeason}
          onOpenPressModal={handleOpenPressQuestionModal}
          onLogout={() => {
            setConfirmModalData({
              title: "¿Cerrar sesión?",
              text: "Tu partida ya está guardada en tu cuenta, podrás continuar la próxima vez que inicies sesión.",
              onConfirm: () => {
                setConfirmModalData(null);
                doLogout();
              },
            });
          }}
          onLinkAccount={() => setShowLinkModal(true)}
        />
      ) : (
        <DashboardView
          currentUser={currentUser}
          state={careerState}
          onPlaySeason={handlePlaySeason}
          onStartInteractiveSeason={handleStartInteractiveSeason}
          onRetirePlayer={handleRetirePlayerVoluntarily}
          onNewCareer={() => {
            setConfirmModalData({
              title: "¿Empezar una nueva carrera?",
              text: "Perderás el progreso de la carrera actual si no ha sido guardada de otra forma.",
              onConfirm: () => {
                setConfirmModalData(null);
                clearGame();
              },
            });
          }}
          onLogout={() => {
            setConfirmModalData({
              title: "¿Cerrar sesión?",
              text: "Tu partida ya está guardada en tu cuenta, podrás continuar la próxima vez que inicies sesión.",
              onConfirm: () => {
                setConfirmModalData(null);
                doLogout();
              },
            });
          }}
          onLinkAccount={() => setShowLinkModal(true)}
        />
      )}

      {/* Modals & Overlay Sequence */}
      {isSpinning && <LuckSpinnerModal phaseText={simPhaseText} />}

      {callUpData && (
        <CallUpModal
          nationality={callUpData.nationality}
          flag={callUpData.flag}
          tourName={callUpData.tourName}
          onContinue={callUpData.onContinue}
        />
      )}

      {groupStageData && (
        <GroupStageModal
          nationality={groupStageData.nationality}
          tourName={groupStageData.tourName}
          result={groupStageData.result}
          onContinue={groupStageData.onContinue}
        />
      )}

      {groupResultData && (
        <GroupResultModal
          nationality={groupResultData.nationality}
          tourName={groupResultData.tourName}
          result={groupResultData.result}
          onContinue={groupResultData.onContinue}
        />
      )}

      {simpleMatchesData && (
        <SimpleMatchesModal
          flag={simpleMatchesData.flag}
          tourName={simpleMatchesData.tourName}
          matches={simpleMatchesData.matches}
          onContinue={simpleMatchesData.onContinue}
        />
      )}

      {tourResultData && (
        <TournamentResultModal
          flag={tourResultData.flag}
          tourName={tourResultData.tourName}
          nationality={tourResultData.nationality}
          resultLabel={tourResultData.resultLabel}
          matchDetail={tourResultData.matchDetail}
          onContinue={tourResultData.onContinue}
        />
      )}

      {celebrationModalData && (
        <CelebrationModal
          title={celebrationModalData.title}
          subtitle={celebrationModalData.subtitle}
          level={celebrationModalData.level}
          onContinue={celebrationModalData.onContinue}
        />
      )}

      {multiTitleData && (
        <MultiTitleModal
          titlesWon={multiTitleData.titlesWon}
          onContinue={multiTitleData.onContinue}
        />
      )}

      {summaryModalData && (
        <SeasonSummaryModal
          summary={summaryModalData.summary}
          onContinue={summaryModalData.onContinue}
        />
      )}

      {contractModalData && (
        <ContractModal
          club={contractModalData.club}
          onRenew={contractModalData.onRenew}
          onLeave={contractModalData.onLeave}
        />
      )}

      {singleOfferData && (
        <SingleOfferModal
          currentClub={singleOfferData.currentClub}
          currentSalary={singleOfferData.currentSalary}
          offer={singleOfferData.offer}
          onStay={singleOfferData.onStay}
          onAccept={singleOfferData.onAccept}
        />
      )}

      {multiOfferData && (
        <MultiOfferModal
          currentClub={multiOfferData.currentClub}
          offers={multiOfferData.offers}
          onAcceptOffer={multiOfferData.onAcceptOffer}
          onStay={multiOfferData.onStay}
        />
      )}

      {positionChangeData && (
        <PositionChangeModal
          currentPos={positionChangeData.currentPos}
          newPosKey={positionChangeData.newPosKey}
          onAccept={positionChangeData.onAccept}
          onReject={positionChangeData.onReject}
        />
      )}

      {sponsorModalData && (
        <SponsorModal
          sponsorName={sponsorModalData.sponsorName}
          bonus={sponsorModalData.bonus}
          onAccept={sponsorModalData.onAccept}
          onReject={sponsorModalData.onReject}
        />
      )}

      {pressQuestionModalData && (
        <PressQuestionModal
          questionData={pressQuestionModalData.questionData}
          onSelectOption={pressQuestionModalData.onSelectOption}
        />
      )}

      {confirmModalData && (
        <ConfirmModal
          title={confirmModalData.title}
          text={confirmModalData.text}
          confirmText={confirmModalData.confirmText}
          cancelText={confirmModalData.cancelText}
          onConfirm={confirmModalData.onConfirm}
          onCancel={() => {
            if (confirmModalData.onCancel) {
              confirmModalData.onCancel();
            } else {
              setConfirmModalData(null);
            }
          }}
        />
      )}

      {showLinkModal && (
        <LinkAccountModal
          authError={authError}
          onGoogle={() => {
            setShowLinkModal(false);
            doGoogleLogin();
          }}
          onApple={() => {
            setShowLinkModal(false);
            doAppleLogin();
          }}
          onEmail={(email, pass) => {
            setShowLinkModal(false);
            doEmailSignup(email, pass).catch((e: any) => setAuthError(e.message));
          }}
          onCancel={() => setShowLinkModal(false)}
        />
      )}

      {trainingModalData && (
        <TrainingQuestionModal
          seasonYear={trainingModalData.seasonYear}
          clubName={trainingModalData.clubName}
          onSelectOption={trainingModalData.onSelectOption}
        />
      )}

      {showCupFinalModalData && (
        <CupFinalModal
          finalTitle={showCupFinalModalData.finalTitle}
          opponent={showCupFinalModalData.opponent}
          userClub={showCupFinalModalData.userClub}
          onSelectOption={showCupFinalModalData.onSelectOption}
        />
      )}
    </div>
  );
}
