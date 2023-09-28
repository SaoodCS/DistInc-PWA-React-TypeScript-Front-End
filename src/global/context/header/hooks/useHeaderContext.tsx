import type { Dispatch, SetStateAction } from 'react';
import { useContext } from 'react';
import { HeaderContext } from '../HeaderContext';

export interface IUseHeaderContext {
   headerTitle: string;
   setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
   showBackBtn: boolean;
   setShowBackBtn: React.Dispatch<React.SetStateAction<boolean>>;
   handleBackBtnClick: () => void;
   setHandleBackBtnClick: Dispatch<SetStateAction<() => void>>;
   hideAndResetBackBtn: () => void;
}

export default function useHeaderContext(): IUseHeaderContext {
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
