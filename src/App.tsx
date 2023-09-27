import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HeaderContextProvider from './pages/main/context/header/HeaderContextProvider';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   return (
      <>
         <QueryClientProvider client={queryClient}>
            <HeaderContextProvider>
               <AppRouter />
               <ReactQueryDevtools initialIsOpen={false} />
            </HeaderContextProvider>
         </QueryClientProvider>
      </>
   );
}
