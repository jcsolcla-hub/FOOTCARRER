import React, { useState } from "react";
import appIconImg from "../assets/images/footcarrer_app_icon_1786368472328.jpg";
import { User } from "firebase/auth";
import { 
  doGoogleLogin, 
  doAppleLogin, 
  doAnonymousLogin, 
  doEmailLogin, 
  doEmailSignup, 
  doPasswordReset 
} from "../lib/firebaseHelpers";
import { GoogleLogo, AppleLogo } from "./SocialLogos";
import { SeoInfoSection } from "./SeoInfoSection";

interface LoginViewProps {
  currentUser: User | null;
  authError: string | null;
  authBusy: boolean;
  onClearError: () => void;
  showToast: (msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentUser,
  authError,
  authBusy,
  onClearError,
  showToast,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localErr, setLocalErr] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const isLinking = currentUser && currentUser.isAnonymous;

  const handleGoogle = () => {
    setLocalErr(null);
    onClearError();
    setActiveProvider("google");
    doGoogleLogin().catch((err: any) => {
      setLocalErr(err.message || "Error al conectar con Google.");
    }).finally(() => {
      setActiveProvider(null);
    });
  };

  const handleApple = () => {
    setLocalErr(null);
    onClearError();
    setActiveProvider("apple");
    doAppleLogin().catch((err: any) => {
      setLocalErr(err.message || "Error al conectar con Apple.");
    }).finally(() => {
      setActiveProvider(null);
    });
  };

  const handleAnonymous = () => {
    setLocalErr(null);
    onClearError();
    setActiveProvider("guest");
    doAnonymousLogin().catch((err: any) => {
      setLocalErr(err.message || "Error en acceso como invitado.");
    }).finally(() => {
      setActiveProvider(null);
    });
  };

  const handleLogin = () => {
    setLocalErr(null);
    onClearError();
    if (!email.trim() || !password) {
      setLocalErr("Escribe tu email y contraseña.");
      return;
    }
    setActiveProvider("email");
    doEmailLogin(email.trim(), password).finally(() => setActiveProvider(null));
  };

  const handleSignup = () => {
    setLocalErr(null);
    onClearError();
    if (!email.trim() || !password) {
      setLocalErr("Escribe tu email y contraseña.");
      return;
    }
    if (password.length < 6) {
      setLocalErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setActiveProvider("email");
    doEmailSignup(email.trim(), password).finally(() => setActiveProvider(null));
  };

  const handleForgot = () => {
    setLocalErr(null);
    onClearError();
    if (!email.trim()) {
      setLocalErr("Escribe tu email para recuperar la contraseña.");
      return;
    }
    doPasswordReset(email.trim())
      .then(() => showToast("Te hemos enviado un email para restablecer tu contraseña."))
      .catch((err: any) => setLocalErr(err.message || "Error al enviar email."));
  };

  const displayError = localErr || authError;
  const isBusy = authBusy || activeProvider !== null;

  return (
    <div className="auth-wrap">
      <header className="auth-logo">
        <div className="field-mark"></div>
        <img 
          src={appIconImg} 
          alt="FootCarrer - Football Career Simulator Logo" 
          style={{ width: "72px", height: "72px", borderRadius: "16px", objectFit: "cover", margin: "0 auto 10px", border: "2px solid var(--gold)", boxShadow: "0 4px 18px rgba(232, 184, 75, 0.22)" }} 
        />
        <div className="eyebrow">Simulador de Carrera Futbolística · Edición 2026</div>
        <h1>Football Career Simulator</h1>
        <p className="sub" style={{ fontSize: "13px", marginTop: "4px", color: "var(--muted)" }}>
          Simula tu carrera futbolística, ficha por los mejores clubes y conviértete en leyenda.
        </p>
      </header>
      <div className="card">
        {isLinking && (
          <p style={{ color: "var(--muted)", fontSize: "12.5px", marginBottom: "12px", textAlign: "center" }}>
            Estás jugando como invitado. Inicia sesión abajo para <b>vincular</b> tu progreso a una cuenta y no perderlo.
          </p>
        )}
        
        {displayError && (
          <div className="auth-error">
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>{displayError}</div>
            {displayError.toLowerCase().includes("pop") || displayError.toLowerCase().includes("dominio") || displayError.toLowerCase().includes("bloqueado") ? (
              <div style={{ fontSize: "11.5px", marginTop: "6px", opacity: 0.9, lineHeight: 1.35 }}>
                💡 <b>Nota:</b> Si los pop-ups o el dominio de previsualización están bloqueados en Firebase Console, puedes usar <b>"Continuar como invitado"</b> o tu <b>Email</b> para entrar al juego sin problemas.
              </div>
            ) : null}
          </div>
        )}

        <button 
          className="btn-social btn-google" 
          onClick={handleGoogle} 
          disabled={isBusy}
          style={{ opacity: isBusy && activeProvider !== "google" ? 0.6 : 1 }}
        >
          {activeProvider === "google" ? (
            <span className="auth-spin"></span>
          ) : (
            <span className="ico" style={{ display: "flex", alignItems: "center" }}>
              <GoogleLogo size={20} />
            </span>
          )}
          <span>{activeProvider === "google" ? "Conectando con Google..." : "Continuar con Google"}</span>
        </button>

        <button 
          className="btn-social btn-apple" 
          onClick={handleApple} 
          disabled={isBusy}
          style={{ opacity: isBusy && activeProvider !== "apple" ? 0.6 : 1 }}
        >
          {activeProvider === "apple" ? (
            <span className="auth-spin"></span>
          ) : (
            <span className="ico" style={{ display: "flex", alignItems: "center" }}>
              <AppleLogo size={20} fill="#ffffff" />
            </span>
          )}
          <span>{activeProvider === "apple" ? "Conectando con Apple..." : "Continuar con Apple ID"}</span>
        </button>

        <button 
          className="btn-social btn-guest" 
          onClick={handleAnonymous} 
          disabled={isBusy}
          style={{ opacity: isBusy && activeProvider !== "guest" ? 0.6 : 1 }}
        >
          {activeProvider === "guest" ? (
            <span className="auth-spin"></span>
          ) : (
            <span className="ico" style={{ fontSize: "18px" }}>🎮</span>
          )}
          <span>{activeProvider === "guest" ? "Entrando como invitado..." : "Continuar como invitado"}</span>
        </button>

        <div className="auth-divider">o mediante email</div>

        <label htmlFor="auth-email">Email</label>
        <input
          type="text"
          id="auth-email"
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isBusy}
        />
        <label htmlFor="auth-pass">Contraseña</label>
        <input
          type="password"
          id="auth-pass"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isBusy}
        />

        <button className="btn btn-primary btn-block" onClick={handleLogin} disabled={isBusy} style={{ marginTop: "4px" }}>
          {activeProvider === "email" ? "CARGANDO..." : "INICIAR SESIÓN"}
        </button>
        <button className="btn btn-ghost btn-block" onClick={handleSignup} disabled={isBusy} style={{ marginTop: "10px" }}>
          CREAR CUENTA
        </button>

        <div className="auth-links">
          <a onClick={handleForgot} style={{ cursor: "pointer" }}>¿Has olvidado tu contraseña?</a>
        </div>
      </div>

      {/* Guía SEO e información accesible */}
      <div style={{ maxWidth: "860px", margin: "0 auto", width: "100%" }}>
        <SeoInfoSection />
      </div>
    </div>
  );
};

