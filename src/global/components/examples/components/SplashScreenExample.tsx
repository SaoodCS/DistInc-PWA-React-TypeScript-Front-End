import { useContext, useEffect } from 'react';
import { SplashScreenContext } from '../../../context/widget/splashScreen/SplashScreenContext';

export default function SplashScreen(): JSX.Element {
   const { setShowSplashScreen, showSplashScreen } = useContext(SplashScreenContext);

   function handleShowSplashScreen(): void {
      setShowSplashScreen(true);
   }

   useEffect(() => {
      if (showSplashScreen) {
         setTimeout(() => {
            setShowSplashScreen(false);
         }, 1000);
      }
   }, [showSplashScreen]);

   return (
      <>
         <button onClick={() => handleShowSplashScreen()}>Show Splash Screen</button>
      </>
   );
}
