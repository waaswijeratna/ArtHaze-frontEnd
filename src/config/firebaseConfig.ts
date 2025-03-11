import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDDIlh6-aXypke2lvSKyJJURA8_itkW69g",
  authDomain: "secondhand-d92df.firebaseapp.com",
  projectId: "secondhand-d92df",
  storageBucket: "secondhand-d92df.appspot.com",
  messagingSenderId: "262380285091",
  appId: "1:262380285091:web:8654d47e2e7c989a582316",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
