"use client";

import { auth, firestore, googleAuthProvider } from "@lib/firebase";
import { UserContext } from "@lib/context";

import { useEffect, useState, useCallback, useContext } from "react";
import debounce from "lodash.debounce";

import Loader from "@components/Loader";

import Link from "next/link";

interface UsernameMessageProps {
  username: string;
  isValid: boolean;
  loading: boolean;
}

export default function Enter(props: any) {
  const { user, username } = useContext(UserContext);

  return (
    <main className="min-h-screen flex justify-center items-center">
      <div
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
    <button
      className="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring"
      onClick={signInWithGoogle}
    >
      <span className="absolute inset-y-0 left-0 w-[2px] bg-indigo-600 transition-all group-hover:w-full group-active:bg-indigo-500"></span>

      <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
        Sign in with Google
      </span>
    </button>
  );
}

function HomePage() {
  return (
    <Link
      href="/"
      className="group flex items-center justify-between gap-4 rounded-lg border border-current px-5 py-3 text-indigo-600 transition-colors hover:bg-indigo-600 focus:outline-none focus:ring active:bg-indigo-500"
    >
      <span className="font-medium transition-colors group-hover:text-white">
        HomePage
      </span>

      <span className="shrink-0 rounded-full border border-indigo-600 bg-white p-2 group-active:border-indigo-500">
        <svg
          className="h-5 w-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </span>
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
        <h3 className="text-xl font-bold mb-4 text-center">Choose Username</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
            className="input input-bordered w-full"
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <div className="text-sm text-gray-600">
            Checking: {loading ? <Loader show={true} /> : "Available"}
            <br />
            Username Valid: {isValid ? "✅" : "❌"}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!isValid}
          >
            Choose
          </button>
        </form>
      </section>
    )
  );
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
