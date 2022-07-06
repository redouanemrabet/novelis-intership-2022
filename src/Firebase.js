//configuration la base de données de l'authentification avec notre projet react pour etre capable de stocker users
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import {getFirestore} from "@firebase/firestore";
//on a besoin d'une methode getAuth

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,//process.env : pour tourver les variable d'envirenement
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
const App = firebase.initializeApp(firebaseConfig)
var db=App.firestore();
export {db};//data base
const Appp = initializeApp(firebaseConfig);
const dbb =getFirestore(Appp)
export {dbb};

//on peut s'inscrire quelqu'un  ous se connecter