import React from "react";
import appIconImg from "../assets/images/footcarrer_favicon_logo_1786788354186.jpg";
import { 
  Trophy, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Star 
} from "lucide-react";

interface SeoPagesViewProps {
  pagePath: string;
  onNavigateHome: () => void;
}

export const SeoPagesView: React.FC<SeoPagesViewProps> = ({ pagePath, onNavigateHome }) => {
  const isComoFunciona = pagePath.includes("como-funciona");
  const isEnglishGuide = pagePath.includes("football-career-simulator");
  const isSimuladorGuia = !isComoFunciona && !isEnglishGuide;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 animate-in fade-in duration-200 text-left">
      {/* Top Bar with Home Button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--line)]">
        <button 
          onClick={onNavigateHome}
          className="btn btn-ghost text-xs px-3.5 py-2 flex items-center gap-2 text-[var(--chalk)] hover:text-[var(--gold)]"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Footcareer
        </button>
        <button 
          onClick={onNavigateHome}
          className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> JUGAR AHORA
        </button>
      </div>

      {/* Header Info */}
      <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img 
          src={appIconImg} 
          alt="Footcareer Logo" 
          className="w-20 h-20 rounded-2xl border-2 border-[var(--gold)] object-cover shadow-lg shrink-0"
        />
        <div>
          <div className="eyebrow mb-1">Footcareer · Juego de fútbol online · Guía Oficial</div>
          {isSimuladorGuia && (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--chalk)] leading-tight">
                Footcareer: Guía Oficial del Juego de Fútbol Online
              </h1>
              <p className="text-sm text-[var(--muted)] mt-2">
                Descubre cómo forjar una trayectoria de leyenda en el juego de carrera de futbolista más completo y realista.
              </p>
            </>
          )}

          {isComoFunciona && (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--chalk)] leading-tight">
                ¿Cómo Funciona el Simulador de Fútbol Footcareer?
              </h1>
              <p className="text-sm text-[var(--muted)] mt-2">
                Explicación paso a paso de las mecánicas de temporadas, valoraciones OVR, contratos y decisiones clave.
              </p>
            </>
          )}

          {isEnglishGuide && (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--chalk)] leading-tight">
                Footcareer – Online Football Career Game: Complete Guide
              </h1>
              <p className="text-sm text-[var(--muted)] mt-2">
                Create your custom football player, simulate real seasons, sign with top European clubs, and win the Ballon d'Or.
              </p>
            </>
          )}
        </div>
      </header>

      {/* Main Content Sections */}
      {isSimuladorGuia && (
        <div className="space-y-6 text-sm text-[var(--muted)] leading-relaxed">
          <article className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
            <h2 className="text-xl font-bold text-[var(--chalk)] flex items-center gap-2">
              <Star className="w-5 h-5 text-[var(--gold)]" />
              ¿Qué hace especial a este simulador de carrera de futbolista?
            </h2>
            <p>
              El <strong>simulador de carrera futbolística Footcareer</strong> te permite ponerte en las botas de una joven promesa del fútbol mundial. A diferencia de otros juegos de gestión en los que diriges a todo el club, aquí el foco está 100% en tu propio futbolista profesional: su desarrollo físico, sus goles, sus títulos y su legado histórico.
            </p>
            <p>
              Desde ligas menores hasta levantar la UEFA Champions League y la Copa del Mundo con tu Selección Nacional, cada decisión define si serás un jugador más o una leyenda que compite por el Balón de Oro en este <strong>juego de fútbol online</strong>.
            </p>
          </article>

          <article className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--chalk)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--gold)]" />
              Posiciones y Estilos de Juego Disponibles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[var(--panel-2)] rounded-xl border border-[var(--line)]">
                <strong className="text-[var(--chalk)] text-sm block mb-1">Delantero Centro (DC) & Extremos (EXT)</strong>
                Especializados en marcar goles, generar asistencias y competir anualmente por la Bota de Oro y el trofeo Pichichi.
              </div>
              <div className="p-3.5 bg-[var(--panel-2)] rounded-xl border border-[var(--line)]">
                <strong className="text-[var(--chalk)] text-sm block mb-1">Mediapunta (MCO) & Centrocampista (MED)</strong>
                Los directores de orquesta del equipo. Combinan llegada a gol, asistencias clave y equilibrio en la medular.
              </div>
              <div className="p-3.5 bg-[var(--panel-2)] rounded-xl border border-[var(--line)]">
                <strong className="text-[var(--chalk)] text-sm block mb-1">Pivote Defensivo (MCD) & Defensas (DFC/LAT)</strong>
                Pilares defensivos que aseguran porterías a cero y permiten que tu equipo gane ligas y torneos eliminatorios.
              </div>
              <div className="p-3.5 bg-[var(--panel-2)] rounded-xl border border-[var(--line)]">
                <strong className="text-[var(--chalk)] text-sm block mb-1">Portero (POR)</strong>
                El guardián bajo palos. Sus intervenciones en tandas de penaltis y finales deciden títulos cruciales.
              </div>
            </div>
          </article>

          <article className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
            <h2 className="text-xl font-bold text-[var(--chalk)] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--gold)]" />
              El Camino hacia el Balón de Oro y los Títulos de Élite
            </h2>
            <p>
              Para ganar el Balón de Oro en este <strong>juego de carrera futbolística</strong>, debes cumplir tres requisitos fundamentales:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--chalk)]">
              <li>Tener un OVR superior a 86 y encontrarte en tu pico de rendimiento.</li>
              <li>Ganar grandes competiciones de clubes como LaLiga, Premier League o Champions League.</li>
              <li>Tener un rendimiento individual extraordinario (cifras altas de goles y asistencias por temporada).</li>
            </ul>
          </article>
        </div>
      )}

      {isComoFunciona && (
        <div className="space-y-6 text-sm text-[var(--muted)] leading-relaxed">
          <article className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
            <h2 className="text-xl font-bold text-[var(--chalk)] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--gold)]" />
              1. Ciclo Anual de Temporada
            </h2>
            <p>
              Cada temporada se compone de varias fases dinámicas:
            </p>
            <div className="space-y-2 text-xs text-[var(--chalk)]">
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Pretemporada y Entrenamiento:</strong> Seleccionas el plan físico (Intensivo, Táctico o Recuperación) que define la evolución inicial de tu OVR.
              </div>
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Competición de Club:</strong> Disputas partidos de liga, fases eliminatorias y finales de copa nacional y continental.
              </div>
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Torneos de Selecciones:</strong> Si tu rendimiento es sobresaliente, serás convocado para el Mundial, la Eurocopa o la Copa América.
              </div>
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Gala de Premios & Mercado de Fichajes:</strong> Ceremonia del Balón de Oro y negociación de nuevas ofertas o renovaciones de contrato.
              </div>
            </div>
          </article>

          <article className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
            <h2 className="text-xl font-bold text-[var(--chalk)] flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--gold)]" />
              2. Cómo se calcula el Valor de Mercado y Salario
            </h2>
            <p>
              El motor financiero del simulador evalúa en tiempo real:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--chalk)]">
              <li><strong>Nivel OVR actual y edad:</strong> Los futbolistas jóvenes con alto potencial experimentan aumentos exponenciales de cotización.</li>
              <li><strong>Categoría del Club (Tier):</strong> Los clubes de 5 estrellas pagan salarios mayores y cuentan con primas por títulos más elevadas.</li>
              <li><strong>Rendimiento en finales:</strong> Anotar en partidos decisivos dispara el interés de clubes de primer nivel.</li>
            </ul>
          </article>
        </div>
      )}

      {isEnglishGuide && (
        <div className="space-y-6 text-sm text-[var(--muted)] leading-relaxed">
          <article className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
            <h2 className="text-xl font-bold text-[var(--chalk)] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[var(--gold)]" />
              About Football Career - The Ultimate Online Football Career Game
            </h2>
            <p>
              <strong>Football Career</strong> is an online <em>football career simulator</em> built for soccer fans worldwide. Experience every stage of a professional player's journey from a teenage debutant to a retired hall-of-fame legend.
            </p>
            <p>
              Navigate real transfer markets, manage press conferences, compete in top European leagues like Premier League, LaLiga, Serie A, and Bundesliga, and lead your national squad in the World Cup in this ultimate online football career game.
            </p>
          </article>

          <article className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
            <h2 className="text-xl font-bold text-[var(--chalk)] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--gold)]" />
              Core Simulator Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--chalk)]">
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Dynamic OVR Growth:</strong> Tactical training routines, age curves, and match performance dictate your skill evolution.
              </div>
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Realistic Transfer Market:</strong> Receive multi-club contract offers, negotiate wages, and sign sponsorship deals.
              </div>
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Major Cup Finals:</strong> Play as a starter or game-changer substitute in high-stakes Champions League and national cup showdowns.
              </div>
              <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
                <strong>Ballon d'Or & Gala Awards:</strong> Compete with world-class players for the ultimate individual soccer accolade.
              </div>
            </div>
          </article>
        </div>
      )}

      {/* Call to action at bottom */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[var(--panel)] to-slate-900 border border-[var(--gold)]/30 text-center space-y-3">
        <h3 className="text-lg font-bold text-[var(--chalk)]">¿Listo para comenzar tu carrera futbolística?</h3>
        <p className="text-xs text-[var(--muted)] max-w-lg mx-auto">
          Crea tu jugador ahora mismo, elige tu club de debut y escribe tu propia historia en el fútbol mundial.
        </p>
        <button 
          onClick={onNavigateHome}
          className="btn btn-primary px-8 py-3 text-sm font-bold mx-auto flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" /> INICIAR CARRERA AHORA
        </button>
      </div>

      {/* ShareBar y Señales Externas */}
      <div className="mt-8">
        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[var(--muted)]">
            Consulta organismos oficiales: 
            <a href="https://www.fifa.com/" target="_blank" rel="noopener noreferrer" className="ml-1 text-[var(--gold)] hover:underline">FIFA</a> · 
            <a href="https://www.uefa.com/" target="_blank" rel="noopener noreferrer" className="ml-1 text-[var(--gold)] hover:underline">UEFA</a> · 
            <a href="https://www.theifab.com/" target="_blank" rel="noopener noreferrer" className="ml-1 text-[var(--gold)] hover:underline">IFAB</a> · 
            <a href="https://www.francefootball.fr/ballon-d-or/" target="_blank" rel="noopener noreferrer" className="ml-1 text-[var(--gold)] hover:underline">France Football</a>
          </span>
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent("⚽ ¡Juega a Footcareer! Crea tu futbolista y llega al Balón de Oro: https://footcarrer.vercel.app/")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-semibold hover:underline"
          >
            Compartir guía por WhatsApp ↗
          </a>
        </div>
      </div>
    </div>
  );
};
