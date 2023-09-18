import { createContext } from 'react';

export interface IAuthContext {
   isSignedIn: boolean | null;
   setIsSignedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const AuthContext = createContext<IAuthContext>({
   isSignedIn: null,
   setIsSignedIn: () => {},
});
