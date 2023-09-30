import { useContext } from 'react';
import type { IAuthContext } from '../AuthContext';
import { AuthContext } from '../AuthContext';

export default function useAuthContext(): IAuthContext {
   const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

   return { isSignedIn, setIsSignedIn };
}
