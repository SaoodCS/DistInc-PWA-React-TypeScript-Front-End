import { useContext, useEffect } from 'react';
import { HeaderContext, IHeaderContext } from '../HeaderContext';

export default class HeaderHooks {
   static useHeaderContext(): IHeaderContext {
      const {
         headerTitle,
         setHeaderTitle,
         showBackBtn,
         setShowBackBtn,
         handleBackBtnClick,
         setHandleBackBtnClick,
         hideAndResetBackBtn,
      } = useContext(HeaderContext);
      return {
         headerTitle,
         setHeaderTitle,
         handleBackBtnClick,
         setHandleBackBtnClick,
         showBackBtn,
         setShowBackBtn,
         hideAndResetBackBtn,
      };
   }

   static useOnMount = {
      setHeaderTitle: (title: string) => {
         const { setHeaderTitle } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderTitle(title);
         }, []);
      },
   };

   static useOnUnMount = {
      hideAndResetBackBtn: () => {
         const { hideAndResetBackBtn } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            return () => {
               hideAndResetBackBtn();
            };
         }, []);
      },
   };
}
