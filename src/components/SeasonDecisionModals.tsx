import React from "react";
import { fmtMoney } from "../data/clubsAndLeagues";

interface TrainingQuestionModalProps {
  seasonYear: number;
  clubName: string;
  onSelectOption: (choice: "intensive" | "tactical" | "rest") => void;
}

export const TrainingQuestionModal: React.FC<TrainingQuestionModalProps> = ({
  seasonYear,
  clubName,
  onSelectOption
}) => {
  return (
    <div className="modal-overlay" style={{ background: "rgba(0, 0, 0, 0.88)", backdropFilter: "blur(6px)", zIndex: 9999 }}>
      <div className="modal-card" style={{ maxWidth: "540px", width: "92%", border: "2px solid var(--gold)", textAlign: "center" }}>
        
        <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: "6px" }}>
          🏋️ GESTIÓN DE ENTRENAMIENTO · TEMPORADA {seasonYear}
        </div>
        
        <h2 style={{ fontSize: "22px", margin: "4px 0 12px", color: "#fff" }}>
          ¿Cómo deseas preparar la pretemporada en {clubName}?
        </h2>

        <div style={{ 
          background: "rgba(255, 255, 255, 0.04)", 
          borderRadius: "10px", 
          padding: "14px", 
          marginBottom: "18px", 
          textAlign: "left",
          fontSize: "13px",
          color: "#cbd5e1",
          lineHeight: "1.5"
        }}>
          <div><strong>• 🏋️ Entrenamiento Intensivo:</strong> Alta exigencia. Azar de progreso estelar (60% de +1.5 a +2.0 OVR) o sobrecarga/molestias (40% de -0.5 a -1.0 OVR).</div>
          <div style={{ marginTop: "6px" }}><strong>• 🧠 Entrenamiento Táctico:</strong> Plan moderado y seguro (+0.8 OVR garantizado + Confianza del cuerpo técnico).</div>
          <div style={{ marginTop: "6px" }}><strong>• 😴 Descanso Total:</strong> Descanso fisioterapéutico. 100% frescura física, previene lesiones en los partidos simulados.</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            className="btn btn-primary"
            onClick={() => onSelectOption("intensive")}
            style={{ padding: "14px", fontSize: "14px", fontWeight: "bold" }}
          >
            🏋️ ENTRENAMIENTO INTENSIVO (Riesgo: 🎲 Subir o perder OVR)
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => onSelectOption("tactical")}
            style={{ padding: "14px", fontSize: "14px" }}
          >
            🧠 ENTRENAMIENTO TÁCTICO (+0.8 OVR seguro)
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => onSelectOption("rest")}
            style={{ padding: "14px", fontSize: "14px", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)" }}
          >
            😴 DESCANSO Y FISIOTERAPIA (Máxima frescura y prevención)
          </button>
        </div>

      </div>
    </div>
  );
};

interface BootsAndPromoModalProps {
  playerMoney: number;
  onBuyBoots: (bootType: "speed" | "shoot" | "tech", cost: number) => void;
  onDoPromo: (promoType: "sponsorship" | "social") => void;
  onSkipDecisions: () => void;
}

