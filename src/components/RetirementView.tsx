import React from "react";
import appIconImg from "../assets/images/footcarrer_app_icon_1786368472328.jpg";
import { CareerState } from "../types";
import { 
  POS_NAMES, 
  MASTER_TROPHIES, 
  RATING_TIERS, 
  fmtMoney, 
  fmtSalary 
} from "../data/clubsAndLeagues";

interface RetirementViewProps {
  state: CareerState;
  onNewCareer: () => void;
  onLogout: () => void;
}

function getTrophyDisplayName(name: string): string {
  const map: Record<string, string> = {
    "La Liga": "Campeón de LaLiga Española",
    "Premier League": "Campeón de Premier League",
    "Serie A": "Campeón de Serie A",
    "Bundesliga": "Campeón de Bundesliga",
    "Ligue 1": "Campeón de Ligue 1",
    "Champions League": "Campeón de Champions League",
    "Europa League": "Campeón de Europa League",
    "Conference League": "Campeón de Conference League",
    "Mundial de Clubes": "Campeón del Mundial de Clubes",
    "Mundial": "Campeón del Mundial de Selecciones",
    "Eurocopa": "Campeón de la Eurocopa",
    "Copa América": "Campeón de la Copa América",
    "Copa del Rey": "Campeón de la Copa del Rey",
    "FA Cup": "Campeón de la FA Cup",
    "Coppa Italia": "Campeón de la Coppa Italia",
    "DFB-Pokal": "Campeón de la DFB-Pokal",
    "Coupe de France": "Campeón de la Coupe de France",
    "Supercopa": "Campeón de Supercopa",
    "Balón de Oro": "Balón de Oro",
    "Bota de Oro": "Bota de Oro",
  };
  return map[name] || `Campeón de ${name}`;
}

