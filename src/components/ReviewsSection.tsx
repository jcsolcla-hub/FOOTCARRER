import React, { useState, useEffect } from "react";
import { 
  Star, 
  MessageSquare, 
  Send, 
  Trash2, 
  X, 
  PlusCircle,
  AlertCircle,
  LogIn,
  User as UserIcon,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { 
  ReviewItem, 
  subscribeToReviews, 
  fetchReviewsFromFirestore, 
  submitReviewToFirestore, 
  deleteReviewFromFirestore, 
  authenticateWithGoogle 
} from "../lib/reviewsService";
import { auth, signInAnonymously } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { GoogleLogo } from "./SocialLogos";

interface ReviewsSectionProps {
  initialPlayerName?: string;
  initialClub?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  initialPlayerName = "",
  initialClub = "",
  onClose,
  isModal = false,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [authorName, setAuthorName] = useState<string>(
    auth.currentUser?.displayName || initialPlayerName || ""
  );
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  // 1. Escuchar estado de Firebase Authentication
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
      if (usr?.displayName && !authorName) {
        setAuthorName(usr.displayName);
      }
    });
    return () => unsub();
  }, [authorName]);

  // 5 & 6. Suscripción en tiempo real a las reseñas reales de Firestore
  useEffect(() => {
    setLoading(true);
    setFirestoreError(null);

    const unsubscribe = subscribeToReviews(
      (realReviews) => {
        setReviews(realReviews);
        setLoading(false);
        setFirestoreError(null);
      },
      (err: any) => {
        // 10. Si Firestore no está configurado o falla, mostrar el error real de Firebase en la consola
        console.error("Firebase Firestore Error al leer colección 'reviews':", err);
        const msg = err?.message || String(err);
        setFirestoreError(`Error de Firebase: ${msg}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const reloadReviews = async () => {
    setLoading(true);
    setFirestoreError(null);
    try {
      const realReviews = await fetchReviewsFromFirestore();
      setReviews(realReviews);
    } catch (err: any) {
      console.error("Firebase Firestore Error al recargar colección 'reviews':", err);
      setFirestoreError(`Error de Firebase: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const isGoogleUser = Boolean(
    currentUser && currentUser.providerData.some((p) => p.providerId === "google.com")
  );

  // 8. Calcular la valoración media utilizando las reseñas reales de Firestore
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : null;

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, pct };
  });

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === "all") return true;
    return r.rating === filterRating;
  });

  const handleGoogleConnect = async () => {
    setErrorMsg(null);
    setAuthBusy(true);
    try {
      const user = await authenticateWithGoogle();
      setCurrentUser(user);
      if (user.displayName) {
        setAuthorName(user.displayName);
      }
      setSuccessMsg("¡Conectado con tu cuenta de Google! Ahora puedes publicar tu reseña.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Firebase Auth Error:", err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setErrorMsg(`Error al conectar con Google: ${err?.message || err}`);
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleGuestConnect = async () => {
    setErrorMsg(null);
    setAuthBusy(true);
    try {
      const cred = await signInAnonymously(auth);
      setCurrentUser(cred.user);
      setSuccessMsg("Sesión de Firebase Authentication iniciada correctamente.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("Firebase Auth Anonymous Error:", err);
      setErrorMsg(`Error de autenticación: ${err?.message || err}`);
    } finally {
      setAuthBusy(false);
    }
  };

  // 1, 2, 3, 4: Publicar reseña en Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Comprobar que está autenticado con Firebase Authentication
    if (!currentUser) {
      setErrorMsg("Debes identificarte con Firebase Authentication (Google o Invitado) para publicar.");
      return;
    }

    const cleanComment = comment.trim();
    if (!cleanComment) {
      setErrorMsg("Por favor, escribe un comentario.");
      return;
    }
    if (cleanComment.length < 3) {
      setErrorMsg("El comentario debe tener al menos 3 caracteres.");
      return;
    }

    const cleanName = authorName.trim() || currentUser.displayName || (isGoogleUser ? "Usuario de Google" : "Jugador");

    setSubmitting(true);
    try {
      // 2 & 3. Guardar en Firestore ("reviews") y 4. Volver a consultar Firestore
      const updatedList = await submitReviewToFirestore({
        rating,
        comment: cleanComment,
        userName: cleanName
      });

      setReviews(updatedList);
      setSuccessMsg("⭐ ¡Reseña publicada con éxito en Firestore! Ya es visible para todos los jugadores.");
      setComment("");
      setIsFormOpen(false);

      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
    } catch (err: any) {
      // 10. Si Firestore no está configurado o falla, mostrar el error real de Firebase en la consola
      console.error("Firebase Firestore submit error:", err);
      setErrorMsg(`Error de Firebase: ${err?.message || String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 7. Un usuario solamente puede eliminar su propia reseña
  const handleDelete = async (review: ReviewItem) => {
    if (!currentUser) {
      setErrorMsg("Debes haber iniciado sesión para eliminar tu reseña.");
      return;
    }
    if (currentUser.uid !== review.userId) {
      setErrorMsg("Solo puedes eliminar tu propia reseña.");
      return;
    }

    const confirmDelete = window.confirm("¿Seguro que deseas eliminar tu reseña de Firestore?");
    if (!confirmDelete) return;

    setDeletingId(review.id);
    setErrorMsg(null);
    try {
      const updatedList = await deleteReviewFromFirestore(review.id, review.userId);
      setReviews(updatedList);
      setSuccessMsg("Tu reseña ha sido eliminada de Firestore correctamente.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Firebase Firestore delete error:", err);
      setErrorMsg(`Error al eliminar en Firebase: ${err?.message || String(err)}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getFormattedDate = (timestamp: number) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Fecha reciente";
    }
  };

  const content = (
    <div className="reviews-container text-left" style={{ color: "var(--chalk)" }}>
      {/* Cabecera de la sección */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div>
          <div style={{
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            color: "var(--gold)",
            marginBottom: "3px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}>
            <Sparkles size={12} />
            <span>Firebase Firestore · Colección "reviews"</span>
          </div>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 900,
            margin: 0,
            color: "var(--chalk)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>Reseñas de la Comunidad</span>
            <button
              type="button"
              onClick={reloadReviews}
              title="Recargar reseñas desde Firestore"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: "4px",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!isFormOpen && (
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(true);
                setErrorMsg(null);
              }}
              className="btn btn-primary"
              style={{
                padding: "8px 14px",
                fontSize: "12.5px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 800
              }}
            >
              <PlusCircle size={15} />
              <span>Escribir Reseña</span>
            </button>
          )}

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: "6px", borderRadius: "50%", color: "var(--muted)" }}
              title="Cerrar"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Alerta de Error de Firebase si falla la conexión */}
      {firestoreError && (
        <div style={{
          background: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "16px",
          color: "#fca5a5",
          fontSize: "12.5px",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px"
        }}>
          <AlertCircle size={17} className="shrink-0 mt-0.5 text-red-400" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>Error al conectar con Firebase Firestore:</div>
            <div>{firestoreError}</div>
            <div style={{ fontSize: "11px", color: "#f87171", marginTop: "4px" }}>
              Revisa la consola del navegador para ver el registro detallado del error.
            </div>
          </div>
        </div>
      )}

      {/* Notificación de Éxito */}
      {successMsg && (
        <div style={{
          background: "rgba(16, 185, 129, 0.2)",
          border: "1px solid rgba(16, 185, 129, 0.5)",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "16px",
          color: "#6ee7b7",
          fontSize: "13px",
          fontWeight: 600
        }}>
          {successMsg}
        </div>
      )}

      {/* 8. Resumen de Valoración Media (calculada solo con datos de Firestore) */}
      <div style={{
        background: "rgba(18, 26, 21, 0.85)",
        border: "1px solid var(--line)",
        borderRadius: "14px",
        padding: "16px",
        marginBottom: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        alignItems: "center"
      }}>
        {/* Puntuación Media */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "center", minWidth: "85px" }}>
            <div style={{
              fontSize: "36px",
              fontWeight: 900,
              lineHeight: 1,
              color: avgRating ? "var(--gold)" : "var(--muted)"
            }}>
              {avgRating ? avgRating : "—"}
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "2px",
              marginTop: "4px",
              color: "var(--gold)"
            }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={13}
                  className={avgRating && s <= Math.round(Number(avgRating)) ? "fill-current" : "opacity-30"}
                />
              ))}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
              {totalReviews === 0 ? "0 reseñas" : totalReviews === 1 ? "1 reseña" : `${totalReviews} reseñas`}
            </div>
          </div>

          <div style={{ flex: 1, borderLeft: "1px solid var(--line)", paddingLeft: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--chalk)" }}>
              {totalReviews > 0 ? "Valoración media de jugadores" : "Base de datos vacía"}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px" }}>
              {totalReviews > 0
                ? "Calculada en tiempo real a partir de las reseñas reales en Firebase Firestore."
                : "No hay reseñas aún en Firestore. Las valoraciones se calcularán automáticamente al publicar la primera."}
            </div>
          </div>
        </div>

        {/* Barras de distribución de estrellas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {ratingCounts.map(({ stars, count, pct }) => (
            <div
              key={stars}
              onClick={() => setFilterRating(filterRating === stars ? "all" : stars)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: "4px",
                background: filterRating === stars ? "rgba(232, 184, 75, 0.1)" : "transparent"
              }}
              title={`Filtrar por ${stars} estrellas`}
            >
              <span style={{ width: "24px", color: "var(--muted)", textAlign: "right" }}>{stars}★</span>
              <div style={{
                flex: 1,
                height: "6px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "var(--gold)",
                  borderRadius: "3px",
                  transition: "width 0.3s ease"
                }} />
              </div>
              <span style={{ width: "28px", color: "var(--muted)", textAlign: "right" }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de Publicación */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(20, 29, 23, 0.95)",
            border: "1.5px solid var(--gold)",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "22px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 800, margin: 0, color: "var(--gold)", display: "flex", alignItems: "center", gap: "6px" }}>
              <MessageSquare size={16} />
              <span>Publicar Reseña Real en Firestore</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* 1. Comprobación de Firebase Authentication */}
          <div style={{
            background: "rgba(0,0,0,0.25)",
            border: "1px solid var(--line)",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "14px"
          }}>
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--gold)" }}
                    />
                  ) : (
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(232, 184, 75, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--gold)"
                    }}>
                      <UserIcon size={16} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--chalk)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{authorName || currentUser.displayName || "Jugador Autenticado"}</span>
                      {isGoogleUser && (
                        <span style={{ fontSize: "9.5px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "1px 5px", borderRadius: "4px" }}>
                          ✓ Google Verificado
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                      UID: <span style={{ fontFamily: "monospace" }}>{currentUser.uid.slice(0, 10)}...</span> · Autenticado en Firebase
                    </div>
                  </div>
                </div>

                {!isGoogleUser && (
                  <button
                    type="button"
                    onClick={handleGoogleConnect}
                    disabled={authBusy}
                    className="btn btn-secondary"
                    style={{
                      padding: "5px 12px",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#fff",
                      color: "#202124",
                      fontWeight: 700
                    }}
                  >
                    <GoogleLogo size={13} />
                    <span>{authBusy ? "Conectando..." : "Vincular con Google"}</span>
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "12px", color: "var(--chalk)", fontWeight: 600 }}>
                  ⚠️ Se requiere autenticación con Firebase para registrar la reseña:
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleGoogleConnect}
                    disabled={authBusy}
                    className="btn"
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#fff",
                      color: "#202124",
                      fontWeight: 700
                    }}
                  >
                    <GoogleLogo size={14} />
                    <span>{authBusy ? "Conectando..." : "Iniciar con Google"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGuestConnect}
                    disabled={authBusy}
                    className="btn btn-ghost"
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <LogIn size={13} />
                    <span>Continuar como invitado</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "8px",
              padding: "8px 12px",
              marginBottom: "12px",
              color: "#f87171",
              fontSize: "12px"
            }}>
              {errorMsg}
            </div>
          )}

          {/* Selector de Estrellas (1 a 5) */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, marginBottom: "5px" }}>
              Puntuación (1 a 5 estrellas) *:
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = (hoverRating || rating) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "3px",
                      color: isFilled ? "var(--gold)" : "rgba(255,255,255,0.2)",
                      transition: "transform 0.1s ease"
                    }}
                  >
                    <Star size={26} className={isFilled ? "fill-current" : ""} />
                  </button>
                );
              })}
              <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--gold)", marginLeft: "6px" }}>
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          {/* Nombre */}
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="review-author" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
              Nombre a mostrar:
            </label>
            <input
              id="review-author"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Tu nombre o apodo"
              maxLength={40}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--line)",
                color: "var(--chalk)",
                fontSize: "13px"
              }}
            />
          </div>

          {/* Comentario */}
          <div style={{ marginBottom: "14px" }}>
            <label htmlFor="review-comment" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
              Tu comentario sobre el juego *:
            </label>
            <textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu opinión sincera sobre Footcareer..."
              maxLength={600}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--line)",
                color: "var(--chalk)",
                fontSize: "13px",
                resize: "vertical"
              }}
            />
            <div style={{ fontSize: "11px", color: "var(--muted)", textAlign: "right", marginTop: "2px" }}>
              {comment.length} / 600 caracteres
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="btn btn-ghost"
              style={{ fontSize: "12.5px", padding: "7px 14px" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !currentUser}
              className="btn btn-primary"
              style={{
                fontSize: "12.5px",
                padding: "7px 16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 800
              }}
            >
              <Send size={14} />
              <span>{submitting ? "Guardando en Firestore..." : "Publicar Reseña"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Barra de Filtros */}
      {totalReviews > 0 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "14px",
          flexWrap: "wrap"
        }}>
          <span style={{ fontSize: "11.5px", color: "var(--muted)", marginRight: "4px" }}>Filtrar:</span>
          <button
            type="button"
            onClick={() => setFilterRating("all")}
            className={`btn ${filterRating === "all" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "14px" }}
          >
            Todas ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map((st) => {
            const cnt = reviews.filter((r) => r.rating === st).length;
            if (cnt === 0) return null;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterRating(st)}
                className={`btn ${filterRating === st ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "14px" }}
              >
                {st}★ ({cnt})
              </button>
            );
          })}
        </div>
      )}

      {/* 9. Lista de Reseñas: NO mostrar ninguna reseña de ejemplo si Firestore está vacío */}
      {loading ? (
        <div style={{
          textAlign: "center",
          padding: "36px 16px",
          color: "var(--muted)",
          fontSize: "13px",
          background: "rgba(18, 26, 21, 0.4)",
          borderRadius: "12px",
          border: "1px dashed var(--line)"
        }}>
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[var(--gold)]" />
          <span>Consultando reseñas reales en Firestore...</span>
        </div>
      ) : totalReviews === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "36px 20px",
          background: "rgba(18, 26, 21, 0.4)",
          borderRadius: "14px",
          border: "1px dashed var(--line)",
          color: "var(--muted)"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>⭐</div>
          <div style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--chalk)", marginBottom: "4px" }}>
            Aún no hay reseñas registradas en Firestore
          </div>
          <p style={{ fontSize: "12.5px", maxWidth: "420px", margin: "0 auto 16px", lineHeight: 1.5 }}>
            Todas las opiniones aquí son 100% reales. ¡Sé el primer jugador de la comunidad en compartir tu experiencia!
          </p>
          <button
            type="button"
            onClick={() => {
              setIsFormOpen(true);
              setErrorMsg(null);
            }}
            className="btn btn-primary"
            style={{ padding: "8px 16px", fontSize: "12.5px", fontWeight: 800 }}
          >
            Sé el primero en dejar una reseña
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredReviews.map((rev) => {
            const isMyReview = Boolean(currentUser && currentUser.uid === rev.userId);
            return (
              <div
                key={rev.id}
                style={{
                  background: isMyReview ? "rgba(232, 184, 75, 0.05)" : "rgba(18, 26, 21, 0.8)",
                  border: `1px solid ${isMyReview ? "rgba(232, 184, 75, 0.4)" : "var(--line)"}`,
                  borderRadius: "12px",
                  padding: "14px 16px",
                  transition: "background 0.15s ease"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {rev.authorPhoto ? (
                      <img
                        src={rev.authorPhoto}
                        alt={rev.userName}
                        referrerPolicy="no-referrer"
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: isMyReview ? "var(--gold)" : "rgba(255,255,255,0.1)",
                        color: isMyReview ? "#000" : "var(--chalk)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 800
                      }}>
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--chalk)" }}>
                          {rev.userName}
                        </span>
                        {isMyReview && (
                          <span style={{ fontSize: "9.5px", background: "var(--gold)", color: "#000", padding: "1px 5px", borderRadius: "4px", fontWeight: 800 }}>
                            Mi Reseña
                          </span>
                        )}
                        {rev.isGoogleUser && !isMyReview && (
                          <span style={{ fontSize: "9.5px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "1px 5px", borderRadius: "4px" }}>
                            ✓ Google Verificado
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                        {getFormattedDate(rev.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Estrellas y botón de eliminar (solo si es el autor) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "2px", color: "var(--gold)" }}>
                      {[1, 2, 3, 4, 5].map((st) => (
                        <Star
                          key={st}
                          size={14}
                          className={st <= rev.rating ? "fill-current" : "opacity-25"}
                        />
                      ))}
                    </div>

                    {/* 7. Un usuario solamente puede eliminar su propia reseña */}
                    {isMyReview && (
                      <button
                        type="button"
                        onClick={() => handleDelete(rev)}
                        disabled={deletingId === rev.id}
                        className="btn btn-ghost"
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          color: "#f87171",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "6px"
                        }}
                        title="Eliminar mi reseña de Firestore"
                      >
                        <Trash2 size={12} />
                        <span>{deletingId === rev.id ? "Eliminando..." : "Eliminar"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Texto del comentario */}
                <p style={{
                  fontSize: "13px",
                  color: "var(--chalk)",
                  margin: 0,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap"
                }}>
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px"
      }}>
        <div style={{
          background: "var(--panel)",
          border: "1.5px solid var(--line)",
          borderRadius: "18px",
          maxWidth: "760px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 16px 50px rgba(0, 0, 0, 0.6)"
        }}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--panel)",
      border: "1px solid var(--line)",
      borderRadius: "16px",
      padding: "20px"
    }}>
      {content}
    </div>
  );
};
