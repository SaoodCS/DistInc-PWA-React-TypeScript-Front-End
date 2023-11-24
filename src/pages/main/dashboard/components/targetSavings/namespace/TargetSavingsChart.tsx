import type {
   IProgressBarChartData,
   IProgressBarTooltipOptions,
} from '../../../../../../global/components/lib/progressBarChart/ProgressBarChart';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import type { ISavingsFormInputs } from '../../../../details/components/accounts/savings/class/Class';

export namespace TargetSavingsChart {
   export const toolTipOptions: IProgressBarTooltipOptions = {
      positioning: 'center-right',
      width: '10em',
   };

   export function constructChartData(
      savingsAccAsArr: ISavingsFormInputs[],
   ): IProgressBarChartData[] {
      const savingsAccChartData = savingsAccAsArr.map((savingsAcc) => {
         const { accountName, targetToReach, currentBalance } = savingsAcc;
         return {
            label: accountName,
            target: targetToReach || 0,
            completedAmnt: currentBalance || 0,
         };
      });
      return savingsAccChartData;
   }

   export function getSavingsAccWithSetTarget(
      savingsAccAsArr: ISavingsFormInputs[],
   ): ISavingsFormInputs[] {
      return ArrayOfObjects.filterOut(savingsAccAsArr, 'targetToReach', 0);
   }
}

export default TargetSavingsChart;
