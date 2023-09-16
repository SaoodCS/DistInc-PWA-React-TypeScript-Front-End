import type { ReactNode } from 'react';
import { useState } from 'react';
import SplashScreen from '../../../components/lib/splashScreen/SplashScreen';
import { SplashScreenContext } from './SplashScreenContext';

interface ISplashScreenContextProvider {
   children: ReactNode;
}

export const SplashScreenContextProvider = (props: ISplashScreenContextProvider): JSX.Element => {
   const { children } = props;
   const [showSplashScreen, setShowSplashScreen] = useState(false);

   return (
      <>
         <SplashScreenContext.Provider value={{ showSplashScreen, setShowSplashScreen }}>
            {children}
         </SplashScreenContext.Provider>
         <SplashScreen isDisplayed={showSplashScreen} />
      </>
   );
};
