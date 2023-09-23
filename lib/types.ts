// Define the type for the atom's value
export type TextType = string;
export type CategoryType = string;
export type FilterType = string;

export type ProviderData = {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string | null;
    photoURL: string;
  };
  
  export type STSTokenManager = {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
  
  export type User = {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    isAnonymous: boolean;
    photoURL: string;
    providerData: ProviderData[];
    stsTokenManager: STSTokenManager;
    createdAt: string;
    lastLoginAt: string;
    apiKey: string;
    appName: string;
  };
  
  export type UserContextType = {
    user: User | null;
    username: string | null;
  };
  