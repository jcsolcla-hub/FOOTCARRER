import React from "react";
import appIconImg from "../assets/images/footcarrer_app_icon_1786368472328.jpg";
import { User } from "firebase/auth";
import { CareerState } from "../types";
import { 
  POS_NAMES, 
  MASTER_TROPHIES, 
  fmtMoney, 
  fmtSalary, 
  clamp 
} from "../data/clubsAndLeagues";
import { TrophySvg } from "./TrophySvg";

interface DashboardViewProps {
  currentUser: User | null;
  state: CareerState;
  onPlaySeason: () => void;
  onRetirePlayer?: () => void;
  onNewCareer: () => void;
  onLogout: () => void;
  onLinkAccount: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  state,
  onPlaySeason,
  onRetirePlayer,
  onNewCareer,
  onLogout,
  onLinkAccount,
}) => {
  const p = state.player;
  const yearLabel = `${p.seasonYearStart}/${(p.seasonYearStart + 1).toString().slice(2)}`;
  const potentialPct = clamp(Math.round((p.level / p.potential) * 100), 5, 100);
  const trophyEntries = Object.entries(p.trophiesList);

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
        <div className="btn-row" style={{ gap: "8px" }}>
          {currentUser && currentUser.isAnonymous && (
            <button className="btn btn-ghost" onClick={onLinkAccount} style={{ padding: "8px 14px", fontSize: "12px" }}>
              Vincular cuenta
            </button>
          )}
          <button className="btn btn-ghost" onClick={onNewCareer} style={{ padding: "8px 14px", fontSize: "12px" }}>
            Nueva carrera
          </button>
          <button className="btn btn-ghost" onClick={onLogout} style={{ padding: "8px 14px", fontSize: "12px" }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="player-card">
        <div className="player-top">
          <div>
            <div className="eyebrow">{yearLabel} · Temporada {p.season}</div>
            <div className="player-name">{p.name}</div>
            <div className="player-meta">
              {p.age} años · {POS_NAMES[p.position]} · {p.nationality}
              {p.sponsor && <span className="badge">{p.sponsor}</span>}
            </div>
            <div className="player-meta">{p.club}</div>
          </div>
          <div className="ovr-badge">
            <b>{Math.round(p.level)}</b>
            <span>OVR</span>
          </div>
        </div>

        <div className="bar">
          <div className="bar-fill" style={{ width: `${potentialPct}%` }}></div>
        </div>
        <div className="player-meta" style={{ marginTop: "4px" }}>
          Progreso hacia potencial ({Math.round(p.potential)} OVR)
        </div>

        <div className="stat-row">
          <div className="stat-box">
            <div className="v">{fmtMoney(p.marketValue)}</div>
            <div className="l">Valor de mercado</div>
          </div>
          <div className="stat-box">
            <div className="v">{fmtSalary(p.salary)}</div>
            <div className="l">Salario</div>
          </div>
          <div className="stat-box">
            <div className="v">{fmtMoney(p.money)}</div>
            <div className="l">Dinero acumulado</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.matches}</div>
            <div className="l">Partidos jugados</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.goals}</div>
            <div className="l">Goles totales</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.assists}</div>
            <div className="l">Asistencias</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.titles}</div>
            <div className="l">Títulos</div>
          </div>
          <div className="stat-box">
            <div className="v">{p.ballonsDor}</div>
            <div className="l">Balones de Oro</div>
          </div>
        </div>

        {trophyEntries.length > 0 && (
          <div className="trophy-row">
            {trophyEntries.map(([name, count]) => {
              const numCount = Number(count) || 0;
              return (
                <div key={name} className="trophy">
                  🏆 {name} {numCount > 1 ? `×${numCount}` : ""}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="season-btn-wrap" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <div className="season-num mono">Pulsa para simular la temporada {p.season}</div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", width: "100%", maxWidth: "500px" }}>
          <button className="btn btn-primary play-btn" onClick={onPlaySeason} style={{ flex: "1 1 200px" }}>
            ▶ JUGAR TEMPORADA
          </button>
          {p.age >= 35 && onRetirePlayer && (
            <button 
              className="btn" 
              onClick={onRetirePlayer}
              style={{ 
                background: "rgba(239, 68, 68, 0.15)", 
                border: "1px solid rgba(239, 68, 68, 0.35)", 
                color: "#f87171",
                fontWeight: 700,
                padding: "12px 18px",
                borderRadius: "12px",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              👴 RETIRARME ({p.age} AÑOS)
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "4px" }}>🏆 Mi Palmarés</h3>
        <p style={{ color: "var(--muted)", fontSize: "12.5px", marginBottom: "4px" }}>
          Los trofeos bloqueados aún no han sido conseguidos.
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
            return (
              <div key={t.name} className={`palmares-item ${locked ? "locked" : ""}`}>
                {count > 0 && <div className="pi-count">×{count}</div>}
                <div className="pi-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "54px" }}>
                  <TrophySvg 
                    name={t.name} 
                    size={locked ? 42 : 50} 
                    colorMain={locked ? "#55635c" : undefined}
                    colorLight={locked ? "#85948c" : undefined}
                  />
                </div>
                <div className="pi-name">{t.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {p.log.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: "10px" }}>Historial de carrera</h3>
          <div className="career-log">
            {p.log
              .slice()
              .reverse()
              .map((entry, i) => (
                <div key={i} className="event-line">
                  <div className="event-icon">📋</div>
                  <div>
                    <b>{entry.title}</b>
                    <br />
                    <span style={{ color: "var(--muted)" }}>{entry.text}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
