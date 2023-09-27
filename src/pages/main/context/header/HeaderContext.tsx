import { createContext } from 'react';

interface IHeaderContext {
   headerTitle: string;
   setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const HeaderContext = createContext<IHeaderContext>({
   headerTitle: '',
   setHeaderTitle: () => {},
});
