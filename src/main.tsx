import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import InstallAppModal from './global/components/app/modals/installAppModal/InstallAppModal';
import AuthContextProvider from './global/context/auth/AuthContextProvider';
import ThemeContextProvider from './global/context/theme/ThemeContextProvider';
import WidgetContextProviders from './global/context/widget/WidgetContextProviders';
import NumberHelper from './global/helpers/dataTypes/number/NumberHelper';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         networkMode: 'offlineFirst',
         retry: false,
         retryOnMount: true,
         refetchOnMount: true,
         refetchOnWindowFocus: true,
         refetchOnReconnect: true,
         staleTime: NumberHelper.minsToMs(5),
         // cacheTime: minsToMs(1),
      }
   }
});

function Root(): JSX.Element {
   return (
      <StrictMode>
         <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
               <AuthContextProvider>
                  <WidgetContextProviders>
                     <InstallAppModal />
                     {/* <EnablePushNotifModal /> */}
                     <App />
                     <ReactQueryDevtools initialIsOpen={false} />
                  </WidgetContextProviders>
               </AuthContextProvider>
            </ThemeContextProvider>
         </QueryClientProvider>
      </StrictMode>
   );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
