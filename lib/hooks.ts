// @ts-nocheck
import { auth, firestore } from '@lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { UserContextType } from './types';

// Custom hook to read auth record and user profile doc
export function useUserData(): UserContextType {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe: (() => void) | undefined;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username || null);
      });
    } else {
      setUsername(null);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return { user, username };
}
