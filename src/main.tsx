import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import InstallAppModal from './global/components/app/modals/installAppModal/InstallAppModal';
import AuthContextProvider from './global/context/auth/AuthContextProvider';
import { ThemeContextProvider } from './global/context/theme/ThemeContextProvider';
import WidgetContextProviders from './global/context/widget/WidgetContextProviders';

const queryClient = new QueryClient();

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
                  </WidgetContextProviders>
               </AuthContextProvider>
            </ThemeContextProvider>
         </QueryClientProvider>
      </StrictMode>
   );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
