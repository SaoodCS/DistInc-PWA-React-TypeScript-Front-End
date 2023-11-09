import { useEffect } from 'react';
import useLocalStorage from '../../../../../../global/hooks/useLocalStorage';
import type NDist from '../../../namespace/NDist';

interface ISavingsAccHistDetails {
   savingsAccHistItem: NDist.ISavingsAccHist;
}

export default function SavingsAccHistDetails(props: ISavingsAccHistDetails): JSX.Element {
   const { savingsAccHistItem } = props;
   const [prevSavingsAccHistItem, setPrevSavingsAccHistItem] = useLocalStorage(
      'prevSavingsAccHisItem',
      savingsAccHistItem,
   );

   useEffect(() => {
      if (savingsAccHistItem) {
         setPrevSavingsAccHistItem(savingsAccHistItem);
      }
   }, []);

   function savingsAccHistToRender(): NDist.ISavingsAccHist {
      if (!savingsAccHistItem) return prevSavingsAccHistItem;
      return savingsAccHistItem;
   }

   return (
      <div>
         {savingsAccHistToRender().balance}
         {savingsAccHistToRender().id}
         {savingsAccHistToRender().timestamp}
      </div>
   );
}
