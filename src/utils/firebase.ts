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
  doc,
  getDoc,
  setDoc,
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

// Anonymous auth — required before any Firestore operation
const auth = getAuth(app);

let authPromise: Promise<boolean> | null = null;

export function initFirebaseAuth(): Promise<boolean> {
  if (authPromise) return authPromise;
  
  authPromise = new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Stop listening after first callback
      if (user) {
        console.log("Firebase: Already authenticated, uid:", user.uid);
        resolve(true);
      } else {
        // Sign in anonymously
        signInAnonymously(auth)
          .then((cred) => {
            console.log("Firebase: Anonymous sign-in success, uid:", cred.user.uid);
            resolve(true);
          })
          .catch((err) => {
            console.error("Firebase: Anonymous auth failed:", err.code, err.message);
            authPromise = null; // Reset so we can retry
            resolve(false);
          });
      }
    });
  });
  
  return authPromise;
}

// Add a verification record (ensures auth first)
export async function addVerification(
  record: Omit<FirebaseVerification, "date" | "timestamp">
): Promise<boolean> {
  try {
    // Ensure authenticated before writing
    const authOk = await initFirebaseAuth();
    if (!authOk) {
      console.error("Firebase: Cannot add verification - auth failed");
      return false;
    }
    const now = new Date();
    const docRef = await addDoc(verificationsRef, {
      ...record,
      date: now.toLocaleString(),
      timestamp: now.getTime(),
    });
    console.log("Firebase: Verification saved with id:", docRef.id);
    return true;
  } catch (error: any) {
    console.error("Firebase addVerification error:", error.code, error.message);
    return false;
  }
}

// Listen for real-time updates
export function onVerificationsSnapshot(
  callback: (records: (FirebaseVerification & { id: string })[]) => void
) {
  // Ensure auth first, then subscribe
  initFirebaseAuth().then((authOk) => {
    if (!authOk) {
      console.error("Firebase: Cannot subscribe to snapshot - auth failed");
      callback([]);
      return;
    }
    console.log("Firebase: Subscribing to real-time updates...");
  });

  const q = query(verificationsRef, orderBy("timestamp", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log("Firebase: Snapshot received, docs count:", snapshot.docs.length);
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as FirebaseVerification),
      }));
      callback(records);
    },
    (error: any) => {
      console.error("Firebase snapshot error:", error.code, error.message);
      callback([]);
    }
  );
}

// Clear all records
export async function clearAllVerifications(): Promise<boolean> {
  try {
    const authOk = await initFirebaseAuth();
    if (!authOk) return false;
    const snapshot = await getDocs(verificationsRef);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("Firebase: All verifications cleared");
    return true;
  } catch (error: any) {
    console.error("Firebase clearAll error:", error.code, error.message);
    return false;
  }
}

// Check connection status — auth first, then getDocs
export async function checkFirebaseConnection(): Promise<boolean> {
  try {
    const authOk = await initFirebaseAuth();
    if (!authOk) {
      console.error("Firebase: Connection check failed - auth not ok");
      return false;
    }
    const snapshot = await getDocs(query(verificationsRef, orderBy("timestamp", "desc")));
    console.log("Firebase: Connection check OK, docs:", snapshot.docs.length);
    return true;
  } catch (err: any) {
    console.error("Firebase connection check failed:", err.code, err.message);
    return false;
  }
}

// ── Settings: Notification Email (stored in Firestore settings/notification) ──

const DEFAULT_NOTIFICATION_EMAIL = "";
const settingsDocRef = doc(db, "settings", "notification");

// Get the notification email from Firebase
export async function getNotificationEmail(): Promise<string> {
  try {
    const authOk = await initFirebaseAuth();
    if (!authOk) return DEFAULT_NOTIFICATION_EMAIL;
    const snap = await getDoc(settingsDocRef);
    if (snap.exists() && snap.data().email) {
      return snap.data().email as string;
    }
    return DEFAULT_NOTIFICATION_EMAIL;
  } catch (err: any) {
    console.error("Firebase getNotificationEmail error:", err.code, err.message);
    return DEFAULT_NOTIFICATION_EMAIL;
  }
}

// Set the notification email in Firebase
export async function setNotificationEmail(email: string): Promise<boolean> {
  try {
    const authOk = await initFirebaseAuth();
    if (!authOk) return false;
    await setDoc(settingsDocRef, { email, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("Firebase: Notification email updated to:", email);
    return true;
  } catch (err: any) {
    console.error("Firebase setNotificationEmail error:", err.code, err.message);
    return false;
  }
}

// Listen for real-time changes to notification email
export function onNotificationEmailSnapshot(callback: (email: string) => void) {
  initFirebaseAuth();
  return onSnapshot(
    settingsDocRef,
    (snap) => {
      if (snap.exists() && snap.data().email) {
        callback(snap.data().email as string);
      } else {
        callback(DEFAULT_NOTIFICATION_EMAIL);
      }
    },
    () => {
      callback(DEFAULT_NOTIFICATION_EMAIL);
    }
  );
}

export { db, auth, disableNetwork, enableNetwork };
