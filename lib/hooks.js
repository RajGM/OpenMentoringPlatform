import { auth, firestore } from '@lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {SocialContext} from '@lib/context';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [social, setSocial] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
        const ref2 = firestore.collection('usernames').doc(doc.data()?.username);
        ref2.get().then((doc) => {
          setSocial(doc.data());
        }
        );
      });
    } else {

      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username,social };
}
