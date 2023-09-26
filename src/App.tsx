import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   return (
      <>
         <QueryClientProvider client={queryClient}>
            <AppRouter />
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </>
   );
}
