import React from "react";

let svgIdCounter = 0;

export function trophyKind(name: string): "boot" | "ballon" | "super" | "ears" | "star" | "shield" | "classic" {
  const n = name.toLowerCase();
  if (n.includes("bota de oro")) return "boot";
  if (n.includes("balón de oro")) return "ballon";
  if (n.includes("supercopa")) return "super";
  if (n.includes("champions") || n.includes("europa league") || n.includes("conference") || n.includes("libertadores")) return "ears";
  if (n.includes("mundial") || n.includes("eurocopa") || n.includes("copa américa") || n.includes("copa africana") || n.includes("copa asiática") || n.includes("copa oro")) return "star";
  if (n.includes("copa") || n.includes("cup") || n.includes("pokal") || n.includes("coupe") || n.includes("coppa") || n.includes("beker") || n.includes("taça")) return "shield";
  return "classic";
}

export function trophyEyebrow(kind: string): string {
  const map: Record<string, string> = {
    ears: "¡CAMPEONES DE EUROPA!",
    classic: "¡CAMPEONES DE LIGA!",
    shield: "¡CAMPEONES DE COPA!",
    star: "¡CAMPEONES DEL TORNEO!",
    super: "¡SUPERCOPA CONSEGUIDA!",
    boot: "MÁXIMO GOLEADOR",
    ballon: "ELECCIÓN MUNDIAL",
  };
  return map[kind] || "¡CAMPEONES!";
}

interface TrophySvgProps {
  name: string;
  size: number;
  colorMain?: string;
  colorLight?: string;
}

