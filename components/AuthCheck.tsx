import Link from 'next/link';
import { ReactNode, useContext } from 'react';
import { UserContext } from '@lib/context';

interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Component's children only shown to logged-in users
const AuthCheck: React.FC<AuthCheckProps> = ({ children, fallback }) => {
  const { username } = useContext(UserContext);

  return username ? children : fallback || <Link href="/enter">You must be signed in</Link>;
}

export default AuthCheck;
