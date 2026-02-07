import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9MUXefpXZ-IkQbCDdGln_omSedtcLw7k",
  authDomain: "cadastro-de-funcionarios-ee4c0.firebaseapp.com",
  projectId: "cadastro-de-funcionarios-ee4c0",
  storageBucket: "cadastro-de-funcionarios-ee4c0.firebasestorage.app",
  messagingSenderId: "210857245863",
  appId: "1:210857245863:web:c4225ab975148acd24af82",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
