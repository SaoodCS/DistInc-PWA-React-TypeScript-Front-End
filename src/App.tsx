import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HeaderContextProvider from './global/context/header/HeaderContextProvider';
import AppRouter from './routes/AppRouter';

export default function App(): JSX.Element {
   return (
      <>
         <HeaderContextProvider>
            <AppRouter />
            <ReactQueryDevtools initialIsOpen={false} />
         </HeaderContextProvider>
      </>
   );
}
