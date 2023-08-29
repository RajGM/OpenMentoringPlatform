import { createContext } from 'react';
export const UserContext = createContext({ user: null, username: null });
export const SocialContext = createContext({ discord: null, telegram: null, twitter: null, instagram: null });
