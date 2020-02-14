import firebase from "firebase/app";
import "firebase/storage";
import Credentials from "../credentials.json";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: Credentials.apiKey,
  authDomain: Credentials.authDomain,
  databaseURL: Credentials.databaseURL,
  projectId: Credentials.projectId,
  storageBucket: Credentials.storageBucket,
  messagingSenderId: Credentials.messagingSenderId,
  appId: Credentials.appId,
  measurementId: Credentials.measurementId
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
