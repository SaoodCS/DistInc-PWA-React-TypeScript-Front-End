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

      monthly: (expenseDataAsArr: IExpenseFormInputs[]) => {
         const monthlyExpenses = ArrayOfObjects.filterOut(expenseDataAsArr, 'frequency', 'Yearly');
         if (!MiscHelper.isNotFalsyOrEmpty(monthlyExpenses)) return 0;
         return ArrayOfObjects.calcSumOfKeyValue(monthlyExpenses, 'expenseValue');
      },

      yearly: (expenseDataAsArr: IExpenseFormInputs[]) => {
         const yearlyExpenses = ArrayOfObjects.filterOut(expenseDataAsArr, 'frequency', 'Monthly');
         if (!MiscHelper.isNotFalsyOrEmpty(yearlyExpenses)) return 0;
         return ArrayOfObjects.calcSumOfKeyValue(yearlyExpenses, 'expenseValue');
      },

      yearlyUnpaused: (expenseDataAsArr: IExpenseFormInputs[]) => {
         const yearlyExpenses = ArrayOfObjects.filterOut(expenseDataAsArr, 'frequency', 'Monthly');
         const unpausedExpenses = ArrayOfObjects.filterIn(yearlyExpenses, 'paused', 'false');
         if (!MiscHelper.isNotFalsyOrEmpty(unpausedExpenses)) return 0;
         return ArrayOfObjects.calcSumOfKeyValue(unpausedExpenses, 'expenseValue');
      },

      monthlyUnpaused: (expenseDataAsArr: IExpenseFormInputs[]) => {
         const monthlyExpenses = ArrayOfObjects.filterOut(expenseDataAsArr, 'frequency', 'Yearly');
         const unpausedExpenses = ArrayOfObjects.filterIn(monthlyExpenses, 'paused', 'false');
         if (!MiscHelper.isNotFalsyOrEmpty(unpausedExpenses)) return 0;
         return ArrayOfObjects.calcSumOfKeyValue(unpausedExpenses, 'expenseValue');
      },
   };

   export const key = {
      isPausedExcluded: 'isPausedExcluded',
      totalYearlyOrMonthly: 'totalYearlyOrMonthly',
   };

   export type ITotalYearlyOrMonthly = 'Yearly' | 'Monthly' | 'All';
}

export default NTotalExpense;
