import type { ReactNode } from 'react';
import { BannerContextProvider } from './banner/BannerContextProvider';
import BottomPanelContextProvider from './bottomPanel/BottomPanelContextProvider';
import { LoaderContextProvider } from './loader/LoaderContextProvider';
import ModalContextProvider from './modal/ModalContextProvider';
import { SplashScreenContextProvider } from './splashScreen/SplashScreenContextProvider';
import ToastContextProvider from './toast/ToastContextProvider';

interface IWidgetContextProvidersProps {
   children: ReactNode;
}

export default function WidgetContextProviders(props: IWidgetContextProvidersProps): JSX.Element {
   const { children } = props;
   return (
      <ModalContextProvider>
         <BottomPanelContextProvider>
            <SplashScreenContextProvider>
               <LoaderContextProvider>
                  <BannerContextProvider>
                     <ToastContextProvider>{children}</ToastContextProvider>
                  </BannerContextProvider>
               </LoaderContextProvider>
            </SplashScreenContextProvider>
         </BottomPanelContextProvider>
      </ModalContextProvider>
   );
}
