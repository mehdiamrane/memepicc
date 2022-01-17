import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { decode } from "utils/base64";

const firebaseConfig = JSON.parse(
  decode(process.env.NEXT_PUBLIC_BASE64_FIREBASE_CONFIG),
);

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);
export const user = auth.currentUser;
