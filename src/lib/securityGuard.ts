/**
 * Security Guard & Anti-Tampering Shield for Footcareer
 * 
 * Protects against:
 * - Code inspection via DevTools shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 * - Context menu / Right-click inspection
 * - Cross-Site Scripting (XSS) via robust input sanitization
 * - Reverse engineering and unauthorized tampering
 */

/**
 * Sanitizes user input string against HTML injection, script execution, and malicious payloads
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (typeof input !== "string") return "";

  // Remove control characters and strip HTML tags
  let sanitized = input
    .replace(/<[^>]*>?/gm, "") // Strip any HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: pseudo-protocols
    .replace(/data:/gi, "") // Remove data: URIs
    .replace(/on\w+\s*=/gi, "") // Remove inline event handlers like onclick=, onerror=
    .trim();

  // Enforce boundary length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Escapes characters for safe rendering
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let securityInitialized = false;

/**
 * Initializes client-side anti-inspect and anti-tampering guards
 */
export function initSecurityGuard(): void {
  if (securityInitialized || typeof window === "undefined") return;
  securityInitialized = true;

  // 1. Warning banner in Console to deter self-XSS and unauthorized tampering
  try {
    const bannerStyle1 = "color: #ef4444; font-size: 28px; font-weight: 900; -webkit-text-stroke: 1px black;";
    const bannerStyle2 = "color: #f59e0b; font-size: 15px; font-weight: bold;";
    const bannerStyle3 = "color: #10b981; font-size: 13px;";

    console.log("%c🛡️ ADVERTENCIA DE SEGURIDAD / SECURITY SHIELD", bannerStyle1);
    console.log(
      "%c⚠️ Esta consola es una herramienta técnica. Si alguien te ha pedido copiar y pegar código aquí, es un intento de hackeo o robo de cuenta.",
      bannerStyle2
    );
    console.log(
      "%c✅ Footcareer cuenta con protección activa, encriptación y reglas blindadas en Firestore.",
      bannerStyle3
    );
  } catch {
    // Ignore console errors
  }

  // 2. Block context menu (Right-click)
  window.addEventListener(
    "contextmenu",
    (e) => {
      // Allow right click if user is clicking on an editable input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
      showSecurityToast("🔒 Inspección y menú contextual bloqueados por seguridad.");
    },
    { capture: true }
  );

  // 3. Block DevTools inspection keyboard shortcuts
  window.addEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12 -> DevTools
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityToast("🔒 Acceso a herramientas de desarrollo deshabilitado.");
        return false;
      }

      // Ctrl+Shift+I / Cmd+Opt+I -> Inspect Element
      if (cmdOrCtrl && (e.shiftKey || (isMac && e.altKey)) && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityToast("🔒 Acceso al código fuente bloqueado.");
        return false;
      }

      // Ctrl+Shift+J / Cmd+Opt+J -> DevTools Console
      if (cmdOrCtrl && (e.shiftKey || (isMac && e.altKey)) && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityToast("🔒 Acceso a la consola bloqueado.");
        return false;
      }

      // Ctrl+Shift+C / Cmd+Opt+C -> Element Inspector
      if (cmdOrCtrl && (e.shiftKey || (isMac && e.altKey)) && (e.key === "C" || e.key === "c")) {
        // Only block if not selecting text inside an input
        const target = e.target as HTMLElement | null;
        if (!(target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA"))) {
          e.preventDefault();
          e.stopPropagation();
          showSecurityToast("🔒 Selector de código protegido.");
          return false;
        }
      }

      // Ctrl+U / Cmd+Opt+U -> View Page Source
      if (cmdOrCtrl && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityToast("🔒 Visualización del código fuente no permitida.");
        return false;
      }

      // Ctrl+S / Cmd+S -> Save Page HTML
      if (cmdOrCtrl && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 4. Subtle debugger trap against breakpoint-based memory tampering (non-blocking)
  let lastCheck = Date.now();
  setInterval(() => {
    const now = Date.now();
    // If execution was paused in debugger for > 1500ms
    if (now - lastCheck > 1500) {
      try {
        console.clear();
      } catch {
        // Ignore
      }
    }
    lastCheck = now;
  }, 1000);
}

let toastTimer: any = null;
function showSecurityToast(message: string): void {
  try {
    let toast = document.getElementById("footcareer-security-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "footcareer-security-toast";
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: rgba(16, 26, 22, 0.95);
        color: #e8f0ec;
        border: 1px solid #10b981;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.2);
        padding: 12px 18px;
        border-radius: 10px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.25s ease, transform 0.25s ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (toast) {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
      }
    }, 2800);
  } catch {
    // Ignore DOM errors
  }
}
