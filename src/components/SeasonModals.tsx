import React, { useState } from "react";
import { 
  SeasonSummary, 
  Tournament, 
  GroupResult, 
  PlayerMatch, 
  Offer,
  PressQuestion,
  PressOption
} from "../types";
import { flagOf, fmtMoney, fmtSalary, POS_NAMES } from "../data/clubsAndLeagues";
import { GoogleLogo, AppleLogo } from "./SocialLogos";

export const LuckSpinnerModal: React.FC<{ phaseText?: string }> = ({ phaseText }) => (
  <div className="modal-backdrop" style={{ zIndex: 9000 }}>
    <div className="modal" style={{ textAlign: "center", maxWidth: "440px" }}>
      <div className="eyebrow" style={{ color: "var(--gold)", letterSpacing: "1px" }}>⚡ SIMULANDO TEMPORADA EN DIRECTO</div>
      <h2 style={{ marginTop: "8px", fontSize: "22px" }}>Avanzando Temporada…</h2>
      <div className="luck-spinner" style={{ margin: "20px auto" }}></div>
      <p style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 500, minHeight: "24px" }}>
        {phaseText || "Rodando partidos, eventos y decisiones de tu carrera."}
      </p>
    </div>
  </div>
);

interface CallUpModalProps {
  nationality: string;
  flag: string;
  tourName: string;
  onContinue: () => void;
}

export const CallUpModal: React.FC<CallUpModalProps> = ({
  nationality,
  flag,
  tourName,
  onContinue,
}) => (
  <div className="modal-backdrop">
    <div className="modal">
      <div className="eyebrow">Parón de selecciones</div>
      <div className="modal-emoji">{flag}</div>
      <h2>{nationality}</h2>
      <p>
        ¡Has sido convocado para representar a {nationality} en{" "}
        {tourName === "Mundial" ? "el" : "la"} {tourName}!
      </p>
      <button className="btn btn-primary btn-block" onClick={onContinue}>
        CONVOCATORIA ACEPTADA
      </button>
    </div>
  </div>
);

interface GroupStageModalProps {
  nationality: string;
  tourName: string;
  result: GroupResult;
  onContinue: () => void;
}

