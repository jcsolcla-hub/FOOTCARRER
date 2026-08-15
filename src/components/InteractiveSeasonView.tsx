import React, { useState } from "react";
import appIconImg from "../assets/images/footcarrer_favicon_logo_1786788354186.jpg";
import { User } from "firebase/auth";
import { 
  CareerState, 
  ActiveSeasonState, 
  TrainingDrillType, 
  SeasonMatchFixture, 
  SeasonMatchResult,
  PlayerAttributes,
  CareerEventOption
} from "../types";
import { 
  POS_NAMES, 
  fmtMoney, 
  fmtSalary, 
  clamp, 
  randInt 
} from "../data/clubsAndLeagues";
import { 
  generateMatchKeyMoments, 
  simulateSingleMatch, 
  updateStandingsAndScorers, 
  evaluateObjectives, 
  getRoleFromTrust 
} from "../lib/seasonGenerator";
import { 
  generateCareerEvent, 
  processCareerEventChoice 
} from "../lib/careerEventEngine";
import { MatchKeyMomentsModal } from "./MatchKeyMomentsModal";
import { BootsAndPromoModal, CupFinalModal, InteractiveDecisionCard } from "./SeasonDecisionModals";

interface InteractiveSeasonViewProps {
  currentUser: User | null;
  state: CareerState;
  activeSeason: ActiveSeasonState;
  onUpdateActiveSeason: (updatedSeason: ActiveSeasonState, updatedCareerState?: CareerState) => void;
  onFinishSeason: (activeSeason: ActiveSeasonState) => void;
  onFastForwardSeason: () => void;
  onOpenPressModal: () => void;
  onLogout: () => void;
  onLinkAccount: () => void;
}

