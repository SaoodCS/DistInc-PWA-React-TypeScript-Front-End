import type { ReactNode } from 'react';
import { useState } from 'react';
import { HeaderContext } from './HeaderContext';

interface IHeaderContextProvider {
   children: ReactNode;
}

export default function HeaderContextProvider(props: IHeaderContextProvider): JSX.Element {
   const { children } = props;
   const [headerTitle, setHeaderTitle] = useState<string>('');

   return (
      <HeaderContext.Provider
         value={{
            headerTitle,
            setHeaderTitle,
         }}
      >
         {children}
      </HeaderContext.Provider>
   );
}