export const BootsAndPromoModal: React.FC<BootsAndPromoModalProps> = ({
  playerMoney,
  onBuyBoots,
  onDoPromo,
  onSkipDecisions
}) => {
  return (
    <div className="modal-overlay" style={{ background: "rgba(0, 0, 0, 0.88)", backdropFilter: "blur(6px)", zIndex: 9999 }}>
      <div className="modal-card" style={{ maxWidth: "560px", width: "94%", border: "1px solid var(--accent)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div className="eyebrow" style={{ color: "var(--accent)" }}>👟 PATROCINIOS Y EQUIPACIÓN PROFESIONAL</div>
          <h2 style={{ fontSize: "22px", margin: "4px 0", color: "#fff" }}>
            Decisiones de Marca, Botas y Promociones
          </h2>
          <div style={{ fontSize: "13px", color: "var(--gold)" }}>
            Saldo Disponible: <strong>{fmtMoney(playerMoney)}</strong>
          </div>
        </div>

        {/* Sección Botas */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
            ⚽ Comprar Botas de Alta Gama:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px" }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => onBuyBoots("speed", 35000)}
              disabled={playerMoney < 35000}
              style={{ padding: "10px", fontSize: "12px", textAlign: "left", opacity: playerMoney < 35000 ? 0.5 : 1 }}
            >
              <div style={{ fontWeight: "bold", color: "var(--gold)" }}>⚡ Botas Velocidad</div>
              <div>+2 Velocidad / Regate</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>{fmtMoney(35000)}</div>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => onBuyBoots("shoot", 45000)}
              disabled={playerMoney < 45000}
              style={{ padding: "10px", fontSize: "12px", textAlign: "left", opacity: playerMoney < 45000 ? 0.5 : 1 }}
            >
              <div style={{ fontWeight: "bold", color: "var(--gold)" }}>⚽ Botas Potencia Tiro</div>
              <div>+2 Tiro / Finalización</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>{fmtMoney(45000)}</div>
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => onBuyBoots("tech", 50000)}
              disabled={playerMoney < 50000}
              style={{ padding: "10px", fontSize: "12px", textAlign: "left", opacity: playerMoney < 50000 ? 0.5 : 1 }}
            >
              <div style={{ fontWeight: "bold", color: "var(--gold)" }}>🪄 Botas Control Élite</div>
              <div>+2 Pase / Visión</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>{fmtMoney(50000)}</div>
            </button>
          </div>
        </div>

        {/* Sección Promos / Patrocinios */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
            📢 Campañas Publicitarias y Promos:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <button 
              className="btn btn-ghost" 
              onClick={() => onDoPromo("sponsorship")}
              style={{ padding: "10px", fontSize: "12px", textAlign: "left", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <div style={{ fontWeight: "bold", color: "#34d399" }}>📸 Anuncio TV Marca Deportiva</div>
              <div>+€80.000 Dinero | -10% Cansancio/Descanso</div>
            </button>

            <button 
              className="btn btn-ghost" 
              onClick={() => onDoPromo("social")}
              style={{ padding: "10px", fontSize: "12px", textAlign: "left", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <div style={{ fontWeight: "bold", color: "#60a5fa" }}>📲 Campaña Redes Sociales</div>
              <div>+€45.000 Dinero | +Popularidad/Moral</div>
            </button>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={onSkipDecisions} 
          style={{ width: "100%", padding: "12px", fontSize: "13px", fontWeight: "bold" }}
        >
          ✅ CONTINUAR A LA TEMPORADA
        </button>

      </div>
    </div>
  );
};

interface CupFinalModalProps {
  finalTitle: string;
  opponent: string;
  userClub: string;
  onSelectOption: (choice: "starter" | "bench" | "rest") => void;
}

export const CupFinalModal: React.FC<CupFinalModalProps> = ({
  finalTitle,
  opponent,
  userClub,
  onSelectOption
}) => {
  return (
    <div className="modal-overlay" style={{ background: "rgba(0, 0, 0, 0.9)", backdropFilter: "blur(8px)", zIndex: 9999 }}>
      <div className="modal-card" style={{ maxWidth: "540px", width: "94%", border: "2px solid var(--gold)", textAlign: "center" }}>
        
        <div style={{ fontSize: "42px", marginBottom: "8px" }}>🏆</div>

        <div className="eyebrow" style={{ color: "var(--accent)", letterSpacing: "1.5px" }}>
          ¡GRAN FINAL DE COPA Y TÍTULOS DE LA TEMPORADA!
        </div>

        <h2 style={{ fontSize: "24px", margin: "6px 0 12px", color: "#fff" }}>
          GRAN FINAL DE {finalTitle.toUpperCase()}
        </h2>

        <div style={{ 
          background: "rgba(255, 255, 255, 0.05)", 
          borderRadius: "12px", 
          padding: "14px", 
          marginBottom: "20px", 
          border: "1px solid rgba(255, 255, 255, 0.1)" 
        }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--gold)" }}>
            {userClub} VS {opponent}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>
            Se decide el gran título del año. ¿Qué rol asumes en el partido simulado?
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            className="btn btn-primary"
            onClick={() => onSelectOption("starter")}
            style={{ 
              padding: "14px", 
              fontSize: "14px", 
              fontWeight: "bold",
              background: "linear-gradient(135deg, #e8b84b 0%, #d49f2b 100%)",
              boxShadow: "0 6px 20px rgba(232, 184, 75, 0.3)"
            }}
          >
            🟢 JUGAR DE TITULAR (+Probabilidad de título y de marcar gol)
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => onSelectOption("bench")}
            style={{ padding: "14px", fontSize: "14px" }}
          >
            🔵 ENTRAR COMO REVULSIVO (2ª Parte · Frescura y equilibrio)
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => onSelectOption("rest")}
            style={{ padding: "14px", fontSize: "13px", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)" }}
          >
            😴 DESCANSAR Y NO SER TITULAR (Evita sobrecarga, pero menor protagonismo)
          </button>
        </div>

      </div>
    </div>
  );
};

import { CareerDecisionEvent, CareerEventOption, ActiveSeasonState, Player } from "../types";

interface InteractiveDecisionCardProps {
  event: CareerDecisionEvent;
  activeSeason: ActiveSeasonState;
  player: Player;
  onSelectOption: (option: CareerEventOption) => void;
}

export const InteractiveDecisionCard: React.FC<InteractiveDecisionCardProps> = ({
  event,
  activeSeason,
  player,
  onSelectOption
}) => {
  return (
    <div className="card" style={{ 
      border: "2px solid var(--gold)", 
      background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)", 
      padding: "22px", 
      marginBottom: "20px",
      borderRadius: "16px",
      boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>{event.speakerIcon}</span>
          <div>
            <div className="eyebrow" style={{ color: "var(--gold)", margin: 0, fontSize: "12px" }}>
              {event.speakerTitle}
            </div>
            <h3 style={{ fontSize: "18px", color: "#fff", margin: 0 }}>
              {event.title}
            </h3>
          </div>
        </div>
        <span className="badge" style={{ background: "var(--accent)", color: "#000", fontWeight: "bold" }}>
          {event.category}
        </span>
      </div>

      {event.contextInfo && (
        <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>
          ℹ️ {event.contextInfo}
        </div>
      )}

      {/* Quote bubble */}
      <div style={{
        background: "rgba(0,0,0,0.4)",
        borderLeft: "4px solid var(--gold)",
        padding: "14px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        color: "#e2e8f0",
        fontStyle: "italic",
        lineHeight: "1.5"
      }}>
        {event.quote}
      </div>

      {/* Options list */}
      <div style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "10px" }}>
        ¿Qué decisión tomas al respecto?
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        {event.options.map((opt) => (
          <button
            key={opt.id}
            className="btn btn-secondary"
            onClick={() => onSelectOption(opt)}
            style={{
              padding: "14px 16px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>
                {opt.text}
              </span>
              <span className="badge" style={{ background: "rgba(232, 184, 75, 0.2)", color: "var(--gold)", fontSize: "11px" }}>
                {opt.badgeText}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              {opt.detail}
            </div>
            <div style={{ fontSize: "11px", color: "#34d399", marginTop: "2px", fontWeight: "bold" }}>
              ⚡ Consecuencia probable: {opt.effectText}
            </div>
          </button>
        ))}
      </div>

      {/* Current Player Status Bar */}
      <div style={{
        background: "rgba(0,0,0,0.3)",
        borderRadius: "10px",
        padding: "10px 14px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: "8px",
        fontSize: "11px",
        border: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div>❤️ Energía: <b style={{ color: "#34d399" }}>{activeSeason.energy}%</b></div>
        <div>⚡ Fatiga: <b style={{ color: "#60a5fa" }}>{activeSeason.fatigue}%</b></div>
        <div>👔 Confianza: <b style={{ color: "var(--gold)" }}>{activeSeason.coachTrust}%</b></div>
        <div>👥 Vestuario: <b style={{ color: "#a7f3d0" }}>{activeSeason.lockerRoomRel}%</b></div>
        <div>⭐ Reputación: <b style={{ color: "#c084fc" }}>{activeSeason.reputation}%</b></div>
      </div>
    </div>
  );
};

