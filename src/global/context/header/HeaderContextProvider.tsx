import type { ReactNode } from 'react';
import { useState } from 'react';
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

   return (
      <HeaderContext.Provider
         value={{
            headerTitle,
            setHeaderTitle,
            showBackBtn,
            setShowBackBtn,
            handleBackBtnClick,
            setHandleBackBtnClick,
         }}
      >
         {children}
      </HeaderContext.Provider>
   );
}