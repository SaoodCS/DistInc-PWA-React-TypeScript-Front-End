import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import type { ISavingsFormInputs } from '../../../../details/components/accounts/savings/class/Class';

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
      if (MiscHelper.isNotFalsyOrEmpty(savingsAccToDisplayObj)) return savingsAccToDisplayObj;
      const trackedAccounts = getAccounts(savingsAccAsArr);
      if (trackedAccounts.length === 0) return undefined;
      return trackedAccounts[0];
   }

   export function setSelectedAccountInitialName(
      savingsAccAsArr: ISavingsFormInputs[],
      selectedSavingsAccName: string,
   ): string {
      if (MiscHelper.isNotFalsyOrEmpty(selectedSavingsAccName)) return selectedSavingsAccName;
      const initialAccount = getSelectedAccount(savingsAccAsArr, selectedSavingsAccName);
      if (MiscHelper.isNotFalsyOrEmpty(initialAccount)) return initialAccount.accountName;
      return '';
   }
}

export default TrackedSavingsChart;
