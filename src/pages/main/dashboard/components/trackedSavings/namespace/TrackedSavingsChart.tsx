import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { ISavingsFormInputs } from '../../../../details/components/accounts/savings/class/Class';

export namespace TrackedSavingsChart {
   export const currentlySelectedKey = 'displayedSavingsAcc';

   export function getAccounts(savingsAccAsArr: ISavingsFormInputs[]): ISavingsFormInputs[] {
      const savingsAccWithTrackedTrue = ArrayOfObjects.getObjectsWithKeyValuePair(
         savingsAccAsArr,
         'isTracked',
         'true',
      );
      return savingsAccWithTrackedTrue;
   }

   export function getSelectedAccount(
      savingsAccAsArr: ISavingsFormInputs[],
      selectedSavingsAccName: string,
   ): ISavingsFormInputs | undefined {
      const savingsAccToDisplayObj = ArrayOfObjects.getObjWithKeyValuePair(
         savingsAccAsArr,
         'accountName',
         selectedSavingsAccName,
      );
      return savingsAccToDisplayObj;
   }
}

export default TrackedSavingsChart;
