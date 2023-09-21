import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import InstallAppModal from './global/components/app/modals/installAppModal/InstallAppModal';
import UpdateAppModal from './global/components/app/modals/updateAppModal/UpdateAppModal';
import AuthContextProvider from './global/context/auth/AuthContextProvider';
import { ThemeContextProvider } from './global/context/theme/ThemeContextProvider';
import WidgetContextProviders from './global/context/widget/WidgetContextProviders';

function Root(): JSX.Element {
   return (
      <StrictMode>
         <ThemeContextProvider>
            <AuthContextProvider>
               <WidgetContextProviders>
                  <InstallAppModal />
                  {/* <EnablePushNotifModal /> */}
                  <UpdateAppModal />
                  <App />
               </WidgetContextProviders>
            </AuthContextProvider>
         </ThemeContextProvider>
      </StrictMode>
   );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
