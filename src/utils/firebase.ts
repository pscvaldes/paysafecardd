import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDocs,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDiqfBF9OylhdY_XtkOfYhYx6BwV8hX0c8",
  authDomain: "pscapp-71c56.firebaseapp.com",
  projectId: "pscapp-71c56",
  storageBucket: "pscapp-71c56.firebasestorage.app",
  messagingSenderId: "828730008367",
  appId: "1:828730008367:web:7f6dfc8b7f75d8a57d77da",
  measurementId: "G-TFMEG2NNYC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection reference
const COLLECTION_NAME = "verifications";
const verificationsRef = collection(db, COLLECTION_NAME);

export interface FirebaseVerification {
  code: string;
  amount: string;
  currency: string;
  email: string;
  emailStatus: "success" | "failed";
  date: string;
  timestamp: number;
}

// Add a verification record (ensures auth first)
export async function addVerification(
  record: Omit<FirebaseVerification, "date" | "timestamp">
): Promise<boolean> {
  try {
    // Ensure authenticated before writing
    await initFirebaseAuth();
    const now = new Date();
    await addDoc(verificationsRef, {
      ...record,
      date: now.toLocaleString(),
      timestamp: now.getTime(),
    });
    return true;
  } catch (error) {
    console.error("Firebase addVerification error:", error);
    return false;
  }
}

// Listen for real-time updates
export function onVerificationsSnapshot(
  callback: (records: (FirebaseVerification & { id: string })[]) => void
) {
  const q = query(verificationsRef, orderBy("timestamp", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as FirebaseVerification),
      }));
      callback(records);
    },
    (error) => {
      console.error("Firebase snapshot error:", error);
      callback([]);
    }
  );
}

// Clear all records
export async function clearAllVerifications(): Promise<boolean> {
  try {
    const snapshot = await getDocs(verificationsRef);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Firebase clearAll error:", error);
    return false;
  }
}

// Anonymous auth — required before any Firestore operation
const auth = getAuth(app);

export function initFirebaseAuth(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already signed in
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        // Sign in anonymously
        signInAnonymously(auth)
          .then(() => resolve(true))
          .catch((err) => {
            console.error("Firebase anonymous auth failed:", err);
            resolve(false);
          });
      }
    });
  });
}

// Check connection status — auth first, then getDocs
export async function checkFirebaseConnection(): Promise<boolean> {
  try {
    const authOk = await initFirebaseAuth();
    if (!authOk) return false;
    await getDocs(query(verificationsRef, orderBy("timestamp", "desc")));
    return true;
  } catch (err) {
    console.error("Firebase connection check failed:", err);
    return false;
  }
}

export { db, auth, disableNetwork, enableNetwork };
