// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // If you are using Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyfU_lzbqgTpVonX982SB2lOQBeXVN9gE",
  authDomain: "project-zeus-01.firebaseapp.com",
  projectId: "project-zeus-01",
  storageBucket: "project-zeus-01.appspot.com",
  messagingSenderId: "988124730987",
  appId: "1:988124730987:web:9f5caa19590adfc7b3c32e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(); // If you are using getAuth
const storage = getStorage(app); // If you are using Firebase Storage

export { db, auth, storage };
