import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNEI4zazzQKx0H2npnXqpKSwWmf5O7h2U",
  authDomain: "soccerflashcard.firebaseapp.com",
  projectId: "soccerflashcard",
  storageBucket: "soccerflashcard.appspot.com",
  messagingSenderId: "898279831138",
  appId: "1:898279831138:web:0c717e2c6d02e80923c33b",
  measurementId: "G-4XMMSMX22R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}