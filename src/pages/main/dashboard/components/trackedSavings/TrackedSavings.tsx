import { Fragment, useContext, useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CardLoadingPlaceholder } from '../../../../../global/components/lib/dashboardCards/placeholder/CardLoadingPlaceholder';
import { DonutChartNoDataPlaceholder } from '../../../../../global/components/lib/donutChart/placeholder/NoDataPlaceholder';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { SelectIcon } from '../../../../../global/components/lib/icons/select/SelectIcon';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import {
   ProgressChartInfo,
   ProgressChartTitle,
} from '../../../../../global/components/lib/progressChartCard/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { PopupMenuContext } from '../../../../../global/context/widget/popupMenu/PopupMenuContext';
import Color from '../../../../../global/css/colors';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useURLState from '../../../../../global/hooks/useURLState';
import type { ISavingsFormInputs } from '../../../details/components/accounts/savings/class/Class';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import TrackedSavingsChart from './namespace/TrackedSavingsChart';
import SelectTrackedSavingsPopupMenu from './selectPopupMenu/SelectTrackedSavingsPopupMenu';

export default function TrackedSavings(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const {
      data: savingsAcc,
      isLoading,
      isPaused,
      error,
   } = SavingsClass.useQuery.getSavingsAccounts();
   const [trackedSavingsAccounts, setTrackedSavingsAccounts] = useState<ISavingsFormInputs[]>();
   const [selectedSavingsAccData, setSelectedSavingsAccData] = useState<ISavingsFormInputs>();
   const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
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
         const trackedAccounts = TrackedSavingsChart.getAccounts(savingsAccAsArr);
         setTrackedSavingsAccounts(trackedAccounts);
         setShowPlaceholder(!MiscHelper.isNotFalsyOrEmpty(trackedAccounts));
         setSelectedSavingsAccData(
            TrackedSavingsChart.getSelectedAccount(savingsAccAsArr, selectedSavingsAcc),
         );
         setSelectedSavingsAcc(
            TrackedSavingsChart.setSelectedAccountInitialName(savingsAccAsArr, selectedSavingsAcc),
         );
      }
   }, [savingsAcc, selectedSavingsAcc]);

   function handleSelectorClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void {
      togglePM(true);
      setPMContent(<SelectTrackedSavingsPopupMenu />);
      setClickEvent(e);
      setPMHeightPx((trackedSavingsAccounts?.length || 0) * 35);
      setPMWidthPx(200);
      setCloseOnInnerClick(false);
   }

   function calculatePercentage(): number {
      const selectedAccBalance = selectedSavingsAccData?.currentBalance || 0;
      const selectedAccTarget = selectedSavingsAccData?.targetToReach || 0;
      if (selectedAccTarget === 0) return 0;
      return NumberHelper.calcPercentage(selectedAccBalance, selectedAccTarget, true);
   }

   function progressChartColor(): string {
      if (calculatePercentage() < 100) {
         return Color.setRgbOpacity(
            isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning,
            0.7,
         );
      }
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.7);
   }

   if (isLoading && !isPaused && isPortableDevice) {
      return <CardLoadingPlaceholder isDarkTheme={isDarkTheme} />;
   }
   if (isPaused) {
      return (
         <FlexCenterer height="100%" width="100%">
            <OfflineFetch />
         </FlexCenterer>
      );
   }
   if (error || !savingsAcc) {
      return (
         <FlexCenterer height="90%" width="100%">
            <FetchError />
         </FlexCenterer>
      );
   }

   return (
      <>
         <ProgressChartTitle>
            <TextColourizer>{'Tracked Savings'}</TextColourizer>
            <ConditionalRender condition={!showPlaceholder}>
               <SelectIcon
                  height={'1em'}
                  darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  onClick={handleSelectorClick}
                  zindex="1"
                  padding="0em 0em 0em 0.25em"
               />
            </ConditionalRender>
         </ProgressChartTitle>
         <FlexRowWrapper position="relative" height="100%" justifyContent="space-evenly">
            <FlexColumnWrapper justifyContent="center" padding={'1em'}>
               <ConditionalRender condition={!showPlaceholder}>
                  <ProgressChartInfo>
                     <Fragment>
                        <TextColourizer>{selectedSavingsAccData?.accountName}</TextColourizer>
                        <FlexRowWrapper
                           justifyContent="end"
                           alignItems="end"
                           padding="0.3em 0em 0.3em 0em"
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
                                 color={Color.setRgbOpacity(
                                    isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
                                    0.8,
                                 )}
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
                  </ProgressChartInfo>
               </ConditionalRender>
            </FlexColumnWrapper>
            <ConditionalRender
               condition={
                  MiscHelper.isNotFalsyOrEmpty(selectedSavingsAccData) &&
                  selectedSavingsAccData?.targetToReach !== 0
               }
            >
               <FlexRowWrapper width="40%" height="100%" padding="0em 1em 0em 0em">
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
            <ConditionalRender condition={showPlaceholder}>
               <FlexCenterer position="absolute">
                  <TextColourizer color={'darkgrey'}>No Data For a Current Period</TextColourizer>
               </FlexCenterer>
               <FlexRowWrapper position="absolute">
                  <DonutChartNoDataPlaceholder />
               </FlexRowWrapper>
            </ConditionalRender>
         </FlexRowWrapper>
      </>
   );
}
