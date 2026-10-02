import { 
  auth, 
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
  authErrorMessage 
} from "./firebase";

export function handleSignInOrLink(provider: any) {
  const currentUser = auth.currentUser;
  const proceed = (currentUser && currentUser.isAnonymous)
    ? linkWithPopup(currentUser, provider)
    : signInWithPopup(auth, provider);

  return proceed.catch((e: any) => {
    if (e && e.code === "auth/credential-already-in-use" && currentUser && currentUser.isAnonymous) {
      return signInWithPopup(auth, provider);
    }
    throw new Error(authErrorMessage(e));
  });
}

export function doGoogleLogin() {
  const provider = new GoogleAuthProvider();
  return handleSignInOrLink(provider);
}

export function doAppleLogin() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  return handleSignInOrLink(provider);
}

export async function doAnonymousLogin(): Promise<any> {
  try {
    const cred = await signInAnonymously(auth);
    localStorage.removeItem("footcareer_guest_session");
    return cred.user;
  } catch (e: any) {
    console.warn("Firebase Auth signInAnonymously no disponible o restringido, activando sesión de invitado local:", e);
    let guestUid = localStorage.getItem("footcareer_guest_uid");
    if (!guestUid) {
      guestUid = "guest_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("footcareer_guest_uid", guestUid);
    }
    const guestUser = {
      uid: guestUid,
      isAnonymous: true,
      displayName: "Jugador Invitado",
      email: null,
      photoURL: null,
      providerData: [],
    };
    localStorage.setItem("footcareer_guest_session", JSON.stringify(guestUser));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("footcareer-guest-auth", { detail: guestUser }));
    }
    return guestUser;
  }
}

export function doEmailLogin(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass).catch((e: any) => {
    throw new Error(authErrorMessage(e));
  });
}

export function doEmailSignup(email: string, pass: string) {
  const currentUser = auth.currentUser;
  const cred = EmailAuthProvider.credential(email, pass);
  const proceed = (currentUser && currentUser.isAnonymous)
    ? linkWithCredential(currentUser, cred)
    : createUserWithEmailAndPassword(auth, email, pass);

  return proceed.catch((e: any) => {
    throw new Error(authErrorMessage(e));
  });
}

export function doPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email).catch((e: any) => {
    throw new Error(authErrorMessage(e));
  });
}

export function doLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("footcareer_guest_session");
    window.dispatchEvent(new CustomEvent("footcareer-guest-auth", { detail: null }));
  }
  return signOut(auth).catch(() => {});
}
