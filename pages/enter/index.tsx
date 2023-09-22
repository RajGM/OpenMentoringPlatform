"use client";

import { auth, firestore, googleAuthProvider } from "@lib/firebase";
import { UserContext } from "@lib/context";

import { useEffect, useState, useCallback, useContext } from "react";
import debounce from "lodash.debounce";

import Loader from "@components/Loader";

import Link from "next/link";

export default function Enter(props: any) {
  const { user, username } = useContext(UserContext);

  return (
    <main className="middle fullHeight">
      <div>
        {user ? !username ? <UsernameForm /> : <HomePage /> : <SignInButton />}
      </div>
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <>
      <button
        className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75"
        onClick={signInWithGoogle}
      >
        <div style={{display:'flex',flexDirection:'column',textAlign:'center', alignItems:'center', gap:'5px'}}>
          <div>Sign in with Google</div>
          <div>
            <img src={"/google.png"} width="30px" />
          </div>
        </div>
      </button>
    </>
  );
}

function HomePage() {
  return (
    <Link href="/">
      <button className="btn-logo">HomePage</button>
    </Link>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userDoc = firestore.doc(`users/${user!.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user!.photoURL,
      displayName: user!.displayName,
    });
    batch.set(usernameDoc, { uid: user!.uid });

    await batch.commit();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3 style={{ textAlign: "center" }}>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <div>
            Username: {formValue}
            <br />
            Checking:{" "}
            {loading ? <Loader show={true} className="middle" /> : "Complete"}
            <br />
            Username Valid: {isValid ? "✅" : "❌"}
          </div>
        </form>
      </section>
    )
  );
}

interface UsernameMessageProps {
  username: string;
  isValid: boolean;
  loading: boolean;
}

function UsernameMessage({ username, isValid, loading }: UsernameMessageProps) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
