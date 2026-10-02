import React, { useState, useEffect } from "react";
import { Star, ExternalLink, ThumbsUp, X, Check, MessageSquare, Sparkles } from "lucide-react";
import { GoogleLogo } from "./SocialLogos";
import { submitRealReview } from "../lib/reviewsService";

export const GOOGLE_REVIEW_STORAGE_KEY = "footcarrer_review_prompt_v2";
export const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=Footcareer+juego+de+futbol+online+rese%C3%B1as#lrd=0x0:0x0,3";

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: "ask" | "rate";
  onReviewed?: (rating: number, comment?: string) => void;
}

export const GoogleReviewModal: React.FC<GoogleReviewModalProps> = ({
  isOpen,
  onClose,
  initialStep = "ask",
  onReviewed,
}) => {
  const [step, setStep] = useState<"ask" | "rate" | "thankyou">(initialStep);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hasOpenedGoogle, setHasOpenedGoogle] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setHasOpenedGoogle(false);
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const handleSayNo = () => {
    try {
      localStorage.setItem(
        GOOGLE_REVIEW_STORAGE_KEY,
        JSON.stringify({
          status: "dismissed_no",
          timestamp: Date.now(),
        })
      );
    } catch {
      // safe fallback
    }
    onClose();
  };

  const handleSayYes = () => {
    setStep("rate");
  };

  const handleOpenGoogle = () => {
    setHasOpenedGoogle(true);
    window.open(GOOGLE_REVIEWS_URL, "_blank", "noopener,noreferrer");
  };

  const handleSubmitReview = () => {
    try {
      localStorage.setItem(
        GOOGLE_REVIEW_STORAGE_KEY,
        JSON.stringify({
          status: "completed",
          rating,
          comment: comment.trim(),
          timestamp: Date.now(),
        })
      );
    } catch {
      // safe fallback
    }

    // If user provided feedback, register in real community reviews via Firebase
    if (comment.trim()) {
      submitRealReview({
        rating,
        comment: comment.trim(),
      }).catch(() => {});
    }

    if (onReviewed) {
      onReviewed(rating, comment.trim());
    }
    setStep("thankyou");
    setTimeout(() => {
      onClose();
    }, 2400);
  };

  const handleCloseOnly = () => {
    try {
      localStorage.setItem(
        GOOGLE_REVIEW_STORAGE_KEY,
        JSON.stringify({
          status: "postponed",
          timestamp: Date.now(),
        })
      );
    } catch {
      // safe fallback
    }
    onClose();
  };

  const ratingDescriptions: Record<number, string> = {
    5: "⭐⭐⭐⭐⭐ ¡5/5! ¡Juegazo legendario!",
    4: "⭐⭐⭐⭐☆ ¡4/5! ¡Muy buena experiencia!",
    3: "⭐⭐⭐☆☆ ¡3/5! Buen juego, con margen de mejora",
    2: "⭐⭐☆☆☆ ¡2/5! Necesita más funciones",
    1: "⭐☆☆☆☆ ¡1/5! No me ha convencido",
  };

  return (
    <div className="modal-backdrop" onClick={handleCloseOnly} style={{ zIndex: 90 }}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: "460px",
          border: "1px solid rgba(232, 184, 75, 0.35)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(232, 184, 75, 0.12)",
          position: "relative"
        }}
      >
        {/* Close button in corner */}
        <button
          onClick={handleCloseOnly}
          className="btn-ghost"
          aria-label="Cerrar modal"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            padding: "6px",
            borderRadius: "50%",
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: ¿Te está gustando FootCarrer? */}
        {step === "ask" && (
          <div>
            <div style={{ position: "relative", display: "inline-block", marginBottom: "8px" }}>
              <div 
                style={{ 
                  fontSize: "48px", 
                  lineHeight: 1, 
                  filter: "drop-shadow(0 4px 12px rgba(232, 184, 75, 0.45))" 
                }}
              >
                ⭐
              </div>
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: "10px 0 8px", color: "var(--chalk)" }}>
              ¿Te está gustando FootCarrer?
            </h2>

            <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.5", marginBottom: "22px" }}>
              Tu opinión como futbolista es vital para nosotros. ¿Estás disfrutando de tu carrera y superando tus temporadas?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                className="btn btn-primary btn-block"
                onClick={handleSayYes}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "15px",
                  padding: "12px 18px",
                  background: "linear-gradient(135deg, var(--gold), #f3a824)",
                  color: "#08120e",
                  fontWeight: "bold"
                }}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>¡Sí, me encanta!</span>
              </button>

              <button
                className="btn btn-ghost btn-block"
                onClick={handleSayNo}
                style={{
                  color: "var(--muted)",
                  fontSize: "13px",
                  padding: "10px 16px",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                No mucho / Aún no
              </button>
            </div>

            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "var(--muted)" }}>
              <GoogleLogo size={14} />
              <span>Valoraciones de la comunidad FootCarrer</span>
            </div>
          </div>
        )}

        {/* STEP 2: Rate & Google Review */}
        {step === "rate" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ 
                background: "rgba(232, 184, 75, 0.15)", 
                border: "1px solid rgba(232, 184, 75, 0.3)", 
                borderRadius: "50%", 
                padding: "10px", 
                color: "var(--gold)" 
              }}>
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <h2 style={{ fontSize: "21px", fontWeight: "bold", margin: "6px 0 6px", color: "var(--chalk)" }}>
              ¡Nos alegra un montón! ⭐
            </h2>

            <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.45", marginBottom: "18px" }}>
              ¿Nos dejas una valoración? Nos ayuda muchísimo a que más futbolistas descubran FootCarrer y a seguir añadiendo ligas y torneos.
            </p>

            {/* Interactive Stars */}
            <div style={{ 
              background: "rgba(0, 0, 0, 0.25)", 
              borderRadius: "14px", 
              padding: "14px 12px", 
              border: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "16px"
            }}>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Selecciona tu puntuación
              </div>
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: "8px", 
                  marginBottom: "8px",
                  cursor: "pointer"
                }}
              >
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const active = (hoverRating || rating) >= starIndex;
                  return (
                    <button
                      key={starIndex}
                      type="button"
                      onMouseEnter={() => setHoverRating(starIndex)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starIndex)}
                      aria-label={`Calificar con ${starIndex} estrellas`}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "4px",
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
                        transform: active ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      <Star
                        className="w-7 h-7"
                        fill={active ? "var(--gold)" : "none"}
                        color={active ? "var(--gold)" : "rgba(255, 255, 255, 0.25)"}
                      />
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--gold)", minHeight: "18px" }}>
                {ratingDescriptions[hoverRating || rating]}
              </div>
            </div>

            {/* Google Review Primary Button */}
            <div style={{ marginBottom: "14px" }}>
              <button
                type="button"
                className="btn btn-block"
                onClick={handleOpenGoogle}
                style={{
                  background: "#ffffff",
                  color: "#1f1f1f",
                  border: "1px solid #e2e8f0",
                  fontWeight: "bold",
                  fontSize: "14px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.28)",
                  transition: "all 0.2s ease"
                }}
              >
                <GoogleLogo size={20} />
                <span>Dejar reseña en Google</span>
                <span style={{ color: "#d97706", fontSize: "13px", letterSpacing: "1px" }}>★★★★★</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 ml-1" />
              </button>
              {hasOpenedGoogle && (
                <div style={{ fontSize: "11px", color: "var(--ok)", marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <Check className="w-3 h-3" />
                  <span>¡Página de Google abierta en una nueva pestaña!</span>
                </div>
              )}
            </div>

            {/* Optional Comment Input */}
            <div style={{ marginBottom: "14px", textAlign: "left" }}>
              <label 
                htmlFor="review-comment" 
                style={{ 
                  fontSize: "11px", 
                  color: "var(--muted)", 
                  marginBottom: "4px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px" 
                }}
              >
                <MessageSquare className="w-3 h-3 text-[var(--gold)]" />
                <span>Mensaje o sugerencia para la próxima temporada (opcional):</span>
              </label>
              <textarea
                id="review-comment"
                rows={2}
                maxLength={300}
                placeholder="Ej. ¡Me encanta! Añadid más opciones de fichajes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: "13px",
                  padding: "8px 10px",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  color: "var(--chalk)",
                  resize: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitReview}
                style={{
                  flex: 2,
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, var(--green), #1bb562)",
                  color: "#ffffff"
                }}
              >
                Guardar valoración
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCloseOnly}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "var(--muted)"
                }}
              >
                Más tarde
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Thank you confirmation */}
        {step === "thankyou" && (
          <div style={{ padding: "10px 0" }}>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "50%", 
              background: "rgba(22, 163, 74, 0.2)", 
              border: "2px solid var(--ok)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto 14px", 
              color: "var(--ok)" 
            }}>
              <Check className="w-8 h-8" />
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--chalk)", marginBottom: "8px" }}>
              ¡Muchísimas gracias! 🙌
            </h2>

            <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.5", marginBottom: "16px" }}>
              Tu apoyo significa el mundo para todo el equipo de FootCarrer. ¡A por la gloria en tu próxima temporada!
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "4px", color: "var(--gold)", fontSize: "20px" }}>
              {"★".repeat(rating)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Permanent Google Review Button with Google Logo and 5 Stars
 * Always available whenever the page loads.
 */
export const GoogleReviewBadgeButton: React.FC<{
  onClick: () => void;
  variant?: "header" | "floating" | "banner";
  className?: string;
}> = ({ onClick, variant = "header", className = "" }) => {
  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 bg-[#0c1813]/90 hover:bg-[#12241d] text-white border border-[var(--gold)]/40 hover:border-[var(--gold)] rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-105 group ${className}`}
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(232, 184, 75, 0.18)",
        }}
        title="Ver y dejar reseñas en Google"
        aria-label="Dejar reseña en Google"
      >
        <div className="p-1 rounded-full bg-white flex items-center justify-center shadow-xs">
          <GoogleLogo size={14} />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--gold)]">
            <span>4.9</span>
            <span className="tracking-tighter">★★★★★</span>
          </div>
          <span className="text-[10px] text-gray-300 group-hover:text-white hidden sm:inline">
            Reseñas Google
          </span>
        </div>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div 
        onClick={onClick}
        className={`cursor-pointer p-3 rounded-xl bg-gradient-to-r from-[#12241d] to-[#0a1612] border border-[var(--gold)]/30 hover:border-[var(--gold)] flex items-center justify-between gap-3 shadow-md transition-all hover:translate-y-[-1px] ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white shadow-xs">
            <GoogleLogo size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Reseñas en Google</span>
              <span className="text-xs font-black text-[var(--gold)] tracking-tight">4.9 ★★★★★</span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              ¡Dinos qué te parece FootCarrer y apoya el juego online!
            </p>
          </div>
        </div>
        <div className="btn btn-secondary text-xs px-2.5 py-1 text-[var(--gold)] font-bold whitespace-nowrap">
          Opinar ⭐
        </div>
      </div>
    );
  }

  // Header button by default
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-2.5 hover:bg-white/10 rounded-lg transition-colors border border-[var(--gold)]/30 ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        color: "var(--chalk)"
      }}
      title="Dejar una reseña en Google"
      aria-label="Reseñas en Google"
    >
      <div className="p-0.5 rounded bg-white flex items-center justify-center">
        <GoogleLogo size={13} />
      </div>
      <span className="font-semibold text-[11px] hidden sm:inline">Reseñas</span>
      <span className="text-[var(--gold)] text-xs tracking-tight">★★★★★</span>
      <span className="text-[10px] text-[var(--gold)] font-bold hidden md:inline">4.9</span>
    </button>
  );
};
