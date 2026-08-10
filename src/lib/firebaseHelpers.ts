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

export function doAnonymousLogin() {
  return signInAnonymously(auth).catch((e: any) => {
    throw new Error(authErrorMessage(e));
  });
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
  return signOut(auth);
}
