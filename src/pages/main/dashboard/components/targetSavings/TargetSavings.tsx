import { useEffect, useState } from 'react';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { ScrollableWrapper } from '../../../../../global/components/lib/positionModifiers/scrollableWrapper/ScrollableWrapper';
import ProgressBarChart, {
   IProgressBarChartData,
} from '../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import TargetSavingsChart from './namespace/TargetSavingsChart';

export default function TargetSavings() {
   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const [savingsAccChartData, setSavingsAccChartData] = useState<IProgressBarChartData[]>([]);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) {
         const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         const savingsAccWithSetTarget =
            TargetSavingsChart.getSavingsAccWithSetTarget(savingsAccAsArr);
         const chartData = TargetSavingsChart.constructChartData(savingsAccWithSetTarget);
         setSavingsAccChartData(chartData);
      }
   }, [savingsAccounts]);

   return (
      <FlexColumnWrapper height="100%" position="relative">
         <TextColourizer padding="1em 0em 0em 1em">Target Savings</TextColourizer>
         <ScrollableWrapper position="absolute" width="100%" bottom="0" top="4em">
            <ProgressBarChart
               data={savingsAccChartData}
               tooltipOptions={TargetSavingsChart.toolTipOptions}
               barHeight={'1.5em'}
               barWidth="80%"
            />
         </ScrollableWrapper>
      </FlexColumnWrapper>
   );
}
