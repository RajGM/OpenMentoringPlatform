import { createContext } from 'react';
import { UserContextType } from './types';

export const UserContext = createContext<UserContextType>({ user: null, username: null });
