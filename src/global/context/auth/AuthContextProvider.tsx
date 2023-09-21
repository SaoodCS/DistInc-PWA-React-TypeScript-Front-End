import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import ConditionalRender from '../../components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { auth } from '../../firebase/config/config';
import { AuthContext } from './AuthContext';

interface IAuthContextProvider {
   children: ReactNode;
}

export default function AuthContextProvider(props: IAuthContextProvider): JSX.Element {
   const { children } = props;
   const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

   useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) {
            setIsSignedIn(true);
         } else {
            setIsSignedIn(false);
         }
      });
   }, [isSignedIn]);

   const authValues = useMemo(() => ({ isSignedIn, setIsSignedIn }), [isSignedIn, setIsSignedIn]);

   return (
      <>
         <ConditionalRender condition={isSignedIn !== null}>
            <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
         </ConditionalRender>
      </>
   );
}
