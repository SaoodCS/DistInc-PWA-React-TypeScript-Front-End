import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IHeaderContext {
   headerTitle: string;
   setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
   showBackBtn: boolean;
   setShowBackBtn: React.Dispatch<React.SetStateAction<boolean>>;
   handleBackBtnClick: () => void;
   setHandleBackBtnClick: Dispatch<SetStateAction<() => void>>;
   hideAndResetBackBtn: () => void;
}

export const HeaderContext = createContext<IHeaderContext>({
   headerTitle: '',
   setHeaderTitle: () => {},
   showBackBtn: false,
   setShowBackBtn: () => {},
   handleBackBtnClick: () => {},
   setHandleBackBtnClick: () => {},
   hideAndResetBackBtn: () => {},
});
