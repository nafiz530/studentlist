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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Internal KV object for shared logic
export const kv = {
  async set(key: string, value: any) {
    const docRef = doc(db, "projects", key);
    await setDoc(docRef, { payload: value }, { merge: true });
  },
  async get(key: string) {
    const docRef = doc(db, "projects", key);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().payload : null;
  },
  async hgetall() {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const results: any = {};
    querySnapshot.forEach((doc) => {
      results[doc.id] = doc.data().payload;
    });
    return results;
  },
  async del(key: string) {
    await deleteDoc(doc(db, "projects", key));
  }
};

// 2. THE MISSING EXPORTS YOUR APP IS LOOKING FOR:
export async function getProjects() {
  const data = await kv.hgetall();
  return data || {};
}

export async function saveProjects(projects: any) {
  // This helper maps the old way of saving all projects to individual Firestore docs
  for (const id in projects) {
    await kv.set(id, projects[id]);
  }
}
