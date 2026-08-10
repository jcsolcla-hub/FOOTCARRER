import React, { useEffect, useRef } from "react";
import { TrophySvg, trophyKind, trophyEyebrow } from "./TrophySvg";

interface LevelConfig {
  bgClass: string;
  size: number;
  confetti: number;
  sparkles: number;
  color: string;
  light: string;
}

const LEVEL_CONFIG: Record<string, LevelConfig> = {
  big:  { bgClass: "celebration-bg-big",  size: 130, confetti: 60,  sparkles: 8,  color: "var(--gold-2)", light: "#f2cd6b" },
  huge: { bgClass: "celebration-bg-huge", size: 160, confetti: 110, sparkles: 14, color: "#c8942b",        light: "#fff2c2" },
  max:  { bgClass: "celebration-bg-max",  size: 170, confetti: 160, sparkles: 22, color: "#e8b84b",        light: "#fffbe8" },
};

interface CelebrationModalProps {
  title: string;
  subtitle: string;
  level: "big" | "huge" | "max";
  onContinue: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  title,
  subtitle,
  level,
  onContinue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.big;
  const kind = trophyKind(title);
  const eyebrow = trophyEyebrow(kind);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // spawn confetti
    const colors = ["#e8b84b", "#f2cd6b", "#4f9d6e", "#c9503f", "#f1efe6", "#7bb3ff"];
    for (let i = 0; i < cfg.confetti; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      const c = colors[Math.floor(Math.random() * colors.length)];
      const w = Math.floor(Math.random() * 6) + 6;
      const h = Math.floor(Math.random() * 9) + 8;
      el.style.left = Math.random() * 100 + "%";
      el.style.width = w + "px";
      el.style.height = h + "px";
      el.style.background = c;
      el.style.animationDuration = (2.2 + Math.random() * 1.6) + "s";
      el.style.animationDelay = (Math.random() * 0.6) + "s";
      el.style.borderRadius = Math.random() < 0.5 ? "50%" : "2px";
      container.appendChild(el);
    }

    // spawn sparkles
    for (let i = 0; i < cfg.sparkles; i++) {
      const el = document.createElement("div");
      el.className = "sparkle";
      el.style.left = (10 + Math.random() * 80) + "%";
      el.style.top = (5 + Math.random() * 55) + "%";
      el.style.animationDelay = (Math.random() * 1.2) + "s";
      container.appendChild(el);
    }
  }, [cfg]);

  return (
    <div className={`celebration-backdrop ${cfg.bgClass}`} ref={containerRef}>
      <div className="celebration-content">
        <div className="celebration-trophy-wrap">
          <div className="trophy-svg-wrap">
            <TrophySvg name={title} size={cfg.size} colorMain={cfg.color} colorLight={cfg.light} />
          </div>
        </div>
        <div className="celebration-comp mono">{eyebrow}</div>
        <h1 className="celebration-title">{title}</h1>
        <p className="celebration-sub">{subtitle}</p>
        <div className="celebration-continue">
          <button className="btn btn-primary" onClick={onContinue}>
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

interface MultiTitleModalProps {
  titlesWon: string[];
  onContinue: () => void;
}

export const MultiTitleModal: React.FC<MultiTitleModalProps> = ({
  titlesWon,
  onContinue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const colors = ["#e8b84b", "#f2cd6b", "#4f9d6e", "#f1efe6"];
    for (let i = 0; i < 90; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      const c = colors[Math.floor(Math.random() * colors.length)];
      const w = Math.floor(Math.random() * 6) + 6;
      const h = Math.floor(Math.random() * 9) + 8;
      el.style.left = Math.random() * 100 + "%";
      el.style.width = w + "px";
      el.style.height = h + "px";
      el.style.background = c;
      el.style.animationDuration = (2.2 + Math.random() * 1.6) + "s";
      el.style.animationDelay = (Math.random() * 0.6) + "s";
      el.style.borderRadius = Math.random() < 0.5 ? "50%" : "2px";
      container.appendChild(el);
    }
  }, []);

  return (
    <div className="celebration-backdrop celebration-bg-huge" ref={containerRef}>
      <div className="celebration-content">
        <div className="celebration-comp mono">Resumen de la temporada</div>
        <h1 className="celebration-title" style={{ fontSize: "clamp(24px, 7vw, 38px)" }}>
          ¡TEMPORADA HISTÓRICA!
        </h1>
        <p className="celebration-sub">{titlesWon.length} títulos conseguidos</p>
        <div className="multi-title-list">
          {titlesWon.map((t, idx) => (
            <div key={idx} className="multi-title-item">
              🏆 <span>{t}</span>
            </div>
          ))}
        </div>
        <div className="celebration-continue">
          <button className="btn btn-primary" onClick={onContinue}>
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};
