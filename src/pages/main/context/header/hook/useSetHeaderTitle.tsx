import { useEffect } from 'react';
import useHeaderContext from './useHeaderContext';

export default function useSetHeaderTitle(title: string): void {
   const { setHeaderTitle } = useHeaderContext();
   useEffect(() => {
      setHeaderTitle(title);
   }, []);
}
