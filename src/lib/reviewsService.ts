import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc,
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  linkWithPopup,
  User 
} from "firebase/auth";
import { db, auth } from "./firebase";
import { sanitizeInput } from "./securityGuard";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  // 10. Si Firestore no está configurado o falla, mostrar el error real de Firebase en la consola
  console.error("Firebase Firestore Error (reviews):", JSON.stringify(errInfo, null, 2), error);
}

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string; // nombre del usuario
  rating: number; // 1 to 5
  comment: string; // comentario
  createdAt: number; // timestamp ms para visualización
  authorPhoto?: string | null;
  isGoogleUser?: boolean;
}

// Limpiar cualquier residuo de almacenamiento local de versiones previas
if (typeof window !== "undefined") {
  try {
    const keysToRemove = [
      "footcarrer_inapp_reviews_v2",
      "footcarrer_inapp_reviews_v1",
      "footcarrer_seed_reviews",
      "footcarrer_real_google_reviews_v3",
      "footcarrer_reviews_cache"
    ];
    keysToRemove.forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  } catch {
    // Ignorar excepciones de storage
  }
}

/**
 * Autenticación oficial con Google mediante Firebase Auth
 */
export async function authenticateWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.isAnonymous) {
    try {
      const cred = await linkWithPopup(currentUser, provider);
      return cred.user;
    } catch (err: any) {
      if (err.code === "auth/credential-already-in-use") {
        const cred = await signInWithPopup(auth, provider);
        return cred.user;
      }
      throw err;
    }
  }

  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

/**
 * 4 & 5. Consulta directa de las reseñas reales almacenadas en Firestore ("reviews")
 * 9. No mostrar ninguna reseña de ejemplo si Firestore está vacío.
 */
export async function fetchReviewsFromFirestore(): Promise<ReviewItem[]> {
  const path = "reviews";
  try {
    const colRef = collection(db, path);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((d) => {
      const data = d.data();
      let createdMs = Date.now();
      if (data.createdAt instanceof Timestamp) {
        createdMs = data.createdAt.toMillis();
      } else if (data.createdAt?.seconds) {
        createdMs = data.createdAt.seconds * 1000;
      } else if (typeof data.createdAt === "number") {
        createdMs = data.createdAt;
      }

      return {
        id: d.id,
        userId: data.userId || "",
        userName: data.userName || data.nombre || "Usuario",
        rating: Math.max(1, Math.min(5, Number(data.rating) || 5)),
        comment: data.comment || data.comentario || "",
        createdAt: createdMs,
        authorPhoto: data.authorPhoto || null,
        isGoogleUser: Boolean(data.isGoogleUser)
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

/**
 * 6. Suscripción en tiempo real: Todos los usuarios ven las reseñas reales en Firestore
 */
export function subscribeToReviews(
  onUpdate: (reviews: ReviewItem[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const path = "reviews";
  try {
    const colRef = collection(db, path);
    const q = query(colRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate([]);
          return;
        }

        const items: ReviewItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          let createdMs = Date.now();
          if (data.createdAt instanceof Timestamp) {
            createdMs = data.createdAt.toMillis();
          } else if (data.createdAt?.seconds) {
            createdMs = data.createdAt.seconds * 1000;
          } else if (typeof data.createdAt === "number") {
            createdMs = data.createdAt;
          }

          return {
            id: d.id,
            userId: data.userId || "",
            userName: data.userName || data.nombre || "Usuario",
            rating: Math.max(1, Math.min(5, Number(data.rating) || 5)),
            comment: data.comment || data.comentario || "",
            createdAt: createdMs,
            authorPhoto: data.authorPhoto || null,
            isGoogleUser: Boolean(data.isGoogleUser)
          };
        });

        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

/**
 * 1. Comprobar que está autenticado con Firebase Authentication.
 * 2. Guardar la reseña en una colección de Firestore llamada "reviews".
 * 3. Guardar: userId, nombre del usuario, rating de 1 a 5, comentario, createdAt con serverTimestamp().
 * 4. Después de publicarla, volver a consultar Firestore.
 */
export async function submitReviewToFirestore(params: {
  rating: number;
  comment: string;
  userName?: string;
}): Promise<ReviewItem[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Debes estar autenticado con Firebase Authentication para publicar una reseña.");
  }

  const cleanComment = sanitizeInput(params.comment, 500);
  if (!cleanComment) {
    throw new Error("El comentario no puede estar vacío.");
  }

  const isGoogle = Boolean(
    currentUser.providerData.some((p) => p.providerId === "google.com")
  );

  const rawName = params.userName?.trim() || currentUser.displayName || (isGoogle ? "Usuario de Google" : "Jugador");
  const finalName = sanitizeInput(rawName, 60) || "Jugador";

  const rating = Math.max(1, Math.min(5, Math.round(params.rating)));

  const path = "reviews";
  try {
    const colRef = collection(db, path);
    await addDoc(colRef, {
      userId: currentUser.uid,
      userName: finalName,
      nombre: finalName,
      rating,
      comment: cleanComment,
      comentario: cleanComment,
      createdAt: serverTimestamp(),
      authorPhoto: currentUser.photoURL || null,
      isGoogleUser: isGoogle
    });

    // 4. Volver a consultar Firestore después de publicar
    return await fetchReviewsFromFirestore();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * 7. Un usuario solamente puede eliminar su propia reseña de Firestore
 */
export async function deleteReviewFromFirestore(reviewId: string, reviewUserId: string): Promise<ReviewItem[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Debes iniciar sesión para eliminar una reseña.");
  }
  if (currentUser.uid !== reviewUserId) {
    throw new Error("Solo puedes eliminar tu propia reseña.");
  }

  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
    // Volver a consultar Firestore después de eliminar
    return await fetchReviewsFromFirestore();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// Aliases para máxima compatibilidad con código existente
export type RealReviewItem = ReviewItem;
export const submitRealReview = async (params: {
  rating: number;
  comment: string;
  authorName?: string;
  club?: string;
  user?: User | null;
}) => {
  const list = await submitReviewToFirestore({
    rating: params.rating,
    comment: params.comment,
    userName: params.authorName,
  });
  return list[0];
};
export const subscribeToRealReviews = subscribeToReviews;
export const deleteRealReview = deleteReviewFromFirestore;
