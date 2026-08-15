import React, { useState } from "react";
import { 
  Trophy, 
  TrendingUp, 
  Compass, 
  HelpCircle, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Users,
  Target
} from "lucide-react";

export const SeoInfoSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section 
      aria-label="Guía e Información de FootCarrer"
      className="mt-10 border-t border-[var(--line)] pt-8 pb-4 text-left"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Guía Completa de Juego
          </span>
          <h2 className="text-xl font-bold text-[var(--chalk)]">
            Simulador de Carrera Futbolística: Todo lo que necesitas saber
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Aprende cómo funciona el simulador de carrera de futbolista, la evolución OVR, los traspasos y cómo ganar el Balón de Oro.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-ghost text-xs px-3.5 py-2 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <span>Ocultar detalles</span>
              <ChevronUp className="w-4 h-4 text-[var(--gold)]" />
            </>
          ) : (
            <>
              <span>Leer guía completa</span>
              <ChevronDown className="w-4 h-4 text-[var(--gold)]" />
            </>
          )}
        </button>
      </div>

      {/* Vista resumida siempre visible para usuarios y motores de búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center gap-2.5 mb-2 text-[var(--gold)]">
            <Compass className="w-4 h-4" />
            <h3 className="text-sm font-bold text-[var(--chalk)]">Crea tu Futbolista</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Elige posición, nacionalidad, club inicial y edad para comenzar tu trayectoria en las mejores ligas del mundo.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center gap-2.5 mb-2 text-[var(--ok)]">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-sm font-bold text-[var(--chalk)]">Evolución y Temporadas</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Toma decisiones tácticas, entrena, disputa partidos decisivos y mejora tu valoración general (OVR) año a año.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center gap-2.5 mb-2 text-[var(--gold)]">
            <Trophy className="w-4 h-4" />
            <h3 className="text-sm font-bold text-[var(--chalk)]">Títulos y Balón de Oro</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Conquista ligas, copas nacionales, Champions League y premios individuales hasta convertirte en leyenda.
          </p>
        </div>
      </div>

      {/* Contenido extendido enriquecido para SEO y usuarios interesados */}
      <div className={`space-y-6 text-sm text-[var(--muted)] leading-relaxed transition-all duration-300 ${isExpanded ? "block" : "hidden md:block"}`}>
        
        <article className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--gold)]" />
            ¿Qué es FootCarrer y cómo funciona este simulador de fútbol?
          </h2>
          <p>
            <strong>FootCarrer</strong> es un <em>simulador de carrera futbolística</em> interactivo y gratuito concebido para los apasionados del fútbol que desean experimentar la vida deportiva de un jugador profesional desde su debut juvenil hasta el retiro.
          </p>
          <p>
            A diferencia de los videojuegos tradicionales que requieren horas de manejo con mando, este <strong>juego de carrera futbolística</strong> combina simulación estadística en tiempo real, decisiones estratégicas, eventos de prensa en zona mixta y partidos interactivos donde cada elección impacta directamente en tu rendimiento y reputación.
          </p>
        </article>

        <article className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--gold)]" />
            Cómo crear una carrera futbolística paso a paso
          </h2>
          <p>
            Para <strong>crear tu carrera futbolística</strong> en FootCarrer, solo debes configurar los parámetros iniciales de tu promesa deportiva:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-[var(--chalk)]">
            <li><strong>Nombre y Nacionalidad:</strong> Elige tu país de origen para poder ser convocado por tu Selección Nacional en Mundiales, Eurocopas o Copas América.</li>
            <li><strong>Edad de Debut:</strong> Inicia con 16 a 20 años para definir tu margen de proyección y potencial de desarrollo.</li>
            <li><strong>Posición en el campo:</strong> Selecciona entre Delantero Centro (DC), Extremo (EXT), Mediapunta (MCO), Centrocampista (MED), Pivote (MCD), Lateral (LAT), Central (DFC) o Portero (POR).</li>
            <li><strong>Liga y Club de Inicio:</strong> Empieza en ligas de primer nivel como LaLiga, Premier League, Serie A, Bundesliga, Ligue 1 o en segundas divisiones para labrarte un camino desde abajo.</li>
          </ul>
        </article>

        <article className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--gold)]" />
            Desarrollo de las temporadas, evolución de OVR y valor de mercado
          </h2>
          <p>
            Cada temporada en el <strong>simulador de jugador de fútbol</strong> representa un año completo de competición:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
              <strong className="text-[var(--chalk)] block mb-1">Entrenamientos Tácticos</strong>
              Elige entre sesiones intensivas para acelerar tu media (OVR) asumiendo riesgo físico, o rutinas equilibradas para una progresión constante.
            </div>
            <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
              <strong className="text-[var(--chalk)] block mb-1">Partidos y Finales</strong>
              Disputa partidos clave de liga y finales de copa (Copa del Rey, FA Cup, Champions League) jugando de titular o saliendo como revulsivo.
            </div>
            <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
              <strong className="text-[var(--chalk)] block mb-1">Valor de Mercado Realista</strong>
              Tu cotización en millones de euros se recalcula dinámicamente según tu edad, rendimiento, potencial y goles anotados.
            </div>
            <div className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
              <strong className="text-[var(--chalk)] block mb-1">Premios Individuales</strong>
              Compite anualmente por la Bota de Oro, el Jugador del Año y el prestigioso Balón de Oro en la Gala de Premios.
            </div>
          </div>
        </article>

        <article className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--gold)]" />
            Traspasos, contratos y cómo conseguir la mejor carrera deportiva
          </h2>
          <p>
            Al finalizar cada campaña o recibir ofertas de clubes de mayor nivel, tendrás la oportunidad de renovar con mejora salarial o firmar por gigantes europeos. Para maximizar tu puntuación de leyenda:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[var(--chalk)]">
            <li>Mantén regularidad de minutos para evitar estancamientos en tu media.</li>
            <li>Gestiona con inteligencia tus respuestas en rueda de prensa para mantener el apoyo de la afición y el entrenador.</li>
            <li>Aprovecha las convocatorias internacionales para ganar Copas del Mundo y elevar tu estatus global.</li>
            <li>Elige el momento oportuno para dar el salto a un club con opciones de ganar la Champions League.</li>
          </ol>
        </article>

      </div>

      {/* Enlaces a páginas SEO internas accesibles para bots y usuarios */}
      <nav aria-label="Enlaces informativos" className="mt-6 pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
        <span>© {new Date().getFullYear()} FootCarrer · Football Career Simulator</span>
        <div className="flex flex-wrap items-center gap-4">
          <a 
            href="/simulador-carrera-futbolistica" 
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, "", "/simulador-carrera-futbolistica");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Guía del Simulador
          </a>
          <a 
            href="/como-funciona" 
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, "", "/como-funciona");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            ¿Cómo Funciona?
          </a>
          <a 
            href="/football-career-simulator" 
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, "", "/football-career-simulator");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Career Guide (EN)
          </a>
        </div>
      </nav>
    </section>
  );
};
