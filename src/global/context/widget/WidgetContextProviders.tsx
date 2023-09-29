import type { ReactNode } from 'react';
import ApiErrorContextProvider from './apiError/apiErrorContextProvider';
import { BannerContextProvider } from './banner/BannerContextProvider';
import BottomPanelContextProvider from './bottomPanel/BottomPanelContextProvider';
import { LoaderContextProvider } from './loader/LoaderContextProvider';
import ModalContextProvider from './modal/ModalContextProvider';
import ToastContextProvider from './toast/ToastContextProvider';

interface IWidgetContextProvidersProps {
   children: ReactNode;
}

export default function WidgetContextProviders(props: IWidgetContextProvidersProps): JSX.Element {
   const { children } = props;
   return (
      <ModalContextProvider>
         <LoaderContextProvider>
            <ApiErrorContextProvider>
               <BannerContextProvider>
                  <ToastContextProvider>
                     <BottomPanelContextProvider>{children}</BottomPanelContextProvider>
                  </ToastContextProvider>
               </BannerContextProvider>
            </ApiErrorContextProvider>
         </LoaderContextProvider>
      </ModalContextProvider>
   );
}
