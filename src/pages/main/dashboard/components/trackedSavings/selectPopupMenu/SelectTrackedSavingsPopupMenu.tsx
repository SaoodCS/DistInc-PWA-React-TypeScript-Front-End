import { Check } from '@styled-icons/boxicons-regular/Check';
import { useEffect, useState } from 'react';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useURLState from '../../../../../../global/hooks/useURLState';
import SavingsClass, {
   ISavingsFormInputs,
} from '../../../../details/components/accounts/savings/class/Class';
import TrackedSavingsChart from '../namespace/TrackedSavingsChart';

export default function SelectTrackedSavingsPopupMenu() {
   const { isDarkTheme } = useThemeContext();
   const { data: savingsAcc } = SavingsClass.useQuery.getSavingsAccounts();
   const [selectedSavingsAcc, setSelectedSavingsAcc] = useURLState({
      key: TrackedSavingsChart.currentlySelectedKey,
   });
   const [trackedSavingsAccounts, setTrackedSavingsAccounts] = useState<ISavingsFormInputs[]>();

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(savingsAcc)) {
         const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAcc);
         setTrackedSavingsAccounts(TrackedSavingsChart.getAccounts(savingsAccAsArr));
      }
   }, [savingsAcc]);

   function changeSelectedSavingsAcc(savingsAccName: string) {
      setSelectedSavingsAcc(savingsAccName);
   }

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         {trackedSavingsAccounts?.map((savingsAcc) => (
            <PMItemContainer
               key={savingsAcc.id}
               isDarkTheme={isDarkTheme}
               onClick={() => changeSelectedSavingsAcc(savingsAcc.accountName)}
            >
               <PMItemTitle>{savingsAcc.accountName}</PMItemTitle>
               <ConditionalRender condition={selectedSavingsAcc.includes(savingsAcc.accountName)}>
                  <Check />
               </ConditionalRender>
            </PMItemContainer>
         ))}
      </PMItemsListWrapper>
   );
}
