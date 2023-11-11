import { useContext, useEffect } from 'react';
import useLocalStorage from '../../../../../../global/hooks/useLocalStorage';
import { DistributeContext } from '../../../context/DistributeContext';
import type NDist from '../../../namespace/NDist';

export default function SavingsAccHistDetailsSlide(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const savingsAccHistItem = slide2Data as NDist.ISavingsAccHist;
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
