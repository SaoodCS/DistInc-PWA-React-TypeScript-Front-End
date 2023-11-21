import { useContext, useEffect, useState } from 'react';
import { SelectIcon } from '../../../../../global/components/lib/icons/select/SelectIcon';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useURLState from '../../../../../global/hooks/useURLState';
import SavingsClass, {
   ISavingsFormInputs,
} from '../../../details/components/accounts/savings/class/Class';
import TrackedSavingsChart from './namespace/TrackedSavingsChart';
import SelectTrackedSavingsPopupMenu from './selectPopupMenu/SelectTrackedSavingsPopupMenu';

export default function TrackedSavings() {
   const { isDarkTheme } = useThemeContext();
   const { data: savingsAcc } = SavingsClass.useQuery.getSavingsAccounts();
   const [trackedSavingsAccounts, setTrackedSavingsAccounts] = useState<ISavingsFormInputs[]>();
   const [selectedSavingsAccData, setSelectedSavingsAccData] = useState<ISavingsFormInputs>();
   const [selectedSavingsAcc] = useURLState({
      key: TrackedSavingsChart.currentlySelectedKey,
   });
   const {
      setPMContent,
      setPMHeightPx,
      togglePM,
      setPMWidthPx,
      setClickEvent,
      setCloseOnInnerClick,
   } = useContext(PopupMenuContext);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(savingsAcc)) {
         const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAcc);
         setSelectedSavingsAccData(
            TrackedSavingsChart.getSelectedAccount(savingsAccAsArr, selectedSavingsAcc),
         );
         setTrackedSavingsAccounts(TrackedSavingsChart.getAccounts(savingsAccAsArr));
      }
   }, [savingsAcc, selectedSavingsAcc]);

   function handleSelectorClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
      togglePM();
      setPMContent(<SelectTrackedSavingsPopupMenu />);
      setClickEvent(e);
      setPMHeightPx((trackedSavingsAccounts?.length || 0) * 35);
      setPMWidthPx(200);
      setCloseOnInnerClick(false);
   }

   return (
      <div>
         <div>Tracked Savings</div>
         <ConditionalRender condition={MiscHelper.isNotFalsyOrEmpty(trackedSavingsAccounts)}>
            <SelectIcon
               height={'1em'}
               darktheme={BoolHelper.boolToStr(isDarkTheme)}
               onClick={handleSelectorClick}
            />
         </ConditionalRender>
         <div>
            <div>{selectedSavingsAccData?.accountName}</div>
            <div>{selectedSavingsAccData?.id}</div>
         </div>
      </div>
   );
}
