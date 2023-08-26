import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getDatabase, push, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCnqA63y5H9q8rv4DPkIshwg8awh3Xk1FQ",
  authDomain: "infiopp-c399a.firebaseapp.com",
  projectId: "infiopp-c399a",
  storageBucket: "infiopp-c399a.appspot.com",
  messagingSenderId: "955369058407",
  appId: "1:955369058407:web:8311adee2e681ee92de4c2",
  measurementId: "G-CZKDK3GXXD"
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
const db = getDatabase();

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
