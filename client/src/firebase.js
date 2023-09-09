// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClnhHy1Mrv86cbRHeqdfhtzQwBIS2vGig",
  authDomain: "clone-7ad47.firebaseapp.com",
  projectId: "clone-7ad47",
  storageBucket: "clone-7ad47.appspot.com",
  messagingSenderId: "833216167089",
  appId: "1:833216167089:web:b7dcbb9c79a7acf2c9b690"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;