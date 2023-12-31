import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import InstallAppModal from './global/components/app/modals/installAppModal/InstallAppModal';
import GlobalUtils from './global/config/GlobalConfig';
import AuthContextProvider from './global/context/auth/AuthContextProvider';
import DeviceContextProvider from './global/context/device/DeviceContextProvider';
import ThemeContextProvider from './global/context/theme/ThemeContextProvider';

GlobalUtils.config.chartJSRegister;

function Root(): JSX.Element {
   return (
      <StrictMode>
         <QueryClientProvider client={GlobalUtils.config.queryClient}>
            <ThemeContextProvider>
               <DeviceContextProvider>
                  <AuthContextProvider>
                     <InstallAppModal />
                     <App />
                     <ReactQueryDevtools initialIsOpen={false} />
                  </AuthContextProvider>
               </DeviceContextProvider>
            </ThemeContextProvider>
         </QueryClientProvider>
      </StrictMode>
   );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
