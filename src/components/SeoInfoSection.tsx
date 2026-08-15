import React, { useState } from "react";
import { 
  Trophy, 
  TrendingUp, 
  Compass, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Users,
  Target,
  Play,
  Shield,
  Flame,
  Globe
} from "lucide-react";
import { ShareBar } from "./ShareBar";

export const SeoInfoSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      aria-label="Guía oficial de Football Career"
      className="mt-10 border-t border-[var(--line)] pt-8 pb-6 text-left"
    >
      {/* Barra de Navegación Interna para Usuarios y Rastreadores con Múltiples Enlaces */}
      <nav 
        aria-label="Navegación de secciones de Football Career"
        className="p-3.5 mb-6 rounded-xl bg-[var(--panel)] border border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
      >
        <span className="font-bold text-[var(--chalk)] flex items-center gap-1.5 shrink-0">
          <Compass className="w-3.5 h-3.5 text-[var(--gold)]" /> Navegación Rápida:
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[var(--muted)]">
          <a 
            href="#que-es-football-career" 
            onClick={(e) => { e.preventDefault(); scrollToSection("que-es-football-career"); }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            ¿Qué es Football Career?
          </a>
          <a 
            href="#como-se-juega" 
            onClick={(e) => { e.preventDefault(); scrollToSection("como-se-juega"); }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Cómo jugar
          </a>
          <a 
            href="#equipos-jugadores-temporadas" 
            onClick={(e) => { e.preventDefault(); scrollToSection("equipos-jugadores-temporadas"); }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Ver equipos
          </a>
          <a 
            href="#posiciones-detalle" 
            onClick={(e) => { e.preventDefault(); scrollToSection("posiciones-detalle"); }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Ver jugadores
          </a>
          <a 
            href="#temporadas-detalle" 
            onClick={(e) => { e.preventDefault(); scrollToSection("temporadas-detalle"); }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Ver temporadas
          </a>
          <a 
            href="#empieza-a-jugar" 
            onClick={(e) => { e.preventDefault(); scrollToSection("empieza-a-jugar"); }}
            className="text-[var(--gold)] font-semibold hover:underline flex items-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" /> Jugar a Football Career
          </a>
        </div>
      </nav>

      {/* Cabecera de la Sección Informativa con H2 Semántico */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" /> Información y Reglas
          </span>
          <h2 className="text-xl font-bold text-[var(--chalk)]">
            Football Career: El juego de fútbol online y simulador de carrera definitivo
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Conoce todas las mecánicas de este juego de fútbol online, las posiciones de jugadores, ligas, traspasos y cómo ganar el Balón de Oro.
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
              <span>Ocultar guía</span>
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

      {/* Tarjetas resumen con enlaces internos descriptivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center gap-2 mb-2 text-[var(--gold)]">
            <Users className="w-4 h-4" />
            <h3 className="text-sm font-bold text-[var(--chalk)]">Crea a tu Futbolista</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
            Elige tu posición favorita, nacionalidad y club inicial para arrancar tu trayectoria deportiva en Football Career.
          </p>
          <a 
            href="#posiciones-detalle"
            onClick={(e) => { e.preventDefault(); scrollToSection("posiciones-detalle"); }}
            className="text-xs text-[var(--gold)] font-medium hover:underline inline-flex items-center gap-1"
          >
            Ver jugadores y posiciones &rarr;
          </a>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center gap-2 mb-2 text-[var(--ok)]">
            <TrendingUp className="w-4 h-4" />
            <h3 className="text-sm font-bold text-[var(--chalk)]">Supera Temporadas</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
            Entrena duro, toma decisiones en rueda de prensa y disputa finales clave para subir tu valoración OVR en este juego de fútbol online.
          </p>
          <a 
            href="#como-se-juega"
            onClick={(e) => { e.preventDefault(); scrollToSection("como-se-juega"); }}
            className="text-xs text-[var(--ok)] font-medium hover:underline inline-flex items-center gap-1"
          >
            Cómo jugar a Football Career &rarr;
          </a>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
          <div className="flex items-center gap-2 mb-2 text-[var(--gold)]">
            <Trophy className="w-4 h-4" />
            <h3 className="text-sm font-bold text-[var(--chalk)]">Ficha por Grandes Clubes</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">
            Recibe ofertas millonarias, gana ligas, la Champions League y el prestigioso Balón de Oro.
          </p>
          <a 
            href="#equipos-ligas-detalle"
            onClick={(e) => { e.preventDefault(); scrollToSection("equipos-ligas-detalle"); }}
            className="text-xs text-[var(--gold)] font-medium hover:underline inline-flex items-center gap-1"
          >
            Ver equipos y ligas &rarr;
          </a>
        </div>
      </div>

      {/* Contenido Editorial Completo (350-500 palabras estructuradas con H2, H3 y párrafos <p>) */}
      <div className={`space-y-6 text-sm text-[var(--muted)] leading-relaxed transition-all duration-300 ${isExpanded ? "block" : "hidden md:block"}`}>
        
        {/* SECCIÓN 1: ¿Qué es Football Career? */}
        <article id="que-es-football-career" className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--gold)]" />
            ¿Qué es Football Career?
          </h2>
          <p>
            <strong>Football Career</strong> es un emocionante <em>juego de fútbol online</em> y simulador interactivo gratuito que te permite vivir en primera persona toda la trayectoria de un futbolista profesional. Desde tu debut en categorías juveniles con 16 años hasta tu retirada convertida en leyenda del deporte rey, cada año representa una temporada completa cargada de desafíos deportivos, entrenamientos, partidos decisivos y negociaciones de fichajes.
          </p>
          <p>
            A diferencia de los simuladores convencionales de banquillo donde diriges a la plantilla al completo, en este <strong>juego de fútbol online</strong> el protagonista absoluto eres tú: controlas tu progresión física, tu rendimiento goleador o defensivo, tus intervenciones en ruedas de prensa y tu reputación tanto a nivel de clubes como con la Selección Nacional.
          </p>
        </article>

        {/* SECCIÓN 2: ¿Cómo se juega? */}
        <article id="como-se-juega" className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--gold)]" />
            ¿Cómo se juega?
          </h2>
          <p>
            Jugar a <strong>Football Career</strong> es muy intuitivo y accesible desde cualquier navegador web en ordenador, tablet o teléfono móvil. En este <em>juego de fútbol online</em> la carrera transcurre mediante un sistema anual de decisiones y simulación estadística avanzada:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[var(--panel-2)] rounded-xl border border-[var(--line)]">
              <h3 className="font-bold text-[var(--chalk)] text-sm mb-1 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> Planes de Entrenamiento
              </h3>
              <p>
                Al inicio de cada curso seleccionas tu régimen físico: entrenamiento intensivo para ganar hasta +2.0 de OVR con riesgo de sobrecarga, entrenamiento táctico equilibrado (+0.8 OVR garantizado) o descanso fisioterapéutico para preservar tu físico.
              </p>
            </div>

            <div className="p-3.5 bg-[var(--panel-2)] rounded-xl border border-[var(--line)]">
              <h3 className="font-bold text-[var(--chalk)] text-sm mb-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> Partidos Clave y Finales
              </h3>
              <p>
                Cuando tu club alcanza finales de copas o partidos determinantes de liga, decides tu rol: ser titular desde el inicio para maximizar tu impacto, entrar de revulsivo en la segunda mitad o descansar en el banquillo.
              </p>
            </div>
          </div>

          <p>
            Además, te enfrentarás a preguntas de periodistas en la zona mixta y ruedas de prensa donde tus respuestas afectarán tu estatus de capitán, tu lealtad hacia la afición y tu relación con la directiva del club en este <strong>juego de fútbol online</strong>.
          </p>
        </article>

        {/* SECCIÓN 3: Equipos, jugadores y temporadas */}
        <article id="equipos-jugadores-temporadas" className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--gold)]" />
            Equipos, jugadores y temporadas
          </h2>
          <p>
            La variedad y el realismo son los pilares centrales de la experiencia en <strong>Football Career</strong>:
          </p>

          <div className="space-y-3 text-xs text-[var(--chalk)]">
            <div id="posiciones-detalle" className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
              <h3 className="font-bold text-sm text-[var(--gold)] mb-1">
                Posiciones de los Jugadores
              </h3>
              <p className="text-[var(--muted)]">
                Puedes personalizar a tu futbolista en 8 demarcaciones clave: <strong>Delantero Centro (DC)</strong>, <strong>Extremo (EXT)</strong>, <strong>Mediapunta (MCO)</strong>, <strong>Centrocampista (MED)</strong>, <strong>Pivote Defensivo (MCD)</strong>, <strong>Lateral (LAT)</strong>, <strong>Defensa Central (DFC)</strong> y <strong>Portero (POR)</strong>. Cada posición cuenta con fórmulas adaptadas de goles, asistencias e influencia en el resultado.
              </p>
            </div>

            <div id="equipos-ligas-detalle" className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
              <h3 className="font-bold text-sm text-[var(--gold)] mb-1">
                Clubes, Ligas y Traspasos Internacionales
              </h3>
              <p className="text-[var(--muted)]">
                Compite en las mejores ligas del planeta: LaLiga, Premier League, Serie A, Bundesliga, Ligue 1 y divisiones de ascenso. Al finalizar cada temporada, tu valor de mercado en millones de euros se actualizará y recibirás suculentas ofertas de traspaso o renovaciones con aumento de salario.
              </p>
            </div>

            <div id="temporadas-detalle" className="p-3 bg-[var(--panel-2)] rounded-lg border border-[var(--line)]">
              <h3 className="font-bold text-sm text-[var(--gold)] mb-1">
                Torneos Internacionales y el Balón de Oro
              </h3>
              <p className="text-[var(--muted)]">
                Lidera a tu Selección Nacional en el Mundial, la Eurocopa o la Copa América. Si alcanzas un OVR estelar y conquistas los grandes títulos de la temporada, serás coronado con el Balón de Oro y la Bota de Oro en la Gala Anual de Premios de este <strong>juego de fútbol online</strong>.
              </p>
            </div>
          </div>
        </article>

        {/* SECCIÓN 4: Empieza a jugar */}
        <article id="empieza-a-jugar" className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
          <h2 className="text-lg font-bold text-[var(--chalk)] flex items-center gap-2">
            <Play className="w-5 h-5 text-[var(--gold)] fill-current" />
            Empieza a jugar
          </h2>
          <p>
            ¿Estás listo para escribir tu nombre con letras doradas en la historia del fútbol mundial? Dar tus primeros pasos en <strong>Football Career</strong> es 100% gratuito y no requiere descargas ni instalaciones en tu dispositivo:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[var(--chalk)]">
            <li>Escribe el nombre de tu futbolista y selecciona tu país de origen.</li>
            <li>Elige tu posición natural en el terreno de juego y tu edad inicial de debut.</li>
            <li>Selecciona tu liga de preferencia y club inicial para arrancar la primera temporada.</li>
            <li>¡Toma decisiones clave, entrena, marca goles decisivos y conviértete en una auténtica leyenda del fútbol!</li>
          </ol>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a 
              href="#empieza-a-jugar"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Jugar a Football Career Ahora
            </a>
            <a
              href="/simulador-carrera-futbolistica"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/simulador-carrera-futbolistica");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="btn btn-ghost text-xs px-4 py-2.5 inline-flex items-center gap-1.5 text-[var(--chalk)]"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--gold)]" /> Ver Guía de Simulación
            </a>
          </div>
        </article>

        {/* SECCIÓN 5: Enlaces Externos y Referencias Oficiales del Fútbol */}
        <article className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] space-y-3">
          <h2 className="text-base font-bold text-[var(--chalk)] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--gold)]" />
            Organizaciones y Referencias Oficiales del Fútbol
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Para los amantes de la táctica y la reglamentación que inspiran la simulación de <strong>Football Career</strong>, puedes consultar las fuentes y organismos oficiales del fútbol internacional:
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <a 
              href="https://www.fifa.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[var(--panel-2)] border border-[var(--line)] text-[var(--gold)] hover:text-white transition-colors"
            >
              FIFA Oficial ↗
            </a>
            <a 
              href="https://www.uefa.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[var(--panel-2)] border border-[var(--line)] text-[var(--gold)] hover:text-white transition-colors"
            >
              UEFA Champions League ↗
            </a>
            <a 
              href="https://www.laliga.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[var(--panel-2)] border border-[var(--line)] text-[var(--gold)] hover:text-white transition-colors"
            >
              LaLiga EA Sports ↗
            </a>
            <a 
              href="https://www.premierleague.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[var(--panel-2)] border border-[var(--line)] text-[var(--gold)] hover:text-white transition-colors"
            >
              Premier League Oficial ↗
            </a>
            <a 
              href="https://es.wikipedia.org/wiki/Reglas_del_f%C3%BAtbol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[var(--panel-2)] border border-[var(--line)] text-[var(--gold)] hover:text-white transition-colors"
            >
              Reglas del Fútbol (Wikipedia) ↗
            </a>
          </div>
        </article>

      </div>

      {/* Componente de Compartir en Redes Sociales */}
      <div className="mt-8">
        <ShareBar />
      </div>

      {/* Enlaces Internos Footer */}
      <footer className="mt-6 pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
        <span>© {new Date().getFullYear()} Football Career – Juego de fútbol online</span>
        <div className="flex flex-wrap items-center gap-4">
          <a 
            href="#que-es-football-career"
            onClick={(e) => { e.preventDefault(); scrollToSection("que-es-football-career"); }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            ¿Qué es?
          </a>
          <a 
            href="#como-se-juega"
            onClick={(e) => { e.preventDefault(); scrollToSection("como-se-juega"); }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Cómo jugar
          </a>
          <a 
            href="/simulador-carrera-futbolistica" 
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, "", "/simulador-carrera-futbolistica");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="hover:text-[var(--gold)] transition-colors underline"
          >
            Guía de Simulación
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
            Cómo Funciona
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
            Football Career Game (EN)
          </a>
        </div>
      </footer>
    </section>
  );
};
