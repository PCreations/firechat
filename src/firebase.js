import * as firebase from "firebase";
import config from './firebaseConfig';

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database();
export const auth = firebaseApp.auth();