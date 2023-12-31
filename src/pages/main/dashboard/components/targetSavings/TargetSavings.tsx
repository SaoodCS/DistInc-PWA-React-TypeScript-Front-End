import { useEffect, useState } from 'react';
import { CardLoadingPlaceholder } from '../../../../../global/components/lib/dashboardCards/placeholder/CardLoadingPlaceholder';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import type { IProgressBarChartData } from '../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ProgressBarChart from '../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import { BarChartNoDataPlaceholder } from '../../../../../global/components/lib/progressBarChart/placeholder/NoDataPlaceholder';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import TargetSavingsChart from './namespace/TargetSavingsChart';

export default function TargetSavings(): JSX.Element {
   const {
      data: savingsAccounts,
      isLoading,
      isPaused,
      error,
   } = SavingsClass.useQuery.getSavingsAccounts();
   const [savingsAccChartData, setSavingsAccChartData] = useState<IProgressBarChartData[]>([]);
   const { isPortableDevice, isDarkTheme } = useThemeContext();
   const [showPlaceholder, setShowPlaceholder] = useState(true);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) {
         const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         const savingsAccWithSetTarget =
            TargetSavingsChart.getSavingsAccWithSetTarget(savingsAccAsArr);
         setShowPlaceholder(!MiscHelper.isNotFalsyOrEmpty(savingsAccWithSetTarget));
         const chartData = TargetSavingsChart.constructChartData(savingsAccWithSetTarget);
         setSavingsAccChartData(chartData);
      }
   }, [savingsAccounts]);

   if (isLoading && !isPaused && isPortableDevice) {
      return (
         <FlexColumnWrapper height="10em">
            <CardLoadingPlaceholder isDarkTheme={isDarkTheme} />
         </FlexColumnWrapper>
      );
   }
   if (isPaused) {
      return (
         <FlexCenterer height="100%" width="100%">
            <OfflineFetch />
         </FlexCenterer>
      );
   }
   if (error || !savingsAccounts) {
      return (
         <FlexCenterer height="90%" width="100%">
            <FetchError />
         </FlexCenterer>
      );
   }

   return (
      <FlexColumnWrapper>
         <TextColourizer padding="1em 0em 0em 1em">Target Savings</TextColourizer>
         <FlexColumnWrapper padding="1.5em 0em 0em 0em">
            <ConditionalRender condition={!showPlaceholder}>
               <ProgressBarChart
                  data={savingsAccChartData}
                  tooltipOptions={TargetSavingsChart.toolTipOptions}
                  barHeight={'1.5em'}
                  barWidth="80%"
               />
            </ConditionalRender>
            <ConditionalRender condition={showPlaceholder}>
               <FlexRowWrapper
                  height="100%"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  position="absolute"
                  style={{ bottom: 0 }}
               >
                  <TextColourizer color={'darkgrey'}>No Data For a Current Period</TextColourizer>
               </FlexRowWrapper>
               <FlexColumnWrapper height={isPortableDevice ? '10em' : '14.75em'}>
                  <BarChartNoDataPlaceholder horizontal />
               </FlexColumnWrapper>
            </ConditionalRender>
         </FlexColumnWrapper>
      </FlexColumnWrapper>
   );
}
