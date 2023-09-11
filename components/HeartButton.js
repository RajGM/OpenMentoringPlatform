import { firestore, auth, increment } from '@lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

// Allows user to heart or like a post
export default async function Heart({ postRef }) {
  // Listen to heart document for currently logged in user

  console.log("postRef:", postRef)
  const data = await postRef.get();
  let docRef = null;
  for (const doc of data.docs) {
    docRef = doc.ref;
    console.log(doc.id, '=>', doc.ref);
    return;
  }
  
  const heartRef = docRef.collection('hearts').doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(docRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(docRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
