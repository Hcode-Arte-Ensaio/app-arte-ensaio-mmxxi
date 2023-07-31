import { initializeApp, getApps, getApp } from "firebase/app";
//import { initializeApp } from "firebase/app";
import "firebase/auth";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: 'AIzaSyDwC_W7kNijW6spE86k9Mt47dPADIIiVNI',
//   authDomain: 'conexao-arte.firebaseapp.com',
//   projectId: 'conexao-arte',
//   storageBucket: 'conexao-arte.appspot.com',
//   messagingSenderId: '949002780695',
//   appId: '1:949002780695:web:233329a9caeb52ed801c52',
// };
const firebaseConfig = {
  apiKey: "AIzaSyDwC_W7kNijW6spE86k9Mt47dPADIIiVNI",
  authDomain: "conexao-arte.firebaseapp.com",
  projectId: "conexao-arte",
  storageBucket: "conexao-arte.appspot.com",
  messagingSenderId: "949002780695",
  appId: "1:949002780695:web:233329a9caeb52ed801c52",
};

const app = initializeApp(firebaseConfig);

//const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// export const db = getFirestore(app);
const db = getFirestore(app);
export { db, app };
