import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useContext, useEffect } from 'react';
import AuthContextProvider from './global/context/auth/AuthContextProvider';
import { ThemeContext } from './global/context/theme/ThemeContext';
import { SplashScreenContext } from './global/context/widget/splashScreen/SplashScreenContext';
import useThemeContext from './global/hooks/useThemeContext';
import { GlobalTheme } from './global/styles/theme';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { setShowSplashScreen } = useContext(SplashScreenContext);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         setShowSplashScreen(false);
      }, 2000);

      return () => {
         clearTimeout(timeoutId);
      };
   }, []);

   return (
      <>
         <AuthContextProvider>
            <GlobalTheme darkTheme={isDarkTheme} />
            <QueryClientProvider client={queryClient}>
               <AppRouter />
               <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
         </AuthContextProvider>
      </>
   );
}
