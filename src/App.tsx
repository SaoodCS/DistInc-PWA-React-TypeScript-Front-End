import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useThemeContext from './global/context/theme/hooks/useThemeContext';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   const { isDarkTheme, toggleTheme } = useThemeContext();

   return (
      <>
         <QueryClientProvider client={queryClient}>
            {/* <button onClick={toggleTheme}>Toggle Theme</button> */}
            <AppRouter />
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </>
   );
}
