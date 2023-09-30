import type { Dispatch, SetStateAction } from 'react';
import { useContext } from 'react';
import { HeaderContext, IHeaderContext } from '../HeaderContext';

export default function useHeaderContext(): IHeaderContext {
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