export const RetirementView: React.FC<RetirementViewProps> = ({
  state,
  onNewCareer,
  onLogout,
}) => {
  const p = state.player;
  const years = p.season - 1;
  const rating =
    RATING_TIERS.find((r) => p.score >= r.min) ||
    RATING_TIERS[RATING_TIERS.length - 1];

  const peakOvr = Math.max(p.maxLevel || 0, Math.round(p.level), p.bestSeason?.peakLevelInSeason || 0);

  const dynamicExtra = Object.keys(p.trophiesList).filter(
    (n) => !MASTER_TROPHIES.some((m) => m.name === n)
  );
  const palmaresList = MASTER_TROPHIES.concat(
    dynamicExtra.map((n) => ({ name: n, icon: "🏆" }))
  );

  return (
    <div>
      <div className="top-nav">
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img 
            src={appIconImg} 
            alt="Logo" 
            style={{ width: "28px", height: "28px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--gold)" }} 
          />
          FOOTCARRER<span>.</span>
        </div>
        <button className="btn btn-ghost" onClick={onLogout} style={{ padding: "8px 14px", fontSize: "12px" }}>
          Cerrar sesión
        </button>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <div className="modal-emoji">🏟️</div>
        <div className="eyebrow">El final de una leyenda</div>
        <div className="final-title">TU CARRERA</div>
        <p style={{ color: "var(--muted)" }}>
          {p.name} cuelga las botas tras {years} temporadas de carrera profesional.
        </p>
        <div className="rating-tag">{rating.label}</div>
      </div>

      {/* SECCIÓN PRIME DESTACADA */}
      <div className="card" style={{
        background: "linear-gradient(135deg, rgba(232,184,75,0.12) 0%, rgba(20,24,33,0.95) 100%)",
        border: "1.5px solid var(--gold)",
        boxShadow: "0 8px 32px rgba(232, 184, 75, 0.15)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "8px"
        }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--gold)", fontWeight: 800 }}>🔥 MOMENTO CUMBRE</div>
            <h2 style={{ margin: "2px 0 0", fontSize: "22px", color: "#ffffff" }}>TU ÉPOCA PRIME</h2>
          </div>
          <div style={{
            background: "var(--gold)",
            color: "#000000",
            padding: "6px 14px",
            borderRadius: "20px",
            fontWeight: 900,
            fontSize: "15px",
            letterSpacing: "0.02em",
            boxShadow: "0 2px 10px rgba(232, 184, 75, 0.4)"
          }}>
            ⚡ {peakOvr} MEDIA PRIME
          </div>
        </div>

        {p.bestSeason ? (
          <div className="best-season-card" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(232, 184, 75, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="eyebrow" style={{ color: "var(--gold)" }}>Temporada Prime · {p.bestSeason.label}</div>
              {p.bestSeason.avgRating && (
                <div style={{ fontSize: "12px", color: "var(--gold)", fontWeight: 700 }}>
                  Nota Media: {p.bestSeason.avgRating}
                </div>
              )}
            </div>
            <h3 style={{ margin: "6px 0 10px", fontSize: "20px" }}>{p.bestSeason.club}</h3>
            
            <div className="stat-row">
              <div className="stat-box">
                <div className="v">{p.bestSeason.matches}</div>
                <div className="l">Partidos</div>
              </div>
              <div className="stat-box">
                <div className="v" style={{ color: "var(--gold)" }}>{p.bestSeason.goals}</div>
                <div className="l">Goles</div>
              </div>
              <div className="stat-box">
                <div className="v">{p.bestSeason.assists}</div>
                <div className="l">Asistencias</div>
              </div>
            </div>

            {p.bestSeason.titles.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
                  Títulos en tu Prime:
                </div>
                <div className="trophy-row">
                  {p.bestSeason.titles.map((t, idx) => (
                    <div key={idx} className="trophy" style={{ background: "rgba(232,184,75,0.15)", borderColor: "var(--gold)", color: "#ffffff" }}>
                      🏆 {getTrophyDisplayName(t)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.bestSeason.awards.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
                  Premios Individuales en tu Prime:
                </div>
                <div className="trophy-row">
                  {p.bestSeason.awards.map((a, idx) => (
                    <div key={idx} className="trophy" style={{ background: "rgba(232,184,75,0.25)", borderColor: "var(--gold)", color: "var(--gold)", fontWeight: 800 }}>
                      ⭐ {a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Nivel Prime alcanzado: {peakOvr} OVR</p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "14px" }}>Perfil final</h3>
        <div className="stat-row">
          <div className="stat-box">
            <div className="v">{p.age}</div>
            <div className="l">Edad de retirada</div>
          </div>
          <div className="stat-box">
            <div className="v">{POS_NAMES[p.position]}</div>
            <div className="l">Posición</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.nationality}</div>
            <div className="l">País</div>
          </div>
          <div className="stat-box">
            <div className="v" style={{ color: "var(--gold)" }}>{peakOvr}</div>
            <div className="l">Nivel Prime Máximo</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "14px" }}>Carrera</h3>
        <div className="stat-row">
          <div className="stat-box">
            <div className="v">{years}</div>
            <div className="l">Años de carrera</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.debutAge}</div>
            <div className="l">Edad de debut</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.clubsHistory[0]}</div>
            <div className="l">Club de debut</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.club}</div>
            <div className="l">Último club</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.clubsHistory.length}</div>
            <div className="l">Número de clubes</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.season - 1}</div>
            <div className="l">Temporadas</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "14px" }}>Estadísticas totales</h3>
        <div className="stat-row">
          <div className="stat-box">
            <div className="v">{p.matches}</div>
            <div className="l">Partidos</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.goals}</div>
            <div className="l">Goles</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.assists}</div>
            <div className="l">Asistencias</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.caps}</div>
            <div className="l">Internacionalidades</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "4px" }}>🏆 Palmarés Histórico</h3>
        <p style={{ color: "var(--muted)", fontSize: "12.5px", marginBottom: "12px" }}>
          Todos los títulos conseguidos a lo largo de tu carrera profesional.
        </p>
        <div className="palmares-grid">
          {palmaresList.map((t) => {
            const count =
              t.name === "Balón de Oro"
                ? p.ballonsDor
                : t.name === "Bota de Oro"
                ? p.goldenBoots
                : p.trophiesList[t.name] || 0;
            const locked = count <= 0;
            const displayName = getTrophyDisplayName(t.name);
            return (
              <div key={t.name} className={`palmares-item ${locked ? "locked" : ""}`}>
                {count > 0 && <div className="pi-count">×{count}</div>}
                <div className="pi-icon">{locked ? "🔒" : t.icon}</div>
                <div className="pi-name">{displayName}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "14px" }}>Dinero</h3>
        <div className="stat-row">
          <div className="stat-box">
            <div className="v">{fmtMoney(p.totalMoneyEarned)}</div>
            <div className="l">Dinero total ganado</div>
          </div>
          <div className="stat-box">
            <div className="v">{fmtSalary(p.maxSalary)}</div>
            <div className="l">Mayor salario</div>
          </div>
          <div className="stat-box">
            <div className="v">{fmtMoney(p.maxMarketValue)}</div>
            <div className="l">Mayor valor de mercado</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "6px" }}>Línea temporal de la carrera</h3>
        <div className="timeline">
          {p.timeline.map((ev, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-age">{ev.age} años</div>
              <div className="timeline-text">{ev.text}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={onNewCareer} style={{ marginTop: "6px" }}>
        EMPEZAR NUEVA CARRERA
      </button>
    </div>
  );
};
