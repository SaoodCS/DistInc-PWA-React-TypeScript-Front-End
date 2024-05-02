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
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';
import SplashScreenContextProvider from './global/context/widget/splashScreen/SplashScreenContextProvider';

registerSW({ immediate: true });

GlobalUtils.config.chartJSRegister;

function Root(): JSX.Element {
   return (
      <StrictMode>
         <QueryClientProvider client={GlobalUtils.config.queryClient}>
            <ThemeContextProvider>
               <SplashScreenContextProvider>
                  <DeviceContextProvider>
                     <AuthContextProvider>
                        <InstallAppModal />
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                     </AuthContextProvider>
                  </DeviceContextProvider>
               </SplashScreenContextProvider>
            </ThemeContextProvider>
         </QueryClientProvider>
      </StrictMode>
   );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
