import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface ISplashScreenContext {
   showSplashScreen: boolean;
   setShowSplashScreen: Dispatch<SetStateAction<boolean>>;
}

export const SplashScreenContext = createContext<ISplashScreenContext>({
   showSplashScreen: false,
   setShowSplashScreen: () => {},
});
