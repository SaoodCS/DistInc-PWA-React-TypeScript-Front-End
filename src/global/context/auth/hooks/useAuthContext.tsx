import { useContext } from 'react';
import { AuthContext, IAuthContext } from '../AuthContext';

export default function useAuthContext(): IAuthContext {
   const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

   return { isSignedIn, setIsSignedIn };
}
