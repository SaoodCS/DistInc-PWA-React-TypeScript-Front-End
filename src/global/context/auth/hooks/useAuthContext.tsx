import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

interface IUseAuthContextReturn {
   isSignedIn: boolean | null;
   setIsSignedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function useAuthContext(): IUseAuthContextReturn {
   const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

   return { isSignedIn, setIsSignedIn };
}
