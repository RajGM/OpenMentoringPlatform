import "@styles/globals.css";
import type { AppProps } from "next/app";
import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";
import Header from "@components/Header";
import { Provider as JotaiProvider } from "jotai";
import Metatags from "@components/Metatags";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const userData = useUserData();

  console.log("userData", userData);


  return (
    <UserContext.Provider value={userData}>
      <JotaiProvider>
        <Toaster />
        <Metatags title="InfiOpp" description="Sign up for InfiOpp!" />
        <Header />
        <Component {...pageProps} />
      </JotaiProvider>
    </UserContext.Provider>
  );
}
