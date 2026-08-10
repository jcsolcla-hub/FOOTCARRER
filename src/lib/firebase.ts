import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider, 
  EmailAuthProvider,
  signInWithPopup, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  linkWithPopup,
  linkWithCredential,
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAD4c2NEI-XJuzKqr6NJw5OoZoK-YLElHo",
  authDomain: "footlife-bfcc7.firebaseapp.com",
  projectId: "footlife-bfcc7",
  storageBucket: "footlife-bfcc7.firebasestorage.app",
  messagingSenderId: "431303758783",
  appId: "1:431303758783:web:7777e321f1ef7708c2070a",
  measurementId: "G-4DGKJKXGKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Analytics initialization skipped:", e);
      }
    }
  });
}

export function authErrorMessage(err: any): string {
  if (!err) return "Ha ocurrido un error inesperado.";
  const code = err.code || "";
  const map: Record<string, string> = {
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/user-not-found": "No existe ninguna cuenta con ese email.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-email": "El email no es válido.",
    "auth/popup-closed-by-user": "Has cerrado la ventana antes de completar el inicio de sesión.",
    "auth/cancelled-popup-request": "Solicitud de inicio de sesión cancelada.",
    "auth/popup-blocked": "El navegador ha bloqueado la ventana emergente. Permite pop-ups para continuar.",
    "auth/operation-not-allowed": "Este método de acceso no está activado en Firebase Console.",
    "auth/credential-already-in-use": "Esa cuenta ya está vinculada a otro usuario.",
    "auth/network-request-failed": "Error de red. Comprueba tu conexión.",
    "auth/unauthorized-domain": "Este dominio no está autorizado en Firebase Console (Authentication → Settings → Authorized domains).",
  };
  return map[code] || err.message || "Ha ocurrido un error inesperado.";
}

export async function ensureUserDoc(user: User) {
  try {
    const userRef = doc(db, "users", user.uid);
    const method = user.providerData.length ? user.providerData[0].providerId : "anonymous";
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || null,
      nombre: user.displayName || null,
      fotoPerfil: user.photoURL || null,
      metodoAuth: method,
      ultimoAcceso: serverTimestamp(),
    }, { merge: true });

    const snap = await getDoc(userRef);
    if (!snap.exists() || !snap.data()?.fechaCreacion) {
      await setDoc(userRef, { fechaCreacion: serverTimestamp() }, { merge: true });
    }
  } catch (e) {
    console.warn("No se pudo actualizar el perfil en Firestore:", e);
  }
}

export async function syncCareerToFirestore(user: User | null, state: any) {
  if (!user || !state) return;
  try {
    const careerRef = doc(db, "users", user.uid, "career", "main");
    await setDoc(careerRef, {
      data: state,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn("No se pudo sincronizar la partida con Firestore:", e);
  }
}

export async function loadCareerFromFirestore(uid: string): Promise<any | null> {
  try {
    const careerRef = doc(db, "users", uid, "career", "main");
    const snap = await getDoc(careerRef);
    if (snap.exists() && snap.data()?.data) {
      return snap.data().data;
    }
  } catch (e) {
    console.warn("No se pudo leer Firestore:", e);
  }
  return null;
}

export async function deleteCareerFromFirestore(uid: string) {
  try {
    const careerRef = doc(db, "users", uid, "career", "main");
    await deleteDoc(careerRef);
  } catch (e) {
    console.warn("No se pudo borrar la carrera de Firestore:", e);
  }
}

export {
  GoogleAuthProvider,
  OAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  linkWithPopup,
  linkWithCredential,
  onAuthStateChanged
};
