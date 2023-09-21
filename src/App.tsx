import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useThemeContext from './global/context/theme/hooks/useThemeContext';
import { GlobalTheme } from './global/theme/theme';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   return (
      <>
         <GlobalTheme darkTheme={isDarkTheme} />
         <QueryClientProvider client={queryClient}>
            <AppRouter />
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </>
   );
}
