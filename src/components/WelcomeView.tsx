import React, { useState } from "react";
import appIconImg from "../assets/images/footcarrer_app_icon_1786368472328.jpg";
import { PositionKey, CareerState } from "../types";
import { 
  CLUBS, 
  LEAGUES, 
  NATIONALITIES, 
  POSITIONS, 
  clamp, 
  randInt,
  calculateRealisticMarketValue,
  calculateRealisticSalary
} from "../data/clubsAndLeagues";
import { SeoInfoSection } from "./SeoInfoSection";

interface WelcomeViewProps {
  existingGame: CareerState | null;
  onContinueGame: () => void;
  onCreateGame: (state: CareerState) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  existingGame,
  onContinueGame,
  onCreateGame,
}) => {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("España");
  const [age, setAge] = useState(17);
  const [position, setPosition] = useState<PositionKey>("MED");
  const [selectedLeague, setSelectedLeague] = useState("LL");
  
  const clubsInLeague = CLUBS.filter(c => c.league === selectedLeague);
  const [selectedClubName, setSelectedClubName] = useState(
    clubsInLeague[0]?.name || "Getafe CF"
  );

  const handleLeagueChange = (leagueKey: string) => {
    setSelectedLeague(leagueKey);
    const inNewLeague = CLUBS.filter(c => c.league === leagueKey);
    if (inNewLeague.length > 0) {
      setSelectedClubName(inNewLeague[0].name);
    }
  };

  const handleCreate = () => {
    const finalName = name.trim() || "Jugador Anónimo";
    const clubObj = CLUBS.find(c => c.name === selectedClubName) || CLUBS[0];
    const baseLevel = randInt(58, 66) + (clubObj.tier - 3);
    const potential = clamp(baseLevel + randInt(14, 30) - (age - 17) * 2, baseLevel + 5, 96);

    const finalLevel = clamp(baseLevel, 55, 75);
    const finalPotential = clamp(potential, 60, 99);
    const marketValue = calculateRealisticMarketValue(finalLevel, age, finalPotential);
    const salary = calculateRealisticSalary(marketValue, finalLevel);

    const newPlayer = {
      name: finalName,
      nationality,
      age,
      position,
      club: clubObj.name,
      level: clamp(baseLevel, 55, 75),
      potential: clamp(potential, 60, 99),
      marketValue,
      salary,
      money: salary * 0.5,
      goals: 0,
      assists: 0,
      matches: 0,
      titles: 0,
      ballonsDor: 0,
      goldenBoots: 0,
      individualAwards: 0,
      trophiesList: {},
      season: 1,
      seasonYearStart: 2026,
      debutAge: age,
      clubsHistory: [clubObj.name],
      maxMarketValue: marketValue,
      maxSalary: salary,
      totalMoneyEarned: 0,
      injuredMatchesLost: 0,
      caps: 0,
      bestSeason: null,
      retired: false,
      sponsor: null,
      log: [],
      timeline: [{ age, text: `Debut profesional en ${clubObj.name}.` }],
      score: 0,
      flags: {
        firstTitleLogged: false,
        firstBallonLogged: false,
        declineLogged: false,
        maxValueLogged: false,
      },
    };

    onCreateGame({
      player: newPlayer,
      meta: { clubTier: clubObj.tier },
    });
  };

  return (
    <div>
      <header className="hero">
        <div className="field-mark"></div>
        <img 
          src={appIconImg} 
          alt="Footcareer – Juego de fútbol online" 
          style={{ width: "80px", height: "80px", borderRadius: "18px", objectFit: "cover", margin: "0 auto 12px", border: "2px solid var(--gold)", boxShadow: "0 4px 20px rgba(232, 184, 75, 0.25)" }} 
        />
        <div className="eyebrow">Simulador de Carrera Futbolística · Edición 2026</div>
        <h1>Footcareer – Juego de fútbol online</h1>
        <p className="sub">Crea tu futbolista, ficha por clubes históricos, supera temporadas y conviértete en leyenda del fútbol en este juego de fútbol online.</p>
      </header>

      {existingGame && !existingGame.player.retired && (
        <div className="card">
          <h3 style={{ marginBottom: "10px" }}>Carrera en curso</h3>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "14px" }}>
            {existingGame.player.name} · {existingGame.player.age} años · {existingGame.player.club} · Temporada {existingGame.player.season}
          </p>
          <button className="btn btn-primary btn-block" onClick={onContinueGame}>
            CONTINUAR CARRERA
          </button>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>Nueva carrera</h3>
        
        <label htmlFor="in-name">Nombre del futbolista</label>
        <input
          type="text"
          id="in-name"
          placeholder="Ej. Kai Robledo"
          maxLength={24}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid2">
          <div>
            <label htmlFor="in-nat">Nacionalidad</label>
            <select id="in-nat" value={nationality} onChange={(e) => setNationality(e.target.value)}>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="in-age">Edad inicial</label>
            <select id="in-age" value={age} onChange={(e) => setAge(parseInt(e.target.value))}>
              {[16, 17, 18, 19, 20].map((a) => (
                <option key={a} value={a}>{a} años</option>
              ))}
            </select>
          </div>
        </div>

        <label>Posición</label>
        <div className="pos-grid">
          {POSITIONS.map((p) => (
            <div
              key={p}
              className={`pos-opt ${p === position ? "active" : ""}`}
              onClick={() => setPosition(p)}
            >
              {p}
            </div>
          ))}
        </div>

        <label htmlFor="in-league">Liga inicial</label>
        <select
          id="in-league"
          value={selectedLeague}
          onChange={(e) => handleLeagueChange(e.target.value)}
        >
          {Object.entries(LEAGUES).map(([k, l]) => (
            <option key={k} value={k}>{l.title} ({l.country})</option>
          ))}
        </select>

        <label htmlFor="in-club">Club inicial</label>
        <select
          id="in-club"
          value={selectedClubName}
          onChange={(e) => setSelectedClubName(e.target.value)}
        >
          {clubsInLeague.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} — {"★".repeat(c.tier)}
            </option>
          ))}
        </select>

        <button className="btn btn-primary btn-block" onClick={handleCreate} style={{ marginTop: "6px" }}>
          EMPEZAR CARRERA
        </button>
      </div>

      {/* Sección Informativa Completa para SEO y Guía de Jugadores */}
      <SeoInfoSection />
    </div>
  );
};
