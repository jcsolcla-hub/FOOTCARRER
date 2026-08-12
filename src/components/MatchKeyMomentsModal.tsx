import React, { useState } from "react";
import { 
  SeasonMatchFixture, 
  PlayerAttributes, 
  MatchKeyMoment, 
  MatchEventChoice, 
  SeasonMatchResult,
  PositionKey 
} from "../types";
import { randInt, clamp } from "../data/clubsAndLeagues";

interface MatchKeyMomentsModalProps {
  fixture: SeasonMatchFixture;
  playerName: string;
  userClub: string;
  position: PositionKey;
  attributes: PlayerAttributes;
  energy: number;
  moments: MatchKeyMoment[];
  onCompleteMatch: (result: SeasonMatchResult) => void;
}

export const MatchKeyMomentsModal: React.FC<MatchKeyMomentsModalProps> = ({
  fixture,
  playerName,
  userClub,
  position,
  attributes,
  energy,
  moments,
  onCompleteMatch
}) => {
  const [currentMomentIdx, setCurrentMomentIdx] = useState<number>(0);
  const [matchLogs, setMatchLogs] = useState<string[]>([]);
  const [playerGoals, setPlayerGoals] = useState<number>(0);
  const [playerAssists, setPlayerAssists] = useState<number>(0);
  const [ratingBonus, setRatingBonus] = useState<number>(6.5);
  const [matchFinished, setMatchFinished] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<SeasonMatchResult | null>(null);

  const currentMoment = moments[currentMomentIdx];

  const handleChoiceSelect = (choice: MatchEventChoice) => {
    let statVal = 50;
    if (choice.statReq === "energy") {
      statVal = energy;
    } else if (choice.statReq && attributes[choice.statReq] !== undefined) {
      statVal = attributes[choice.statReq];
    }

    // Energy influence
    const energyBonus = (energy - 50) * 0.2;
    const effectiveStat = statVal + energyBonus;
    const minReq = choice.minStatVal || 60;

    const successChance = clamp(0.45 + (effectiveStat - minReq) * 0.02, 0.20, 0.90);
    const isSuccess = Math.random() < successChance;

    const outcome = isSuccess ? choice.outcomeSuccess : choice.outcomeFail;

    const newGoals = playerGoals + outcome.goalDelta;
    const newAssists = playerAssists + outcome.assistDelta;
    const newRating = clamp(ratingBonus + outcome.ratingDelta, 5.0, 10.0);

    setPlayerGoals(newGoals);
    setPlayerAssists(newAssists);
    setRatingBonus(newRating);

    setMatchLogs(prev => [
      ...prev,
      `[Min. ${currentMoment.minute}'] ${outcome.text}`
    ]);

    if (currentMomentIdx + 1 < moments.length) {
      setCurrentMomentIdx(prev => prev + 1);
    } else {
      // Calculate final match score
      let homeG = 0;
      let awayG = 0;

      const teamScoreBonus = newGoals + newAssists;
      if (fixture.isHome) {
        homeG = Math.max(newGoals, randInt(1, 3) + (teamScoreBonus > 0 ? 1 : 0));
        awayG = randInt(0, 2);
      } else {
        awayG = Math.max(newGoals, randInt(1, 3) + (teamScoreBonus > 0 ? 1 : 0));
        homeG = randInt(0, 2);
      }

      const res: SeasonMatchResult = {
        homeGoals: homeG,
        awayGoals: awayG,
        playerGoals: newGoals,
        playerAssists: newAssists,
        playerRating: Math.round(newRating * 10) / 10,
        playerMinutes: randInt(78, 90),
        wasSimulated: false,
        matchHighlights: [
          `Resultado Final: ${fixture.isHome ? userClub : fixture.opponent} ${homeG} - ${awayG} ${fixture.isHome ? fixture.opponent : userClub}`,
          `Tus estadísticas: ${newGoals} gol(es), ${newAssists} asistencia(s) · Nota: ${(Math.round(newRating * 10) / 10)}/10`
        ]
      };

      setFinalResult(res);
      setMatchFinished(true);
    }
  };

  return (
    <div className="modal-overlay" style={{ background: "rgba(0, 0, 0, 0.88)", backdropFilter: "blur(8px)" }}>
      <div className="modal-card" style={{ maxWidth: "620px", width: "94%", border: "1px solid var(--gold)" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
          <div className="eyebrow" style={{ color: "var(--gold)" }}>
            ⚽ {fixture.competition} · {fixture.jornadaName}
          </div>
          <h2 style={{ fontSize: "22px", margin: "4px 0", color: "#fff" }}>
            {fixture.isHome ? `${userClub} vs ${fixture.opponent}` : `${fixture.opponent} vs ${userClub}`}
          </h2>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>
            {fixture.isHome ? "🏟️ Estadio Local" : "✈️ Partido Visitante"} · Importancia: <strong style={{ color: "var(--gold)" }}>{fixture.importance}</strong>
          </div>
        </div>

        {/* Live Match Moment State */}
        {!matchFinished && currentMoment && (
          <div>
            <div style={{ 
              background: "rgba(255, 255, 255, 0.04)", 
              borderRadius: "12px", 
              padding: "16px", 
              marginBottom: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="mono" style={{ background: "var(--accent)", color: "#000", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "13px" }}>
                  Minuto {currentMoment.minute}'
                </span>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  Momento {currentMomentIdx + 1} de {moments.length}
                </span>
              </div>
              <h3 style={{ fontSize: "16px", margin: "0 0 6px", color: "#fff" }}>
                {currentMoment.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#ddd", lineHeight: "1.5", margin: 0 }}>
                {currentMoment.description}
              </p>
            </div>

            {/* Current Match Live Ticker */}
            {matchLogs.length > 0 && (
              <div style={{ 
                background: "#0d131a", 
                borderRadius: "8px", 
                padding: "10px 14px", 
                marginBottom: "16px", 
                maxHeight: "100px", 
                overflowY: "auto",
                borderLeft: "3px solid var(--accent)",
                fontSize: "12px",
                color: "#83a0bd"
              }}>
                {matchLogs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: "4px" }}>{log}</div>
                ))}
              </div>
            )}

            {/* Decision Choices */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--gold)", textTransform: "uppercase" }}>
                ¿Qué decisión tomas en esta jugada?
              </div>
              {currentMoment.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className="btn btn-secondary"
                  onClick={() => handleChoiceSelect(choice)}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    transition: "all 0.2s"
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>
                    {choice.text}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                    Atributo clave: <strong style={{ color: "var(--accent)", textTransform: "capitalize" }}>{choice.statReq}</strong> ({attributes[choice.statReq as keyof PlayerAttributes] || energy} PTS)
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Post Match Summary */}
        {matchFinished && finalResult && (
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              background: "linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))", 
              borderRadius: "16px", 
              padding: "20px", 
              marginBottom: "20px",
              border: "1px solid var(--gold)"
            }}>
              <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: "4px" }}>PARTIDO FINALIZADO</div>
              <h1 style={{ fontSize: "36px", margin: "4px 0 12px", letterSpacing: "2px", color: "#fff" }}>
                {finalResult.homeGoals} - {finalResult.awayGoals}
              </h1>
              <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "16px" }}>
                {fixture.isHome ? `${userClub} vs ${fixture.opponent}` : `${fixture.opponent} vs ${userClub}`}
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "10px", 
                background: "rgba(0, 0, 0, 0.3)", 
                padding: "12px", 
                borderRadius: "10px" 
              }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--gold)" }}>⚽ {finalResult.playerGoals}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>Goles</div>
                </div>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--accent)" }}>🎯 {finalResult.playerAssists}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>Asistencias</div>
                </div>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#34d399" }}>⭐ {finalResult.playerRating}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>Nota Partido</div>
                </div>
              </div>
            </div>

            <div style={{ 
              textAlign: "left", 
              background: "#0d131a", 
              borderRadius: "10px", 
              padding: "12px 16px", 
              marginBottom: "20px",
              fontSize: "12px",
              lineHeight: "1.6",
              color: "#cbd5e1"
            }}>
              <strong style={{ color: "var(--gold)", display: "block", marginBottom: "6px" }}>
                📋 Resumen de momentos decisivos:
              </strong>
              {matchLogs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: "4px" }}>• {log}</div>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => onCompleteMatch(finalResult)}
              style={{ width: "100%", padding: "14px", fontSize: "15px", fontWeight: "bold" }}
            >
              🏆 CONTINUAR Y REGISTRAR ESTADÍSTICAS
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
