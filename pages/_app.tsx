import '@styles/globals.css'
import type { AppProps } from 'next/app'
import { UserContext } from '@lib/context';
import { useUserData } from '@lib/hooks';
import Header from '@components/Header';


export default function App({ Component, pageProps }: AppProps) {
  const userData = useUserData();
  
  return (
    <UserContext.Provider value={userData}>
      <Header />
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
