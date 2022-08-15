import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import firebaseConfig from "./firebaseConfig";

//* Initialize firebase
const firebaseApp = initializeApp(firebaseConfig);

//* Initialize auth and firestore with the 'firebaseApp' property
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export default firebaseApp;

//********************************************************************* */

//* Emulator Suite

// export const auth = getAuth();
// connectAuthEmulator(auth, "http://localhost:9099");

// export const firestore = getFirestore();
// connectFirestoreEmulator(firestore, 'localhost', 8080);
