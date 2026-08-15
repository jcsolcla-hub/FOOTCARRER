import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

interface ShareBarProps {
  className?: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({ className = "" }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" && window.location.origin 
    ? window.location.origin + "/" 
    : "https://footcarrer.vercel.app/";
  const shareTitle = "Football Career – Juego de fútbol online";
  const shareText = "¡Crea tu futbolista y simula tu carrera profesional en Football Career!";

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
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

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareTitle} - ${shareText} ${shareUrl}`
  )}`;

  return (
    <div className={`p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[var(--panel-2)] border border-[var(--line)] text-[var(--gold)]">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--chalk)] uppercase tracking-wider">
              Comparte Football Career
            </h3>
            <p className="text-[11px] text-[var(--muted)]">
              Invita a tus amigos a jugar al juego de fútbol online en <span className="text-[var(--gold)]">{shareUrl}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="btn btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
              title="Compartir Football Career mediante el navegador"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Compartir</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5 flex-1 sm:flex-initial justify-center text-emerald-400 hover:text-emerald-300"
            title="Compartir Football Career por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="btn btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
            title="Copiar enlace de Football Career"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--ok)]" />
                <span className="text-[var(--ok)]">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span>Copiar enlace</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
