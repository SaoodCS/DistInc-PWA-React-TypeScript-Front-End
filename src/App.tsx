import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ExampleUIComp from './global/components/examples/ExampleUIComp';
import useThemeContext from './global/hooks/useThemeContext';
import { GlobalTheme } from './global/styles/theme';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   const { isDarkTheme, toggleTheme } = useThemeContext();

   return (
      <>
            <GlobalTheme darkTheme={isDarkTheme} />
            <QueryClientProvider client={queryClient}>
               <ExampleUIComp.Carousel/>
               <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
      </>
   );
}
