import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import FunctionHelper from '../../helpers/dataTypes/functions/FunctionHelper';
import useFuncState from '../../hooks/useFuncState';
import { HeaderContext } from './HeaderContext';

interface IHeaderContextProvider {
   children: ReactNode;
}

export default function HeaderContextProvider(props: IHeaderContextProvider): JSX.Element {
   const { children } = props;
   const [headerTitle, setHeaderTitle] = useState<string>('');
   const [handleBackBtnClick, setHandleBackBtnClick] = useFuncState(() => null);
   const [showBackBtn, setShowBackBtn] = useState<boolean>(false);

   function hideAndResetBackBtn(): void {
      setShowBackBtn(false);
      setHandleBackBtnClick(() => null);
   }

   useEffect(() => {
      if (!FunctionHelper.isNullFunction(handleBackBtnClick)) {
         setShowBackBtn(true);
      }
   }, [handleBackBtnClick]);

   return (
      <HeaderContext.Provider
         value={{
            headerTitle,
            setHeaderTitle,
            showBackBtn,
            setShowBackBtn,
            handleBackBtnClick,
            setHandleBackBtnClick,
            hideAndResetBackBtn,
         }}
      >
         {children}
      </HeaderContext.Provider>
   );
}
