import { useEffect } from 'react';
import useLocalStorage from '../../../../../global/hooks/useLocalStorage';
import { ICalcSchema } from '../calculation/CalculateDist';

interface ISavingsAccHistDetails {
   savingsAccHistItem: ICalcSchema['savingsAccHistory'][0];
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

   function savingsAccHistToRender(): ICalcSchema['savingsAccHistory'][0] {
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
