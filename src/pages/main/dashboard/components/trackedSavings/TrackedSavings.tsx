import { Fragment, useContext, useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { SelectIcon } from '../../../../../global/components/lib/icons/select/SelectIcon';
import {
   ChartInfoBelowTitle,
   ChartTitle,
} from '../../../../../global/components/lib/lineChart/Style';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { Wrapper } from '../../../../../global/components/lib/positionModifiers/wrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import Color from '../../../../../global/css/colors';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
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
   const [selectedSavingsAcc, setSelectedSavingsAcc] = useURLState({
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
         setTrackedSavingsAccounts(TrackedSavingsChart.getAccounts(savingsAccAsArr));
         setSelectedSavingsAccData(
            TrackedSavingsChart.getSelectedAccount(savingsAccAsArr, selectedSavingsAcc),
         );
         setSelectedSavingsAcc(
            TrackedSavingsChart.setSelectedAccountInitialName(savingsAccAsArr, selectedSavingsAcc),
         );
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

   function calculatePercentage() {
      const selectedAccBalance = selectedSavingsAccData?.currentBalance || 0;
      const selectedAccTarget = selectedSavingsAccData?.targetToReach || 0;
      if (selectedAccTarget === 0) return 0;
      const percentage = (selectedAccBalance / selectedAccTarget) * 100;
      if (percentage >= 100) return 100;
      return NumberHelper.roundTo(percentage, 2);
   }

   function progressChartColor() {
      if (calculatePercentage() < 100) {
         return Color.setRgbOpacity(
            isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning,
            0.7,
         );
      }
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.7);
   }

   return (
      <FlexColumnWrapper position="relative" height="100%">
         <Wrapper>
            <ChartTitle>
               <TextColourizer>
                  {selectedSavingsAccData?.accountName || 'Tracked Savings'}
               </TextColourizer>
               <ConditionalRender condition={MiscHelper.isNotFalsyOrEmpty(trackedSavingsAccounts)}>
                  <SelectIcon
                     height={'1em'}
                     darktheme={BoolHelper.boolToStr(isDarkTheme)}
                     onClick={handleSelectorClick}
                     zindex="1"
                     padding="0em 0em 0em 0.25em"
                  />
               </ConditionalRender>
            </ChartTitle>
            <ConditionalRender condition={MiscHelper.isNotFalsyOrEmpty(selectedSavingsAccData)}>
               <ChartInfoBelowTitle>
                  <Fragment>
                     <FlexRowWrapper
                        justifyContent="end"
                        alignItems="end"
                        padding="0em 0em 0.3em 0em"
                     >
                        <CurrencyOnCardTxt isDarkTheme={isDarkTheme}>
                           {NumberHelper.asCurrencyStr(
                              selectedSavingsAccData?.currentBalance || 0,
                              true,
                           )}
                        </CurrencyOnCardTxt>
                     </FlexRowWrapper>
                     <ConditionalRender condition={selectedSavingsAccData?.targetToReach !== 0}>
                        <FlexRowWrapper justifyContent="start" alignItems="center">
                           <TextColourizer
                              fontSize="0.9em"
                              color={Color.setRgbOpacity(Color.darkThm.txt, 0.7)}
                           >
                              Target&nbsp;&nbsp;
                           </TextColourizer>
                           <TextColourizer fontSize="0.9em" padding="0em 0em 0em 0.15em">
                              {NumberHelper.asCurrencyStr(
                                 selectedSavingsAccData?.targetToReach || 0,
                              )}
                           </TextColourizer>
                        </FlexRowWrapper>
                     </ConditionalRender>
                  </Fragment>
               </ChartInfoBelowTitle>
            </ConditionalRender>
         </Wrapper>
         <ConditionalRender
            condition={
               MiscHelper.isNotFalsyOrEmpty(selectedSavingsAccData) &&
               selectedSavingsAccData?.targetToReach !== 0
            }
         >
            <FlexRowWrapper
               width="40%"
               position="absolute"
               style={{ right: 0 }}
               height="100%"
               padding="0em 1em 0em 0em"
            >
               <CircularProgressbar
                  value={calculatePercentage()}
                  text={`${calculatePercentage()}%`}
                  styles={buildStyles({
                     textColor: progressChartColor(),
                     pathColor: progressChartColor(),
                     trailColor: isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive,
                  })}
               />
            </FlexRowWrapper>
         </ConditionalRender>
      </FlexColumnWrapper>
   );
}
