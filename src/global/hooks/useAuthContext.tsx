import { useContext } from 'react';
import { AuthContext } from '../context/auth/AuthContext';

export default function useAuthContext() {
   const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

   return { isSignedIn, setIsSignedIn };
}