export const GroupStageModal: React.FC<GroupStageModalProps> = ({
  nationality,
  tourName,
  result,
  onContinue,
}) => {
  const roleIcon = (r: string) => (r === "titular" ? "🟢" : r === "suplente" ? "🟡" : "⚪");
  const roleLabel = (r: string) =>
    r === "titular" ? "Titular" : r === "suplente" ? "Suplente (entró al campo)" : "No participó";

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ textAlign: "left", maxWidth: "480px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow">Parón de selecciones · Fase de grupos</div>
          <h2>{flagOf(nationality)} {tourName}</h2>
        </div>
        <div className="group-table-wrap">
          <table className="group-table">
            <thead>
              <tr>
                <th>#</th>
                <th>País</th>
                <th>Pts</th>
                <th>PJ</th>
                <th>G</th>
                <th>E</th>
                <th>P</th>
                <th>DG</th>
              </tr>
            </thead>
            <tbody>
              {result.standings.map((s, i) => (
                <tr key={i} className={`${s.isPlayer ? "player-row" : ""} ${i < 2 ? "qualified-row" : ""}`}>
                  <td>{i + 1}</td>
                  <td>{flagOf(s.team)} {s.team}</td>
                  <td><b>{s.pts}</b></td>
                  <td>{s.w + s.d + s.l}</td>
                  <td>{s.w}</td>
                  <td>{s.d}</td>
                  <td>{s.l}</td>
                  <td>{(s.gf - s.ga) >= 0 ? "+" : ""}{s.gf - s.ga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 style={{ fontSize: "12.5px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "16px 0 8px" }}>
          Tus partidos de grupo
        </h3>
        {result.playerMatches.map((m, i) => (
          <div key={i} className="event-line">
            <div className="event-icon">{roleIcon(m.role)}</div>
            <div style={{ flex: 1 }}>
              <b>{flagOf(nationality)} {nationality} {m.gf}-{m.ga} {m.opp} {flagOf(m.opp)}</b>
              <br />
              <span style={{ color: "var(--muted)", fontSize: "12px" }}>{roleLabel(m.role)}</span>
            </div>
          </div>
        ))}
        <button className="btn btn-primary btn-block" onClick={onContinue} style={{ marginTop: "16px" }}>
          VER CLASIFICACIÓN
        </button>
      </div>
    </div>
  );
};

interface GroupResultModalProps {
  nationality: string;
  tourName: string;
  result: GroupResult;
  onContinue: () => void;
}

export const GroupResultModal: React.FC<GroupResultModalProps> = ({
  nationality,
  tourName,
  result,
  onContinue,
}) => {
  const qualified = result.advanced;
  const posLabel = `${result.position}ª de grupo`;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-emoji">{flagOf(nationality)}</div>
        <div className="eyebrow">{tourName} · Resultado del grupo</div>
        <h2>{nationality} termina {posLabel}</h2>
        <p style={{ fontSize: "16px", fontWeight: 800, color: qualified ? "var(--ok)" : "var(--danger)" }}>
          {qualified ? "✅ CLASIFICADO A LA SIGUIENTE RONDA" : "❌ ELIMINADA EN FASE DE GRUPOS"}
        </p>
        <button className="btn btn-primary btn-block" onClick={onContinue}>
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

interface SimpleMatchesModalProps {
  flag: string;
  tourName: string;
  matches: Array<{ home: string; away: string; gf: number; ga: number; result: string; role: string }>;
  onContinue: () => void;
}

export const SimpleMatchesModal: React.FC<SimpleMatchesModalProps> = ({
  flag,
  tourName,
  matches,
  onContinue,
}) => {
  const roleIcon = (r: string) => (r === "titular" ? "🟢 Titular" : r === "suplente" ? "🟡 Suplente (entró al campo)" : "⚪ No participó");
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ textAlign: "left" }}>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow">Fase de grupos</div>
          <h2>{flag} {tourName}</h2>
        </div>
        {matches.map((m, i) => (
          <div key={i} className="event-line">
            <div className="event-icon">⚽</div>
            <div style={{ flex: 1 }}>
              <b>{m.home} {m.gf}-{m.ga} {m.away}</b>
              <br />
              <span style={{ color: "var(--muted)", fontSize: "12px" }}>{roleIcon(m.role)}</span>
            </div>
          </div>
        ))}
        <button className="btn btn-primary btn-block" onClick={onContinue} style={{ marginTop: "16px" }}>
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

interface TournamentResultModalProps {
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
}

export const TournamentResultModal: React.FC<TournamentResultModalProps> = ({
  flag,
  tourName,
  nationality,
  resultLabel,
  matchDetail,
  onContinue,
}) => {
  const isRunnerUp = resultLabel.toUpperCase().includes("SUBCAMPEÓN") || resultLabel.toUpperCase().includes("SUBCAMPEONA");
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-emoji">{flag}</div>
        <div className="eyebrow">{tourName}</div>
        <h2>{nationality}</h2>
        <p style={{ fontSize: "16px", color: isRunnerUp ? "var(--gold)" : "var(--danger)", fontWeight: 700, margin: "6px 0 12px" }}>
          {isRunnerUp ? "🥈 " + resultLabel : "❌ " + resultLabel}
        </p>

        {matchDetail && (
          <div style={{
            background: "rgba(0, 0, 0, 0.35)",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            padding: "14px",
            margin: "14px 0",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Partido decisivo · {matchDetail.stageName}
            </div>
            <div style={{ fontSize: "19px", fontWeight: 800, margin: "8px 0", color: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span>{flag} {nationality}</span>
              <span style={{ color: "var(--danger)", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "2px 10px", borderRadius: "8px", fontFamily: "monospace" }}>
                {matchDetail.gf} - {matchDetail.ga}
              </span>
              <span>{matchDetail.oppFlag} {matchDetail.opp}</span>
            </div>
            {matchDetail.isPenalties && matchDetail.penScore && (
              <div style={{ fontSize: "12px", color: "#e2e8f0", marginTop: "4px" }}>
                🎯 Caída en la tanda de penaltis ({matchDetail.penScore})
              </div>
            )}
          </div>
        )}

        <button className="btn btn-primary btn-block" onClick={onContinue} style={{ marginTop: "12px" }}>
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

interface SeasonSummaryModalProps {
  summary: SeasonSummary;
  onContinue: () => void;
}

export const SeasonSummaryModal: React.FC<SeasonSummaryModalProps> = ({
  summary,
  onContinue,
}) => {
  const valueUp = summary.valueTo >= summary.valueFrom;
  const salaryUp = summary.salaryTo >= summary.salaryFrom;

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ textAlign: "left" }}>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow">Temporada {summary.year}</div>
          <h2 style={{ margin: "6px 0 14px" }}>Resumen de temporada</h2>
        </div>
        <div className="narration">{summary.narration}</div>
        <div className="stat-row">
          <div className="stat-box">
            <div className="v">{summary.matches}</div>
            <div className="l">Partidos</div>
          </div>
          <div className="stat-box">
            <div className="v">{summary.goals}</div>
            <div className="l">Goles</div>
          </div>
          <div className="stat-box">
            <div className="v">{summary.assists}</div>
            <div className="l">Asistencias</div>
          </div>
          <div className="stat-box">
            <div className="v">{summary.avgRating}</div>
            <div className="l">Nota media</div>
          </div>
          <div className="stat-box">
            <div className="v">{summary.levelFrom}→{summary.levelTo}</div>
            <div className="l">Nivel</div>
          </div>
        </div>

        {summary.wonTitles.length > 0 ? (
          <div className="trophy-row" style={{ marginTop: "14px" }}>
            {summary.wonTitles.map((t, idx) => (
              <div key={idx} className="trophy">🏆 {t}</div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "12px" }}>Sin títulos esta temporada.</p>
        )}

        {summary.awards.length > 0 && (
          <div className="trophy-row" style={{ marginTop: "8px" }}>
            {summary.awards.map((a, idx) => (
              <div key={idx} className="trophy" style={{ background: "rgba(232,184,75,0.12)", borderColor: "rgba(232,184,75,0.4)", color: "var(--gold)" }}>
                ⭐ {a}
              </div>
            ))}
          </div>
        )}

        {summary.championsOverview && (
          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: "12.5px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gold)", marginBottom: "8px", fontWeight: 700 }}>
              👑 CAMPEONES DE LA TEMPORADA
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div className="event-line" style={{ background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px" }}>
                <div className="event-icon" style={{ fontSize: "16px" }}>🇪🇺</div>
                <div style={{ flex: 1, fontSize: "12.5px" }}>
                  <span style={{ color: "var(--muted)" }}>Champions League:</span>{" "}
                  <b style={{ color: summary.championsOverview.championsLeague === summary.club ? "var(--gold)" : "#ffffff" }}>
                    {summary.championsOverview.championsLeague}
                  </b>
                  {summary.championsOverview.championsLeague === summary.club && (
                    <span style={{ color: "var(--gold)", fontWeight: 800, marginLeft: "6px", fontSize: "11px" }}>🏆 ¡TÚ!</span>
                  )}
                </div>
              </div>

              <div className="event-line" style={{ background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px" }}>
                <div className="event-icon" style={{ fontSize: "16px" }}>🏆</div>
                <div style={{ flex: 1, fontSize: "12.5px" }}>
                  <span style={{ color: "var(--muted)" }}>{summary.championsOverview.leagueName}:</span>{" "}
                  <b style={{ color: summary.championsOverview.leagueTitle === summary.club ? "var(--gold)" : "#ffffff" }}>
                    {summary.championsOverview.leagueTitle}
                  </b>
                  {summary.championsOverview.leagueTitle === summary.club && (
                    <span style={{ color: "var(--gold)", fontWeight: 800, marginLeft: "6px", fontSize: "11px" }}>🏆 ¡TÚ!</span>
                  )}
                </div>
              </div>

              <div className="event-line" style={{ background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px" }}>
                <div className="event-icon" style={{ fontSize: "16px" }}>🌍</div>
                <div style={{ flex: 1, fontSize: "12.5px" }}>
                  <span style={{ color: "var(--muted)" }}>Mundial de Clubes:</span>{" "}
                  <b style={{ color: summary.championsOverview.clubWorldCup === summary.club ? "var(--gold)" : "#ffffff" }}>
                    {summary.championsOverview.clubWorldCup}
                  </b>
                  {summary.championsOverview.clubWorldCup === summary.club && (
                    <span style={{ color: "var(--gold)", fontWeight: 800, marginLeft: "6px", fontSize: "11px" }}>🏆 ¡TÚ!</span>
                  )}
                </div>
              </div>
            </div>

            {/* TOP 3 EQUIPOS DEL AÑO */}
            {summary.championsOverview.top3Teams && summary.championsOverview.top3Teams.length > 0 && (
              <div style={{ marginTop: "14px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gold)", marginBottom: "8px", fontWeight: 700 }}>
                  🛡️ TOP 3 EQUIPOS DEL AÑO
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {summary.championsOverview.top3Teams.map((team) => (
                    <div key={team.rank} style={{
                      background: team.isUser ? "rgba(232,184,75,0.12)" : "rgba(255,255,255,0.03)",
                      border: team.isUser ? "1px solid var(--gold)" : "1px solid transparent",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <div style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: team.rank === 1 ? "var(--gold)" : team.rank === 2 ? "#cbd5e1" : "#cd7f32",
                        color: "#000000",
                        fontWeight: 900,
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {team.rank}
                      </div>
                      <div style={{ flex: 1, fontSize: "12.5px" }}>
                        <b style={{ color: team.isUser ? "var(--gold)" : "#ffffff" }}>{team.name}</b>
                        {team.isUser && <span style={{ color: "var(--gold)", fontWeight: 800, marginLeft: "6px", fontSize: "11px" }}> (Tu Club)</span>}
                        <div style={{ fontSize: "11px", color: "var(--muted)" }}>{team.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOP 3 JUGADORES DEL AÑO */}
            {summary.championsOverview.top3Players && summary.championsOverview.top3Players.length > 0 && (
              <div style={{ marginTop: "14px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gold)", marginBottom: "8px", fontWeight: 700 }}>
                  ⭐ TOP 3 JUGADORES DEL AÑO
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {summary.championsOverview.top3Players.map((player) => (
                    <div key={player.rank} style={{
                      background: player.isUser ? "rgba(232,184,75,0.12)" : "rgba(255,255,255,0.03)",
                      border: player.isUser ? "1px solid var(--gold)" : "1px solid transparent",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: player.rank === 1 ? "var(--gold)" : player.rank === 2 ? "#cbd5e1" : "#cd7f32",
                          color: "#000000",
                          fontWeight: 900,
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}>
                          {player.rank}
                        </div>
                        <div style={{ fontSize: "12.5px" }}>
                          <b style={{ color: player.isUser ? "var(--gold)" : "#ffffff" }}>{player.name}</b>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{player.club}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--ok)", fontFamily: "monospace" }}>
                          {player.stats}
                        </span>
                        {player.award && (
                          <div style={{ fontSize: "10.5px", color: "var(--gold)", fontWeight: 700 }}>
                            {player.award}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALA DE PREMIOS INDIVIDUALES DEL AÑO */}
            {summary.championsOverview.galaAwards && (
              <div style={{ marginTop: "14px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gold)", marginBottom: "8px", fontWeight: 700 }}>
                  🏆 GALA DE PREMIOS DEL AÑO
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
                  {/* BALON DE ORO */}
                  <div style={{
                    background: summary.championsOverview.galaAwards.ballonDor.isUser ? "rgba(232,184,75,0.18)" : "rgba(255,255,255,0.03)",
                    border: summary.championsOverview.galaAwards.ballonDor.isUser ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "18px", marginBottom: "2px" }}>🥇</div>
                    <div style={{ fontSize: "10.5px", color: "var(--gold)", textTransform: "uppercase", fontWeight: 800 }}>BALÓN DE ORO</div>
                    <div style={{ fontSize: "12.5px", fontWeight: 800, color: summary.championsOverview.galaAwards.ballonDor.isUser ? "var(--gold)" : "#ffffff", marginTop: "2px" }}>
                      {summary.championsOverview.galaAwards.ballonDor.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>{summary.championsOverview.galaAwards.ballonDor.club}</div>
                    <div style={{ fontSize: "10px", color: "var(--ok)", fontWeight: 700, marginTop: "2px" }}>
                      {summary.championsOverview.galaAwards.ballonDor.stats}
                    </div>
                  </div>

                  {/* BOTA DE ORO */}
                  <div style={{
                    background: summary.championsOverview.galaAwards.goldenBoot.isUser ? "rgba(232,184,75,0.18)" : "rgba(255,255,255,0.03)",
                    border: summary.championsOverview.galaAwards.goldenBoot.isUser ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "18px", marginBottom: "2px" }}>👟</div>
                    <div style={{ fontSize: "10.5px", color: "var(--gold)", textTransform: "uppercase", fontWeight: 800 }}>BOTA DE ORO</div>
                    <div style={{ fontSize: "12.5px", fontWeight: 800, color: summary.championsOverview.galaAwards.goldenBoot.isUser ? "var(--gold)" : "#ffffff", marginTop: "2px" }}>
                      {summary.championsOverview.galaAwards.goldenBoot.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>{summary.championsOverview.galaAwards.goldenBoot.club}</div>
                    <div style={{ fontSize: "10px", color: "var(--ok)", fontWeight: 700, marginTop: "2px" }}>
                      {summary.championsOverview.galaAwards.goldenBoot.stats}
                    </div>
                  </div>

                  {/* MEJOR PORTERO / TROFEO YASHIN */}
                  <div style={{
                    background: summary.championsOverview.galaAwards.bestGoalkeeper.isUser ? "rgba(232,184,75,0.18)" : "rgba(255,255,255,0.03)",
                    border: summary.championsOverview.galaAwards.bestGoalkeeper.isUser ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "18px", marginBottom: "2px" }}>🧤</div>
                    <div style={{ fontSize: "10.5px", color: "var(--gold)", textTransform: "uppercase", fontWeight: 800 }}>TROFEO YASHIN</div>
                    <div style={{ fontSize: "12.5px", fontWeight: 800, color: summary.championsOverview.galaAwards.bestGoalkeeper.isUser ? "var(--gold)" : "#ffffff", marginTop: "2px" }}>
                      {summary.championsOverview.galaAwards.bestGoalkeeper.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>{summary.championsOverview.galaAwards.bestGoalkeeper.club}</div>
                    <div style={{ fontSize: "10px", color: "var(--ok)", fontWeight: 700, marginTop: "2px" }}>
                      {summary.championsOverview.galaAwards.bestGoalkeeper.stats}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
          <div className="event-line">
            <div className="event-icon">💰</div>
            <div>
              Valor de mercado: {fmtMoney(summary.valueFrom)} →{" "}
              <b style={{ color: valueUp ? "var(--ok)" : "var(--danger)" }}>{fmtMoney(summary.valueTo)}</b>
            </div>
          </div>
          <div className="event-line">
            <div className="event-icon">💵</div>
            <div>
              Salario: {fmtSalary(summary.salaryFrom)} →{" "}
              <b style={{ color: salaryUp ? "var(--ok)" : "var(--danger)" }}>{fmtSalary(summary.salaryTo)}</b>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "6px" }}>
          <h3 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
            Movimientos económicos
          </h3>
          {summary.moneyEvents.map((ev, idx) => (
            <div key={idx} className="event-line">
              <div className="event-icon">{ev.amount >= 0 ? "📈" : "📉"}</div>
              <div style={{ flex: 1 }}>{ev.label}</div>
              <div className={`event-money ${ev.amount >= 0 ? "pos" : "neg"}`}>
                {ev.amount >= 0 ? "+" : ""}{fmtMoney(ev.amount)}
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-block" onClick={onContinue} style={{ marginTop: "18px" }}>
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

interface ContractModalProps {
  club: string;
  onRenew: () => void;
  onLeave: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  club,
  onRenew,
  onLeave,
}) => (
  <div className="modal-backdrop">
    <div className="modal">
      <div className="eyebrow">Situación contractual</div>
      <h2>Tu contrato termina esta temporada</h2>
      <p>El {club} quiere conocer tu decisión sobre tu futuro.</p>
      <div className="btn-row">
        <button className="btn btn-primary btn-block" onClick={onRenew}>
          RENOVAR CON {club.toUpperCase()}
        </button>
        <button className="btn btn-ghost btn-block" onClick={onLeave}>
          BUSCAR NUEVO CLUB
        </button>
      </div>
    </div>
  </div>
);

interface SingleOfferModalProps {
  currentClub: string;
  currentSalary: number;
  offer: Offer;
  onStay: () => void;
  onAccept: () => void;
}

export const SingleOfferModal: React.FC<SingleOfferModalProps> = ({
  currentClub,
  currentSalary,
  offer,
  onStay,
  onAccept,
}) => (
  <div className="modal-backdrop">
    <div className="modal">
      <div className="eyebrow">
        {offer.scoutText ? "🕵️ Interés de Ojeador" : "Oferta recibida"}
      </div>
      <h2>
        {offer.scoutText || `${offer.club.name} está interesado en ti`}
      </h2>
      
      {offer.scoutText && (
        <div style={{
          background: "rgba(232, 184, 75, 0.16)",
          border: "1.5px solid var(--gold)",
          borderRadius: "10px",
          padding: "12px 14px",
          margin: "12px 0 16px",
          color: "var(--gold)",
          fontWeight: 700,
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "22px" }}>🕵️</span>
          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.9 }}>
              Gran Temporada
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800 }}>
              Un ojeador te quiere para el {offer.club.name}
            </div>
          </div>
        </div>
      )}

      <div className="offer-compare">
        <div className="offer-box">
          <div className="club">{currentClub}</div>
          <div className="line"><span>Salario</span><span>{fmtSalary(currentSalary)}</span></div>
        </div>
        <div className="arrow">→</div>
        <div className="offer-box">
          <div className="club">{offer.club.name}</div>
          <div className="line"><span>Salario</span><span>{fmtSalary(offer.salary)}</span></div>
          <div className="line"><span>Contrato</span><span>{offer.years} años</span></div>
          <div className="line"><span>Valor total</span><span>{fmtMoney(offer.contractValue)}</span></div>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn btn-ghost btn-block" onClick={onStay}>
          QUEDARME
        </button>
        <button className="btn btn-primary btn-block" onClick={onAccept}>
          ACEPTAR OFERTA DE {offer.club.name.toUpperCase()}
        </button>
      </div>
    </div>
  </div>
);

interface MultiOfferModalProps {
  currentClub: string;
  offers: Offer[];
  onAcceptOffer: (offer: Offer) => void;
  onStay: () => void;
}

export const MultiOfferModal: React.FC<MultiOfferModalProps> = ({
  currentClub,
  offers,
  onAcceptOffer,
  onStay,
}) => {
  const topScoutOffer = offers.find(o => o.scoutText || o.isScoutInterest);
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="eyebrow">Mercado de fichajes</div>
        <h2>Has recibido {offers.length} ofertas</h2>
        {topScoutOffer && (
          <div style={{
            background: "rgba(232, 184, 75, 0.16)",
            border: "1.5px solid var(--gold)",
            borderRadius: "10px",
            padding: "12px 14px",
            margin: "12px 0 16px",
            color: "var(--gold)",
            fontWeight: 700,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{ fontSize: "22px" }}>🕵️</span>
            <div>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.9 }}>
                Gran Temporada
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800 }}>
                Un ojeador te quiere para el {topScoutOffer.club.name}
              </div>
            </div>
          </div>
        )}
        <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: "13.5px" }}>
          Elige tu próximo destino o permanece en {currentClub}.
        </p>
        <div className="btn-row">
          {offers.map((o, idx) => (
            <button key={idx} className="btn btn-ghost btn-block" onClick={() => onAcceptOffer(o)}>
              {o.scoutText ? `🕵️ ${o.club.name}` : o.club.name} — {fmtSalary(o.salary)} · {o.years} años
            </button>
          ))}
          <button className="btn btn-primary btn-block" onClick={onStay}>
            QUEDARME EN {currentClub.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

interface PositionChangeModalProps {
  currentPos: string;
  newPosKey: "POR" | "DEF" | "MED" | "EXT" | "DEL";
  onAccept: () => void;
  onReject: () => void;
}

export const PositionChangeModal: React.FC<PositionChangeModalProps> = ({
  currentPos,
  newPosKey,
  onAccept,
  onReject,
}) => (
  <div className="modal-backdrop">
    <div className="modal">
      <div className="eyebrow">Petición del entrenador</div>
      <h2>Tu entrenador quiere cambiarte de posición</h2>
      <p>Te propone jugar como <b>{POS_NAMES[newPosKey]}</b> en lugar de {currentPos}.</p>
      <div className="btn-row">
        <button className="btn btn-primary btn-block" onClick={onAccept}>
          ACEPTAR
        </button>
        <button className="btn btn-ghost btn-block" onClick={onReject}>
          RECHAZAR
        </button>
      </div>
    </div>
  </div>
);

interface SponsorModalProps {
  sponsorName: string;
  bonus: number;
  onAccept: () => void;
  onReject: () => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({
  sponsorName,
  bonus,
  onAccept,
  onReject,
}) => (
  <div className="modal-backdrop">
    <div className="modal">
      <div className="eyebrow">Oportunidad comercial</div>
      <h2>Una marca quiere contratarte</h2>
      <p><b>{sponsorName}</b> te ofrece ser su imagen a cambio de {fmtMoney(bonus)} por temporada.</p>
      <div className="btn-row">
        <button className="btn btn-primary btn-block" onClick={onAccept}>
          ACEPTAR
        </button>
        <button className="btn btn-ghost btn-block" onClick={onReject}>
          RECHAZAR
        </button>
      </div>
    </div>
  </div>
);

interface ConfirmModalProps {
  title: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  text,
  confirmText = "SÍ, CONTINUAR",
  cancelText = "CANCELAR",
  onConfirm,
  onCancel,
}) => (
  <div className="modal-backdrop">
    <div className="modal">
      <h2>{title}</h2>
      <p style={{ margin: "10px 0 16px", color: "var(--muted)", fontSize: "14px" }}>{text}</p>
      <div className="btn-row">
        <button className="btn btn-primary btn-block" onClick={onConfirm}>
          {confirmText}
        </button>
        <button className="btn btn-ghost btn-block" onClick={onCancel}>
          {cancelText}
        </button>
      </div>
    </div>
  </div>
);

interface LinkAccountModalProps {
  authError: string | null;
  onGoogle: () => void;
  onApple: () => void;
  onEmail: (email: string, pass: string) => void;
  onCancel: () => void;
}

export const LinkAccountModal: React.FC<LinkAccountModalProps> = ({
  authError,
  onGoogle,
  onApple,
  onEmail,
  onCancel,
}) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="eyebrow">Vincular cuenta</div>
        <h2>No pierdas tu progreso</h2>
        <p>Vincula tu partida de invitado a una cuenta real. Tu carrera actual se conservará.</p>
        {authError && <div className="auth-error">{authError}</div>}
        <button className="btn-social btn-google" onClick={onGoogle}>
          <span className="ico" style={{ display: "flex", alignItems: "center" }}>
            <GoogleLogo size={18} />
          </span>
          Vincular con Google
        </button>
        <button className="btn-social btn-apple" onClick={onApple}>
          <span className="ico" style={{ display: "flex", alignItems: "center" }}>
            <AppleLogo size={18} fill="#ffffff" />
          </span>
          Vincular con Apple ID
        </button>
        <div className="auth-divider">o</div>
        <label htmlFor="link-email">Email</label>
        <input
          type="text"
          id="link-email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="link-pass">Contraseña</label>
        <input
          type="password"
          id="link-pass"
          placeholder="Mínimo 6 caracteres"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button className="btn btn-primary btn-block" onClick={() => onEmail(email, pass)}>
          VINCULAR CON EMAIL
        </button>
        <button className="btn btn-ghost btn-block" onClick={onCancel} style={{ marginTop: "10px" }}>
          CANCELAR
        </button>
      </div>
    </div>
  );
};

interface PressQuestionModalProps {
  questionData: PressQuestion;
  onSelectOption: (option: PressOption) => void;
}

export const PressQuestionModal: React.FC<PressQuestionModalProps> = ({
  questionData,
  onSelectOption,
}) => {
  return (
    <div className="modal-backdrop" style={{ zIndex: 9999, background: "rgba(0, 0, 0, 0.88)", backdropFilter: "blur(6px)" }}>
      <div className="modal" style={{ maxWidth: "520px", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div className="eyebrow" style={{ margin: 0 }}>
            🎙️ {questionData.category.toUpperCase()} · ZONA MIXTA
          </div>
          {questionData.reporter && (
            <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}>
              {questionData.reporter}
            </span>
          )}
        </div>

        <h2 style={{ fontSize: "17px", lineHeight: 1.35, margin: "8px 0 16px", color: "var(--fg)" }}>
          {questionData.question}
        </h2>

        <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "14px" }}>
          Elige la respuesta de tu futbolista:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {questionData.options.map((option, idx) => (
            <button
              key={idx}
              className="btn btn-ghost"
              onClick={() => onSelectOption(option)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "10px",
                lineHeight: 1.4,
                whiteSpace: "normal",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.03)",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ fontWeight: 700, color: "#f3f4f6", fontSize: "13.5px" }}>
                "{option.text}"
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--gold)", fontWeight: 600 }}>
                💡 {option.effectText}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

