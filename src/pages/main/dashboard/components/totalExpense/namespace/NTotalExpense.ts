import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import type { IExpenseFormInputs } from '../../../../details/components/expense/class/ExpensesClass';

namespace NTotalExpense {
   export const getTotal = {
      all: (expenseDataAsArr: IExpenseFormInputs[]) => {
         return ArrayOfObjects.calcSumOfKeyValue(expenseDataAsArr, 'expenseValue');
      },

      unpaused: (expenseDataAsArr: IExpenseFormInputs[]) => {
         const unpausedExpenses = ArrayOfObjects.filterIn(expenseDataAsArr, 'paused', 'false');
         if (!MiscHelper.isNotFalsyOrEmpty(unpausedExpenses)) return 0;
         return ArrayOfObjects.calcSumOfKeyValue(unpausedExpenses, 'expenseValue');
      },
   };

   export const key = {
      isPausedExcluded: 'isPausedExcluded',
   };
}

export default NTotalExpense;
