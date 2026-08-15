import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

interface ShareBarProps {
  className?: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({ className = "" }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://footcarrer.vercel.app/";
  const whatsappMessage = `⚽ ¡Prueba Footcarrer! Crea tu carrera futbolística y compite con jugadores y equipos de diferentes épocas.\n${shareUrl}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Footcareer – Juego de fútbol online",
          text: "⚽ ¡Prueba Footcarrer! Crea tu carrera futbolística y compite con jugadores y equipos de diferentes épocas.",
          url: shareUrl,
        });
      } catch {
        // Fallback to copy if user cancels or it fails
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("⚽ ¡Juega a Footcareer! Crea tu propia carrera futbolística y conviértete en leyenda.")}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("⚽ ¡Juega a Footcareer! Simulador de carrera futbolística online.")}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className={`p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[var(--panel-2)] border border-[var(--line)] text-[var(--gold)]">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--chalk)] uppercase tracking-wider">
              Comparte Footcareer (Señales Externas y Comunidad)
            </h3>
            <p className="text-[11px] text-[var(--muted)]">
              Invita a tus amigos y comparte en redes: <span className="text-[var(--gold)]">{shareUrl}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="btn btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5 justify-center"
              title="Compartir Footcareer mediante el navegador"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Compartir</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5 justify-center text-emerald-400 hover:text-emerald-300"
            title="Compartir por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5 justify-center text-sky-400 hover:text-sky-300"
            title="Compartir por Telegram"
          >
            <span>Telegram</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5 justify-center text-slate-200 hover:text-white"
            title="Compartir en X / Twitter"
          >
            <span>X (Twitter)</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5 justify-center text-blue-400 hover:text-blue-300"
            title="Compartir en Facebook"
          >
            <span>Facebook</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="btn btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5 justify-center"
            title="Copiar enlace de Footcareer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--ok)]" />
                <span className="text-[var(--ok)]">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
