import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc 
} from "firebase/firestore";

// This config pulls directly from the environment variables you set in Vercel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (Singleton pattern to prevent re-initialization errors)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const kv = {
  /**
   * Saves or updates a project document in the "projects" collection.
   */
  async set(key: string, value: any) {
    try {
      const docRef = doc(db, "projects", key);
      // We wrap the object in a 'payload' field to ensure Firestore handles nested objects correctly
      await setDoc(docRef, { payload: value }, { merge: true });
    } catch (error) {
      console.error("Firebase Set Error:", error);
      throw error;
    }
  },

  /**
   * Retrieves a single project document.
   */
  async get(key: string) {
    try {
      const docRef = doc(db, "projects", key);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().payload : null;
    } catch (error) {
      console.error("Firebase Get Error:", error);
      return null;
    }
  },

  /**
   * Fetches all projects to display on the dashboard.
   */
  async hgetall(key: string) {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const results: any = {};
      querySnapshot.forEach((doc) => {
        results[doc.id] = doc.data().payload;
      });
      return results;
    } catch (error) {
      console.error("Firebase GetAll Error:", error);
      return {};
    }
  },

  /**
   * Deletes a project document by its ID.
   */
  async del(key: string) {
    try {
      const docRef = doc(db, "projects", key);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Firebase Delete Error:", error);
      throw error;
    }
  }
};