export const TrophySvg: React.FC<TrophySvgProps> = ({
  name,
  size,
  colorMain = "#e8b84b",
  colorLight = "#fff2c2"
}) => {
  const kind = trophyKind(name);
  const id = "tr" + (svgIdCounter++);
  const accent = "#8a6a1e";

  if (kind === "ballon") {
    return (
      <svg width={size} height={size} viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`ballGrad_${id}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="55%" stopColor="#e8b84b" />
            <stop offset="100%" stopColor="#a9781f" />
          </radialGradient>
        </defs>
        <rect x="44" y="112" width="32" height="9" rx="2" fill="#c8942b" />
        <rect x="54" y="98" width="12" height="16" fill="#c8942b" />
        <circle cx="60" cy="58" r="42" fill={`url(#ballGrad_${id})`} />
        <polygon points="60,34 70,44 66,58 54,58 50,44" fill="#5a4009" opacity="0.55" />
        <circle cx="60" cy="58" r="42" fill="none" stroke="#5a4009" strokeWidth="1.5" opacity="0.35" />
      </svg>
    );
  }

  if (kind === "boot") {
    return (
      <svg width={size} height={size} viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g_${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorLight} />
            <stop offset="60%" stopColor={colorMain} />
            <stop offset="100%" stopColor="#7a5a12" />
          </linearGradient>
        </defs>
        <ellipse cx="62" cy="120" rx="46" ry="7" fill="rgba(0,0,0,0.35)" />
        <path d="M22 108 C22 82 30 60 34 46 C36 40 44 38 50 42 C56 46 58 54 66 56 C82 60 96 64 100 78 C104 92 96 108 84 108 Z" fill={`url(#g_${id})`} />
        <path d="M34 46 C40 52 40 62 34 70" stroke="rgba(0,0,0,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M22 108 h78 v10 a6 6 0 0 1 -6 6 H28 a6 6 0 0 1 -6 -6 Z" fill={`url(#g_${id})`} opacity="0.9" />
        <circle cx="52" cy="52" r="2.4" fill="#fff8de" />
        <circle cx="60" cy="58" r="2.4" fill="#fff8de" />
        <circle cx="68" cy="62" r="2.4" fill="#fff8de" />
      </svg>
    );
  }

  if (kind === "ears") {
    return (
      <svg width={size} height={size} viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g_${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorLight} />
            <stop offset="55%" stopColor={colorMain} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="140" rx="26" ry="5" fill="rgba(0,0,0,0.35)" />
        <rect x="38" y="122" width="44" height="9" rx="2" fill={`url(#g_${id})`} />
        <rect x="46" y="126" width="28" height="10" rx="2" fill={`url(#g_${id})`} opacity="0.85" />
        <rect x="53" y="98" width="14" height="26" fill={`url(#g_${id})`} />
        <path d="M32 24 h56 l-7 50 a21 21 0 0 1 -42 0 z" fill={`url(#g_${id})`} />
        <path d="M34 30 C10 28 6 58 30 68 C22 62 22 46 38 40" stroke={`url(#g_${id})`} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M86 30 C110 28 114 58 90 68 C98 62 98 46 82 40" stroke={`url(#g_${id})`} strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="27" y="16" width="66" height="13" rx="4" fill={`url(#g_${id})`} />
        <ellipse cx="60" cy="22" rx="27" ry="4" fill="rgba(255,255,255,0.25)" />
        <path d="M40 52 h40" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <path d="M42 60 h36" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <circle cx="60" cy="44" r="7" fill="rgba(255,255,255,0.4)" />
      </svg>
    );
  }

  if (kind === "shield") {
    const shieldMain = "#c7d0d6";
    const shieldLight = "#f4f7f9";
    const shieldAcc = "#7c8790";
    return (
      <svg width={size} height={size} viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g_${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shieldLight} />
            <stop offset="55%" stopColor={shieldMain} />
            <stop offset="100%" stopColor={shieldAcc} />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="140" rx="24" ry="5" fill="rgba(0,0,0,0.35)" />
        <rect x="40" y="120" width="40" height="9" rx="2" fill={`url(#g_${id})`} />
        <rect x="52" y="98" width="16" height="24" fill={`url(#g_${id})`} />
        <path d="M36 22 h48 v34 c0 24 -16 34 -24 40 c-8 -6 -24 -16 -24 -40 z" fill={`url(#g_${id})`} />
        <path d="M60 30 v56" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <path d="M42 40 h36" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
        <path d="M20 40 C10 44 10 58 22 62" stroke={`url(#g_${id})`} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M100 40 C110 44 110 58 98 62" stroke={`url(#g_${id})`} strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="44" r="8" fill="rgba(255,255,255,0.38)" />
      </svg>
    );
  }

  if (kind === "star") {
    return (
      <svg width={size} height={size} viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g_${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorLight} />
            <stop offset="55%" stopColor={colorMain} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="142" rx="30" ry="5" fill="rgba(0,0,0,0.35)" />
        <rect x="32" y="122" width="56" height="10" rx="3" fill={`url(#g_${id})`} />
        <rect x="42" y="128" width="36" height="9" rx="2" fill={`url(#g_${id})`} opacity="0.85" />
        <rect x="52" y="96" width="16" height="28" fill={`url(#g_${id})`} />
        <path d="M60 92 C34 92 26 66 34 44 C40 50 48 52 52 46 C54 62 66 62 68 46 C72 52 80 50 86 44 C94 66 86 92 60 92 Z" fill={`url(#g_${id})`} />
        <circle cx="60" cy="30" r="12" fill={`url(#g_${id})`} />
        <path d="M60 18 l3.2 7.4 8 0.7 -6 5.4 1.8 7.9 -7 -4.2 -7 4.2 1.8-7.9 -6-5.4 8-0.7 z" fill="#fff8de" opacity="0.9" />
        <ellipse cx="60" cy="70" rx="20" ry="5" fill="rgba(255,255,255,0.2)" />
      </svg>
    );
  }

  if (kind === "super") {
    const sMain = "#7b5fd9";
    const sLight = "#c9b8ff";
    const sAcc = "#4a3894";
    return (
      <svg width={size} height={size} viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g_${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={sLight} />
            <stop offset="55%" stopColor={sMain} />
            <stop offset="100%" stopColor={sAcc} />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="136" rx="22" ry="4.5" fill="rgba(0,0,0,0.35)" />
        <rect x="44" y="118" width="32" height="8" rx="2" fill={`url(#g_${id})`} />
        <rect x="54" y="98" width="12" height="22" fill={`url(#g_${id})`} />
        <path d="M40 34 h40 l-5 36 a15 15 0 0 1 -30 0 z" fill={`url(#g_${id})`} />
        <path d="M40 38 C24 38 22 54 34 60" stroke={`url(#g_${id})`} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d="M80 38 C96 38 98 54 86 60" stroke={`url(#g_${id})`} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <rect x="36" y="27" width="48" height="10" rx="3" fill={`url(#g_${id})`} />
        <path d="M58 44 l6 -6 -3 9 6 -2 -9 12 2 -9 -6 2 z" fill="#fff8de" opacity="0.95" />
      </svg>
    );
  }

  // classic cup default
  return (
    <svg width={size} height={size} viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g_${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="60%" stopColor={colorMain} />
          <stop offset="100%" stopColor="#7a5a12" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="140" rx="28" ry="5" fill="rgba(0,0,0,0.35)" />
      <rect x="34" y="122" width="52" height="10" rx="3" fill={`url(#g_${id})`} />
      <rect x="42" y="128" width="36" height="8" rx="2" fill={`url(#g_${id})`} opacity="0.8" />
      <rect x="52" y="96" width="16" height="28" fill={`url(#g_${id})`} />
      <path d="M30 30 C30 62 46 76 60 76 C74 76 90 62 90 30 Z" fill={`url(#g_${id})`} />
      <path d="M30 36 C16 36 12 52 24 58" stroke={`url(#g_${id})`} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M90 36 C104 36 108 52 96 58" stroke={`url(#g_${id})`} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="26" y="24" width="68" height="11" rx="4" fill={`url(#g_${id})`} />
      <g opacity="0.85">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={38 + i * 7} cy="50" r="2.4" fill="rgba(255,255,255,0.55)" />
        ))}
      </g>
      <ellipse cx="60" cy="30" rx="28" ry="4" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
};
