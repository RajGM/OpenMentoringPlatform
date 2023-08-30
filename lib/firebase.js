import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
//import { getDatabase, push, ref } from "firebase/database";
import { getFirestore,push, ref } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUl0ixvaHik68oxdMtyhJLXXnDdJ_tOPg",
  authDomain: "foss-mentoring.firebaseapp.com",
  projectId: "foss-mentoring",
  storageBucket: "foss-mentoring.appspot.com",
  messagingSenderId: "160694360381",
  appId: "1:160694360381:web:66434093e63551094a8d54"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;
export const doc = firebase.firestore.doc;
export const getDoc = firebase.firestore.getDoc;

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/// Helper functions
export const db = getFirestore();

export async function generateFirebaseID(collection) {
  const newRef = push(ref(db, collection));
  console.log("New ID generated:", newRef.key);
  return newRef.key;
}

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
