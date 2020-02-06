import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAg4pNyc-MZhax5FgMoylmE1v2liSwoKRk",
  authDomain: "lokesal-jambi-admin-fe.firebaseapp.com",
  databaseURL: "https://lokesal-jambi-admin-fe.firebaseio.com",
  projectId: "lokesal-jambi-admin-fe",
  storageBucket: "lokesal-jambi-admin-fe.appspot.com",
  messagingSenderId: "893065561983",
  appId: "1:893065561983:web:e2f9bf0dc01075b9c4fc4a",
  measurementId: "G-CCJDZEBWVB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
