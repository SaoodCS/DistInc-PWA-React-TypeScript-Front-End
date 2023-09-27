import { useContext } from 'react';
import { HeaderContext } from '../HeaderContext';

interface IUseHeaderContext {
   headerTitle: string;
   setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
}

export default function useHeaderContext(): IUseHeaderContext {
   const { headerTitle, setHeaderTitle } = useContext(HeaderContext);
   return { headerTitle, setHeaderTitle };
}
