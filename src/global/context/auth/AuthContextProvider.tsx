import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import IncomeClass from '../../../pages/main/details/components/Income/class/Class';
import SavingsClass from '../../../pages/main/details/components/accounts/savings/class/Class';
import ExpensesClass from '../../../pages/main/details/components/expense/class/ExpensesClass';
import NDist from '../../../pages/main/distribute/namespace/NDist';
import ConditionalRender from '../../components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { auth } from '../../firebase/config/config';
import { AuthContext } from './AuthContext';
import CurrentClass from '../../../pages/main/details/components/accounts/current/class/Class';

interface IAuthContextProvider {
   children: ReactNode;
}

export default function AuthContextProvider(props: IAuthContextProvider): JSX.Element {
   const { children } = props;
   const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
   NDist.API.useQuery.getCalcDist({ enabled: !!isSignedIn });
   ExpensesClass.useQuery.getExpenses({ enabled: !!isSignedIn });
   SavingsClass.useQuery.getSavingsAccounts({ enabled: !!isSignedIn });
   CurrentClass.useQuery.getCurrentAccounts({ enabled: !!isSignedIn });
   IncomeClass.useQuery.getIncomes({ enabled: !!isSignedIn });

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
