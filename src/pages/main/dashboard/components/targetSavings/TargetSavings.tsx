import { useEffect, useState } from 'react';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import RelativeLoader from '../../../../../global/components/lib/loader/RelativeLoader';
import { FlexCenterer } from '../../../../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ProgressBarChart, {
   IProgressBarChartData,
} from '../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import TargetSavingsChart from './namespace/TargetSavingsChart';

export default function TargetSavings() {
   const {
      data: savingsAccounts,
      isLoading,
      isPaused,
      error,
   } = SavingsClass.useQuery.getSavingsAccounts();
   const [savingsAccChartData, setSavingsAccChartData] = useState<IProgressBarChartData[]>([]);
   const { isPortableDevice } = useThemeContext();

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) {
         const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         const savingsAccWithSetTarget =
            TargetSavingsChart.getSavingsAccWithSetTarget(savingsAccAsArr);
         const chartData = TargetSavingsChart.constructChartData(savingsAccWithSetTarget);
         setSavingsAccChartData(chartData);
      }
   }, [savingsAccounts]);

   if (isLoading && !isPaused && isPortableDevice) {
      return (
         <FlexColumnWrapper padding="1em">
            <RelativeLoader isDisplayed />
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
            <ProgressBarChart
               data={savingsAccChartData}
               tooltipOptions={TargetSavingsChart.toolTipOptions}
               barHeight={'1.5em'}
               barWidth="80%"
            />
         </FlexColumnWrapper>
      </FlexColumnWrapper>
   );
}