export const InteractiveSeasonView: React.FC<InteractiveSeasonViewProps> = ({
  currentUser,
  state,
  activeSeason,
  onUpdateActiveSeason,
  onFinishSeason,
  onFastForwardSeason,
  onOpenPressModal,
  onLogout,
  onLinkAccount
}) => {
  const p = state.player;
  const [activeTab, setActiveTab] = useState<"match" | "calendar" | "training" | "coach" | "standings" | "objectives" | "attributes">("match");
  const [selectedDrill, setSelectedDrill] = useState<TrainingDrillType>("equilibrado");
  const [activeMatchModalFixture, setActiveMatchModalFixture] = useState<SeasonMatchFixture | null>(null);
  const [showBootsModal, setShowBootsModal] = useState<boolean>(false);
  const [showCupFinalModal, setShowCupFinalModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentFixture = activeSeason.fixtures[activeSeason.currentFixtureIndex] || null;
  const isSeasonOver = activeSeason.currentFixtureIndex >= activeSeason.fixtures.length;
  const isCupFinalMatch = Boolean(
    currentFixture && 
    (currentFixture.jornadaName.toLowerCase().includes("final") || 
     currentFixture.competition === "Copa" || 
     currentFixture.competition === "Champions")
  );

  const showLocalToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 2800);
  };

  /* ---------------- Decision Event Handlers ---------------- */
  const currentPendingEvent = activeSeason.pendingEvent || (
    !isSeasonOver ? generateCareerEvent(p, activeSeason, currentFixture) : null
  );

  const handleSelectDecisionOption = (option: CareerEventOption) => {
    const copy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));
    const stateCopy: CareerState = JSON.parse(JSON.stringify(state));

    const { toastMsg, newsHeadline, ovrDelta } = processCareerEventChoice(option, copy, stateCopy.player);
    copy.pendingEvent = null; // Clear event after decision

    if (ovrDelta) {
      stateCopy.player.level = clamp(stateCopy.player.level + ovrDelta, 40, 99);
    }

    copy.recentEventsLog.unshift(`[Decisión] ${option.text} (${option.effectText})`);

    showLocalToast(toastMsg);
    onUpdateActiveSeason(copy, stateCopy);
  };

  /* ---------------- Match Action Handlers ---------------- */
  const handlePlayMatchInteractive = () => {
    if (!currentFixture) return;
    if (isCupFinalMatch && !showCupFinalModal) {
      setShowCupFinalModal(true);
      return;
    }
    if (activeSeason.energy < 20) {
      showLocalToast("⚠️ Tienes muy poca energía (<20%). Se recomienda simular o descansar.");
    }
    setActiveMatchModalFixture(currentFixture);
  };

  const handleCompleteInteractiveMatch = (result: SeasonMatchResult) => {
    setActiveMatchModalFixture(null);
    setShowCupFinalModal(false);
    processMatchResult(result, currentFixture!);
  };

  const handleSimulateMatch = () => {
    if (!currentFixture) return;
    setShowCupFinalModal(false);
    const res = simulateSingleMatch(currentFixture, p, activeSeason);
    processMatchResult(res, currentFixture);
  };

  const processMatchResult = (result: SeasonMatchResult, fixture: SeasonMatchFixture) => {
    const copy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));
    
    // Update fixture
    const currentFix = copy.fixtures[copy.currentFixtureIndex];
    currentFix.played = true;
    currentFix.result = result;

    // Update Player Stats
    copy.seasonMatches += 1;
    copy.seasonGoals += result.playerGoals;
    copy.seasonAssists += result.playerAssists;
    copy.seasonMinutes += result.playerMinutes;
    copy.seasonRatings.push(result.playerRating);

    // Energy & Fatigue
    const energyUsed = Math.round((result.playerMinutes / 90) * randInt(20, 30));
    copy.energy = clamp(copy.energy - energyUsed, 5, 100);
    copy.fatigue = clamp(copy.fatigue + Math.round(energyUsed * 0.4), 0, 100);

    // Coach Trust & Morale & Form
    if (result.playerRating >= 8.0) {
      copy.coachTrust = clamp(copy.coachTrust + 4, 0, 100);
      copy.morale = clamp(copy.morale + 5, 0, 100);
      copy.confidence = clamp(copy.confidence + 5, 0, 100);
      copy.form = clamp(copy.form + 6, 0, 100);
    } else if (result.playerRating >= 6.8) {
      copy.coachTrust = clamp(copy.coachTrust + 1, 0, 100);
      copy.form = clamp(copy.form + 2, 0, 100);
    } else {
      copy.coachTrust = clamp(copy.coachTrust - 3, 0, 100);
      copy.morale = clamp(copy.morale - 4, 0, 100);
      copy.confidence = clamp(copy.confidence - 4, 0, 100);
      copy.form = clamp(copy.form - 5, 0, 100);
    }

    copy.squadRole = getRoleFromTrust(copy.coachTrust);

    // Update Standings & Scorers
    updateStandingsAndScorers(copy, result, fixture, p.name, p.club);

    // Check Objectives
    evaluateObjectives(copy);

    // Advance Fixture
    copy.currentFixtureIndex += 1;
    copy.recentEventsLog.unshift(
      `[${fixture.jornadaName}] ${fixture.isHome ? p.club : fixture.opponent} ${result.homeGoals} - ${result.awayGoals} ${fixture.isHome ? fixture.opponent : p.club} (Tu Nota: ${result.playerRating})`
    );

    // Prepare next pending event for next fixture
    if (copy.currentFixtureIndex < copy.fixtures.length) {
      copy.pendingEvent = generateCareerEvent(p, copy, copy.fixtures[copy.currentFixtureIndex]);
    }

    if (copy.currentFixtureIndex >= copy.fixtures.length) {
      showLocalToast("🎉 ¡Has completado todas las jornadas de la temporada!");
      onFinishSeason(copy);
    } else {
      onUpdateActiveSeason(copy);
      showLocalToast(`⚽ Partido finalizado. Nota: ${result.playerRating}/10 (${result.playerGoals}G, ${result.playerAssists}A)`);
    }
  };

  const handleRestInsteadOfPlaying = () => {
    if (!currentFixture) return;
    const copy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));
    
    // Simulate match without user playing
    const emptyResult: SeasonMatchResult = {
      homeGoals: randInt(0, 2),
      awayGoals: randInt(0, 2),
      playerGoals: 0,
      playerAssists: 0,
      playerRating: 6.0,
      playerMinutes: 0,
      wasSimulated: true,
      matchHighlights: ["Descansaste este partido por decisión técnica o fatiga."]
    };

    const currentFix = copy.fixtures[copy.currentFixtureIndex];
    currentFix.played = true;
    currentFix.result = emptyResult;

    copy.energy = clamp(copy.energy + 40, 0, 100);
    copy.fatigue = clamp(copy.fatigue - 25, 0, 100);
    copy.recentEventsLog.unshift(`[${currentFix.jornadaName}] Te tomaste la jornada de descanso para recuperar fuerzas (+40% Energía).`);

    updateStandingsAndScorers(copy, emptyResult, currentFix, p.name, p.club);
    evaluateObjectives(copy);

    copy.currentFixtureIndex += 1;

    if (copy.currentFixtureIndex >= copy.fixtures.length) {
      onFinishSeason(copy);
    } else {
      onUpdateActiveSeason(copy);
      showLocalToast("😴 Has descansado esta jornada. Recuperas +40% de Energía.");
    }
  };

  /* ---------------- Training Session ---------------- */
  const handleExecuteTraining = () => {
    if (activeSeason.energy < 15) {
      showLocalToast("⚠️ Estás demasiado agotado para entrenar. Tómate una jornada de descanso.");
      return;
    }

    const copy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));
    copy.energy = clamp(copy.energy - 18, 5, 100);
    copy.fatigue = clamp(copy.fatigue + 8, 0, 100);
    copy.coachTrust = clamp(copy.coachTrust + 2, 0, 100);

    let statKey: keyof PlayerAttributes = "tecnica";
    if (selectedDrill === "velocidad") statKey = "velocidad";
    else if (selectedDrill === "tiro") statKey = "tiro";
    else if (selectedDrill === "regate") statKey = "regate";
    else if (selectedDrill === "pase") statKey = "pase";
    else if (selectedDrill === "defensa") statKey = "defensa";
    else if (selectedDrill === "fisico") statKey = "fisico";
    else if (selectedDrill === "resistencia") statKey = "resistencia";

    if (selectedDrill === "equilibrado") {
      (Object.keys(copy.attributes) as (keyof PlayerAttributes)[]).forEach(k => {
        copy.attributeXP[k] += 25;
        if (copy.attributeXP[k] >= 100) {
          copy.attributes[k] = clamp(copy.attributes[k] + 1, 40, 99);
          copy.attributeXP[k] -= 100;
        }
      });
      showLocalToast("🏋️ Sesión equilibrada completada. Mejora general en todos tus atributos (+25 XP).");
    } else {
      copy.attributeXP[statKey] += 60;
      if (copy.attributeXP[statKey] >= 100) {
        copy.attributes[statKey] = clamp(copy.attributes[statKey] + 1, 40, 99);
        copy.attributeXP[statKey] -= 100;
        showLocalToast(`🚀 ¡PUNTO SUBIDO! Tu atributo '${statKey}' ha aumentado a ${copy.attributes[statKey]} PTS.`);
      } else {
        showLocalToast(`🏋️ Entrenamiento de '${selectedDrill}' completado (+60 XP).`);
      }
    }

    copy.recentEventsLog.unshift(`Sesión de entrenamiento enfocado en '${selectedDrill}' completada con éxito.`);
    onUpdateActiveSeason(copy);
  };

  /* ---------------- Coach & Decision Interactions ---------------- */
  const handleAskStarterRole = () => {
    if (activeSeason.coachTrust >= 70) {
      const copy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));
      copy.coachTrust = clamp(copy.coachTrust + 5, 0, 100);
      copy.squadRole = "Titular";
      copy.recentEventsLog.unshift("Hablaste con el entrenador y ha aceptado darte la titularidad garantizada.");
      onUpdateActiveSeason(copy);
      showLocalToast("👔 El míster te felicita por tu actitud y te concede la titularidad.");
    } else {
      showLocalToast("👔 El míster dice: 'Debes demostrar más en el campo antes de exigir ser titular'.");
    }
  };

  const handleTalkToCoach = () => {
    const copy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));
    copy.coachTrust = clamp(copy.coachTrust + 3, 0, 100);
    copy.morale = clamp(copy.morale + 4, 0, 100);
    copy.recentEventsLog.unshift("Reunión con el míster: Ha elogiado tu compromiso con el equipo.");
    onUpdateActiveSeason(copy);
    showLocalToast("💬 Buenas sensaciones tras la charla técnica con el entrenador.");
  };

  /* ---------------- Boots & Sponsorship Promos Handlers ---------------- */
  const handleBuyBoots = (bootType: "speed" | "shoot" | "tech", cost: number) => {
    if (p.money < cost) {
      showLocalToast("❌ No dispones de suficiente dinero para adquirir estas botas.");
      return;
    }
    const stateCopy: CareerState = JSON.parse(JSON.stringify(state));
    stateCopy.player.money -= cost;

    const seasonCopy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));
    if (bootType === "speed") {
      seasonCopy.attributes.velocidad = clamp(seasonCopy.attributes.velocidad + 2, 40, 99);
      seasonCopy.attributes.regate = clamp(seasonCopy.attributes.regate + 2, 40, 99);
      showLocalToast("⚡ ¡Nuevas Botas de Velocidad equipadas (+2 Velocidad / +2 Regate)!");
    } else if (bootType === "shoot") {
      seasonCopy.attributes.tiro = clamp(seasonCopy.attributes.tiro + 2, 40, 99);
      seasonCopy.attributes.tecnica = clamp(seasonCopy.attributes.tecnica + 2, 40, 99);
      showLocalToast("⚽ ¡Nuevas Botas Potencia de Tiro equipadas (+2 Tiro / +2 Técnica)!");
    } else {
      seasonCopy.attributes.pase = clamp(seasonCopy.attributes.pase + 2, 40, 99);
      seasonCopy.attributes.regate = clamp(seasonCopy.attributes.regate + 2, 40, 99);
      showLocalToast("🪄 ¡Nuevas Botas Control Élite equipadas (+2 Pase / +2 Regate)!");
    }

    stateCopy.player.level = clamp(stateCopy.player.level + 0.5, 40, 99);
    onUpdateActiveSeason(seasonCopy, stateCopy);
    setShowBootsModal(false);
  };

  const handleDoPromo = (promoType: "sponsorship" | "social") => {
    const stateCopy: CareerState = JSON.parse(JSON.stringify(state));
    const seasonCopy: ActiveSeasonState = JSON.parse(JSON.stringify(activeSeason));

    if (promoType === "sponsorship") {
      stateCopy.player.money += 80000;
      seasonCopy.energy = clamp(seasonCopy.energy - 10, 10, 100);
      seasonCopy.fatigue = clamp(seasonCopy.fatigue + 10, 0, 100);
      seasonCopy.recentEventsLog.unshift("Publicidad: Rodaje de anuncio comercial televisivo (+80.000€).");
      showLocalToast("📸 ¡Anuncio televisivo realizado! Ingresas +80.000€ (Mayor cansancio).");
    } else {
      stateCopy.player.money += 45000;
      seasonCopy.morale = clamp(seasonCopy.morale + 8, 0, 100);
      seasonCopy.coachTrust = clamp(seasonCopy.coachTrust + 3, 0, 100);
      seasonCopy.recentEventsLog.unshift("Redes Sociales: Campaña con patrocinador (+45.000€).");
      showLocalToast("📲 ¡Campaña publicada! Ingresas +45.000€ y ganas popularidad.");
    }

    onUpdateActiveSeason(seasonCopy, stateCopy);
    setShowBootsModal(false);
  };

  // Average Rating
  const avgRating = activeSeason.seasonRatings.length > 0 
    ? (activeSeason.seasonRatings.reduce((a, b) => a + b, 0) / activeSeason.seasonRatings.length).toFixed(1)
    : "7.0";

  return (
    <div>
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1e293b",
          color: "var(--gold)",
          padding: "10px 22px",
          borderRadius: "30px",
          border: "1px solid var(--gold)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          zIndex: 9999,
          fontSize: "13px",
          fontWeight: "bold"
        }}>
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <div className="top-nav">
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img 
            src={appIconImg} 
            alt="Logo" 
            style={{ width: "28px", height: "28px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--gold)" }} 
          />
          FOOTCARRER · MODO CARRERA<span>.</span>
        </div>
        <div className="btn-row" style={{ gap: "8px" }}>
          <button className="btn btn-secondary" onClick={() => setShowBootsModal(true)} style={{ padding: "8px 12px", fontSize: "12px", color: "var(--gold)" }}>
            👟 Botas & Promos
          </button>
          <button className="btn btn-ghost" onClick={onFastForwardSeason} style={{ padding: "8px 12px", fontSize: "12px", color: "var(--accent)" }}>
            ⚡ Simular resto de temporada
          </button>
          <button className="btn btn-ghost" onClick={onLogout} style={{ padding: "8px 12px", fontSize: "12px" }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Player Season Header Status */}
      <div className="player-card" style={{ marginBottom: "20px" }}>
        <div className="player-top">
          <div>
            <div className="eyebrow" style={{ color: "var(--gold)" }}>
              📅 TEMPORADA {p.season} ({activeSeason.yearLabel}) · JORNADA {activeSeason.currentFixtureIndex + 1}/{activeSeason.fixtures.length}
            </div>
            <div className="player-name">{p.name}</div>
            <div className="player-meta">
              {p.age} años · {POS_NAMES[p.position]} · {p.club}
            </div>
          </div>
          <div className="ovr-badge">
            <b>{Math.round(p.level)}</b>
            <span>OVR</span>
          </div>
        </div>

        {/* Live Status Indicators (Energy, Fatigue, Morale, Coach Trust, Confidence, Form, LockerRoom, Reputation) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "8px", marginTop: "16px" }}>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>❤️ Energía</div>
            <div style={{ fontSize: "15px", fontWeight: "bold", color: activeSeason.energy > 50 ? "#34d399" : "#f87171" }}>
              {activeSeason.energy}%
            </div>
            <div className="bar" style={{ height: "3px", marginTop: "3px" }}>
              <div className="bar-fill" style={{ width: `${activeSeason.energy}%`, background: activeSeason.energy > 50 ? "#34d399" : "#f87171" }}></div>
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>⚡ Cansancio</div>
            <div style={{ fontSize: "15px", fontWeight: "bold", color: activeSeason.fatigue > 50 ? "#f87171" : "#60a5fa" }}>
              {activeSeason.fatigue}%
            </div>
            <div className="bar" style={{ height: "3px", marginTop: "3px" }}>
              <div className="bar-fill" style={{ width: `${activeSeason.fatigue}%`, background: activeSeason.fatigue > 50 ? "#f87171" : "#60a5fa" }}></div>
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>👔 Míster</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--gold)" }}>
              {activeSeason.coachTrust}%
            </div>
            <div style={{ fontSize: "10px", color: "var(--accent)" }}>{activeSeason.squadRole}</div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>🧠 Confianza</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#60a5fa" }}>
              {activeSeason.confidence}%
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>📈 Forma</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#34d399" }}>
              {activeSeason.form}%
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>👥 Vestuario</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#a7f3d0" }}>
              {activeSeason.lockerRoomRel}%
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>⭐ Reputación</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#c084fc" }}>
              {activeSeason.reputation}%
            </div>
          </div>
        </div>

        {/* Season Stat Counters */}
        <div className="stat-row" style={{ marginTop: "12px" }}>
          <div className="stat-box">
            <div className="v">{activeSeason.seasonMatches}</div>
            <div className="l">Partidos</div>
          </div>
          <div className="stat-box">
            <div className="v">{activeSeason.seasonGoals}</div>
            <div className="l">Goles</div>
          </div>
          <div className="stat-box">
            <div className="v">{activeSeason.seasonAssists}</div>
            <div className="l">Asistencias</div>
          </div>
          <div className="stat-box">
            <div className="v">{fmtMoney(p.marketValue)}</div>
            <div className="l">Valor Mercado</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "16px" }}>
        <button 
          className={`btn ${activeTab === "match" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("match")}
          style={{ whiteSpace: "nowrap" }}
        >
          ⚽ Próximo Partido
        </button>
        <button 
          className={`btn ${activeTab === "training" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("training")}
          style={{ whiteSpace: "nowrap" }}
        >
          🏋️ Entrenamiento
        </button>
        <button 
          className={`btn ${activeTab === "calendar" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("calendar")}
          style={{ whiteSpace: "nowrap" }}
        >
          📅 Calendario
        </button>
        <button 
          className={`btn ${activeTab === "coach" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("coach")}
          style={{ whiteSpace: "nowrap" }}
        >
          👔 Míster & Vestuario
        </button>
        <button 
          className={`btn ${activeTab === "standings" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("standings")}
          style={{ whiteSpace: "nowrap" }}
        >
          🏆 Clasificación
        </button>
        <button 
          className={`btn ${activeTab === "objectives" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("objectives")}
          style={{ whiteSpace: "nowrap" }}
        >
          🎯 Objetivos
        </button>
        <button 
          className={`btn ${activeTab === "attributes" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("attributes")}
          style={{ whiteSpace: "nowrap" }}
        >
          📈 Atributos
        </button>
      </div>

      {/* TAB 1: PRÓXIMO PARTIDO Y SIMULADOR DE CARRERA */}
      {activeTab === "match" && (
        <div>
          {/* Decision Event Card (Narrative simulator focus) */}
          {currentPendingEvent && (
            <InteractiveDecisionCard
              event={currentPendingEvent}
              activeSeason={activeSeason}
              player={p}
              onSelectOption={handleSelectDecisionOption}
            />
          )}

          {/* Newspaper / News Feed */}
          {activeSeason.recentNews && activeSeason.recentNews.length > 0 && (
            <div className="card" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", border: "1px solid rgba(232, 184, 75, 0.4)", padding: "16px", marginBottom: "20px", borderRadius: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", fontWeight: "bold", fontSize: "14px", marginBottom: "10px" }}>
                <span>🗞️</span> PRENSA Y NOTICIAS RECIENTES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {activeSeason.recentNews.slice(0, 3).map((headline, idx) => (
                  <div key={idx} style={{ fontSize: "13px", color: "#e2e8f0", background: "rgba(0,0,0,0.25)", padding: "8px 12px", borderRadius: "6px" }}>
                    {headline}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentFixture ? (
            <div className="card" style={{ border: "1px solid var(--gold)", padding: "20px", marginBottom: "20px" }}>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span className="badge" style={{ background: "var(--accent)", color: "#000", fontWeight: "bold" }}>
                  {currentFixture.competition} · {currentFixture.jornadaName}
                </span>
                <h2 style={{ fontSize: "26px", margin: "10px 0 4px", color: "#fff" }}>
                  {currentFixture.isHome ? `${p.club} vs ${currentFixture.opponent}` : `${currentFixture.opponent} vs ${p.club}`}
                </h2>
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                  {currentFixture.dateLabel} · {currentFixture.isHome ? "🏟️ En casa" : "✈️ Fuera de casa"} · Importancia: <strong style={{ color: "var(--gold)" }}>{currentFixture.importance}</strong>
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.25)", padding: "16px", borderRadius: "12px", marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "var(--gold)", marginBottom: "10px", textAlign: "center" }}>
                  ⚡ ACCIÓN EN EL MODO SIMULADOR DE CARRERA
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <button 
                    className="btn btn-primary"
                    onClick={isCupFinalMatch ? () => setShowCupFinalModal(true) : handleSimulateMatch}
                    style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
                  >
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {isCupFinalMatch ? "🏆 DISPUTAR / SIMULAR LA GRAN FINAL" : "⚡ SIMULAR PARTIDO Y AVANZAR"}
                    </span>
                    <span style={{ fontSize: "11px", opacity: 0.9 }}>
                      {isCupFinalMatch ? "Elige si jugar momentos clave o simular el título" : "Genera resultado, minutos, goles, valoración y rendimiento de forma coherente"}
                    </span>
                  </button>

                  <button 
                    className="btn btn-ghost"
                    onClick={handleRestInsteadOfPlaying}
                    style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: "bold", color: "#34d399" }}>😴 DESCANSAR ESTA JORNADA</span>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>Recupera +40% Energía y reduce fatiga</span>
                  </button>
                </div>
              </div>

              {/* Recent Match Events Log */}
              {activeSeason.recentEventsLog.length > 0 && (
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px 16px", fontSize: "12px", color: "#cbd5e1" }}>
                  <strong style={{ color: "var(--gold)", display: "block", marginBottom: "6px" }}>📰 Historial de la Temporada:</strong>
                  {activeSeason.recentEventsLog.slice(0, 4).map((log, idx) => (
                    <div key={idx} style={{ marginBottom: "4px" }}>• {log}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "30px" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏆</div>
              <h2>¡TEMPORADA FINALIZADA!</h2>
              <p style={{ color: "var(--muted)", margin: "8px 0 20px" }}>Has disputado todos los partidos programados para esta temporada.</p>
              <button className="btn btn-primary" onClick={() => onFinishSeason(activeSeason)}>
                🏆 VER RESULTADOS Y CELEBRAR FINAL DE TEMPORADA
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ENTRENAMIENTO */}
      {activeTab === "training" && (
        <div className="card">
          <h2 style={{ fontSize: "18px", margin: "0 0 12px", color: "var(--gold)" }}>🏋️ CENTRO DE ENTRENAMIENTO INDIVIDUAL</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
            Elige en qué faceta técnica o física deseas ejercitarte antes del próximo encuentro. Consume -18% de energía.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px", marginBottom: "20px" }}>
            {[
              { id: "velocidad", title: "⚡ Velocidad & Aceleración", desc: "Aumenta la punta de velocidad y potencia de desmarque" },
              { id: "tiro", title: "⚽ Tiro & Finalización", desc: "Mejora la precisión ante portería y potencia de disparo" },
              { id: "regate", title: "🪄 Regate & Desborde", desc: "Perfecciona el uno contra uno y regates de fantasía" },
              { id: "pase", title: "🎯 Pase & Visión", desc: "Precisión en pases cortos y pases filtrados de gol" },
              { id: "defensa", title: "🛡️ Defensa & Intercepción", desc: "Efectividad en robos de balón y posición defensiva" },
              { id: "fisico", title: "💪 Físico & Salto", desc: "Cuerpo a cuerpo, disputas aéreas y fuerza física" },
              { id: "resistencia", title: "🫁 Resistencia", desc: "Reduce el desgaste de energía durante los partidos" },
              { id: "tecnica", title: "✨ Técnica de Faltas", desc: "Lanzamiento de faltas directas, penaltis y saques" },
              { id: "equilibrado", title: "⚖️ Entreno Equilibrado", desc: "Desarrollo armónico en todas las áreas de juego" }
            ].map(drill => (
              <div 
                key={drill.id}
                onClick={() => setSelectedDrill(drill.id as TrainingDrillType)}
                style={{
                  background: selectedDrill === drill.id ? "rgba(232, 184, 75, 0.15)" : "rgba(255,255,255,0.03)",
                  border: selectedDrill === drill.id ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "13px", color: selectedDrill === drill.id ? "var(--gold)" : "#fff" }}>
                  {drill.title}
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                  {drill.desc}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handleExecuteTraining} style={{ width: "100%", padding: "12px", fontSize: "14px" }}>
            💪 COMPLETAR SESIÓN DE ENTRENAMIENTO (-18% ENERGÍA)
          </button>
        </div>
      )}

      {/* TAB 3: CALENDARIO */}
      {activeTab === "calendar" && (
        <div className="card">
          <h2 style={{ fontSize: "18px", margin: "0 0 12px", color: "var(--gold)" }}>📅 CALENDARIO DE LA TEMPORADA</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {activeSeason.fixtures.map((fix, idx) => {
              const isCurrent = idx === activeSeason.currentFixtureIndex;
              return (
                <div 
                  key={fix.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: isCurrent ? "rgba(232, 184, 75, 0.12)" : "rgba(255,255,255,0.02)",
                    border: isCurrent ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    fontSize: "13px"
                  }}
                >
                  <div>
                    <span className="mono" style={{ fontSize: "11px", color: "var(--muted)", marginRight: "8px" }}>
                      {fix.dateLabel}
                    </span>
                    <strong style={{ color: "#fff" }}>
                      {fix.jornadaName}: {fix.isHome ? `${p.club} vs ${fix.opponent}` : `${fix.opponent} vs ${p.club}`}
                    </strong>
                    <span style={{ fontSize: "11px", color: "var(--gold)", marginLeft: "8px" }}>
                      [{fix.competition}]
                    </span>
                  </div>

                  <div>
                    {fix.played && fix.result ? (
                      <span className="mono" style={{ fontWeight: "bold", color: "#34d399" }}>
                        {fix.result.homeGoals} - {fix.result.awayGoals} ({fix.result.playerGoals}G, {fix.result.playerAssists}A)
                      </span>
                    ) : (
                      <span style={{ fontSize: "11px", color: isCurrent ? "var(--gold)" : "var(--muted)", fontWeight: isCurrent ? "bold" : "normal" }}>
                        {isCurrent ? "👉 PRÓXIMO ENCUENTRO" : "Pendiente"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MÍSTER & VESTUARIO */}
      {activeTab === "coach" && (
        <div className="card">
          <h2 style={{ fontSize: "18px", margin: "0 0 12px", color: "var(--gold)" }}>👔 DESPACHO DEL ENTRENADOR Y VESTUARIO</h2>
          
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "10px", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", marginBottom: "4px" }}>
              Estado actual con el Entrenador:
            </div>
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>
              Confianza: <strong style={{ color: "var(--gold)" }}>{activeSeason.coachTrust}/100</strong> · Rol en plantilla: <strong style={{ color: "#34d399" }}>{activeSeason.squadRole}</strong>
            </div>
            <p style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "8px", fontStyle: "italic" }}>
              "{activeSeason.coachTrust > 75 
                ? "El mister está encantado con tu rendimiento y considera que eres una pieza clave del equipo." 
                : (activeSeason.coachTrust > 50 
                  ? "Tienes la confianza suficiente para sumar minutos, pero no te descuides en los entrenamientos."
                  : "Debes esforzarte más para ganarte un puesto entre los titulares.")}"
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={handleTalkToCoach}>
              💬 Mantener reunión con el Míster
            </button>
            <button className="btn btn-secondary" onClick={handleAskStarterRole}>
              🙋 Solicitud formal de titularidad
            </button>
            <button className="btn btn-secondary" onClick={onOpenPressModal}>
              🎤 Atender a la Prensa
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: CLASIFICACIÓN & GOLEADORES */}
      {activeTab === "standings" && (
        <div className="card">
          <h2 style={{ fontSize: "18px", margin: "0 0 12px", color: "var(--gold)" }}>🏆 CLASIFICACIÓN DE LIGA Y PICHICHI</h2>

          {/* Standings Table */}
          <div style={{ overflowX: "auto", marginBottom: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--muted)" }}>
                  <th style={{ padding: "8px" }}>Pos</th>
                  <th style={{ padding: "8px" }}>Equipo</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>PJ</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>PG</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>PE</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>PP</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>DG</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {activeSeason.standings.map(s => (
                  <tr 
                    key={s.team}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: s.isUser ? "rgba(232, 184, 75, 0.15)" : "transparent",
                      fontWeight: s.isUser ? "bold" : "normal"
                    }}
                  >
                    <td style={{ padding: "8px" }}>{s.rank}</td>
                    <td style={{ padding: "8px", color: s.isUser ? "var(--gold)" : "#fff" }}>
                      {s.team} {s.isUser && "(Tu Club)"}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{s.played}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{s.won}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{s.drawn}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{s.lost}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{s.gf - s.ga}</td>
                    <td style={{ padding: "8px", textAlign: "center", color: "var(--gold)", fontWeight: "bold" }}>{s.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pichichi Leaderboard */}
          <h3 style={{ fontSize: "15px", margin: "16px 0 8px", color: "var(--accent)" }}>⚽ Tabla de Máximos Goleadores (Pichichi)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {activeSeason.topScorers.slice(0, 5).map((sc, idx) => (
              <div 
                key={sc.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: sc.isUser ? "rgba(52, 211, 153, 0.12)" : "rgba(255,255,255,0.02)",
                  borderRadius: "6px",
                  fontSize: "12px"
                }}
              >
                <span>
                  <strong>#{idx + 1} {sc.name}</strong> ({sc.club}) {sc.isUser && "⭐"}
                </span>
                <span className="mono" style={{ color: "var(--gold)", fontWeight: "bold" }}>
                  ⚽ {sc.goals} goles ({sc.assists} asist)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: OBJETIVOS */}
      {activeTab === "objectives" && (
        <div className="card">
          <h2 style={{ fontSize: "18px", margin: "0 0 12px", color: "var(--gold)" }}>🎯 OBJETIVOS DE LA TEMPORADA</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeSeason.objectives.map(obj => {
              const pct = clamp(Math.round((obj.current / obj.target) * 100), 0, 100);
              return (
                <div key={obj.id} style={{ background: "rgba(0,0,0,0.25)", padding: "12px 16px", borderRadius: "10px", border: obj.completed ? "1px solid #34d399" : "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "13px", color: obj.completed ? "#34d399" : "#fff" }}>
                      {obj.completed ? "✅ " : "🎯 "}{obj.title}
                    </span>
                    <span className="mono" style={{ fontSize: "12px", color: "var(--gold)" }}>
                      {obj.current} / {obj.target}
                    </span>
                  </div>
                  <div className="bar" style={{ height: "6px" }}>
                    <div className="bar-fill" style={{ width: `${pct}%`, background: obj.completed ? "#34d399" : "var(--accent)" }}></div>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "6px" }}>
                    Recompensa: {obj.rewardText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: ATRIBUTOS */}
      {activeTab === "attributes" && (
        <div className="card">
          <h2 style={{ fontSize: "18px", margin: "0 0 12px", color: "var(--gold)" }}>📈 ATRIBUTOS TÉCNICOS Y FÍSICOS</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { key: "velocidad", label: "⚡ Velocidad" },
              { key: "tiro", label: "⚽ Tiro" },
              { key: "regate", label: "🪄 Regate" },
              { key: "pase", label: "🎯 Pase" },
              { key: "defensa", label: "🛡️ Defensa" },
              { key: "fisico", label: "💪 Físico" },
              { key: "resistencia", label: "🫁 Resistencia" },
              { key: "tecnica", label: "✨ Técnica" }
            ].map(att => {
              const val = activeSeason.attributes[att.key as keyof PlayerAttributes];
              const xp = activeSeason.attributeXP[att.key as keyof PlayerAttributes] || 0;
              return (
                <div key={att.key} style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: "#fff" }}>{att.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--gold)" }}>{val} PTS</span>
                  </div>
                  <div className="bar" style={{ height: "4px" }}>
                    <div className="bar-fill" style={{ width: `${xp}%`, background: "var(--accent)" }}></div>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px", textAlign: "right" }}>
                    XP: {xp}/100
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Match Modal */}
      {activeMatchModalFixture && (
        <MatchKeyMomentsModal
          fixture={activeMatchModalFixture}
          playerName={p.name}
          userClub={p.club}
          position={p.position}
          attributes={activeSeason.attributes}
          energy={activeSeason.energy}
          moments={generateMatchKeyMoments(p, activeMatchModalFixture, activeSeason.attributes, activeSeason.squadRole)}
          onCompleteMatch={handleCompleteInteractiveMatch}
        />
      )}

      {/* Decision Modals: Boots & Sponsorship Promos */}
      {showBootsModal && (
        <BootsAndPromoModal
          playerMoney={p.money}
          onBuyBoots={handleBuyBoots}
          onDoPromo={handleDoPromo}
          onSkipDecisions={() => setShowBootsModal(false)}
        />
      )}

      {/* Decision Modals: Cup Finals */}
      {showCupFinalModal && currentFixture && (
        <CupFinalModal
          finalTitle={currentFixture.competition + " - " + currentFixture.jornadaName}
          opponent={currentFixture.opponent}
          userClub={p.club}
          onPlayFinal={() => {
            setShowCupFinalModal(false);
            setActiveMatchModalFixture(currentFixture);
          }}
          onRestAndSimulate={() => {
            setShowCupFinalModal(false);
            handleSimulateMatch();
          }}
        />
      )}
    </div>
  );
};
