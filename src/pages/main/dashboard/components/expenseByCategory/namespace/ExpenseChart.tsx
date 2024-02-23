/* eslint-disable no-inner-declarations */
import Color from '../../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import type { IExpenseFormInputs } from '../../../../details/components/expense/class/ExpensesClass';

export namespace ExpenseChart {
   export namespace Selector {
      export type IExpenseBy = keyof IExpenseFormInputs | 'unpaused' | 'Yearly' | 'Monthly';

      export const key = 'expenseBy';
      type IGetLabelsAndValues = { expenseLabels: string[]; expenseValues: number[] };

      function getTypesAndSumValues(expenses: IExpenseFormInputs[]): IGetLabelsAndValues {
         const expenseMap: Record<string, number> = {};
         expenses.forEach((expense) => {
            const type = expense.expenseType.includes('Savings Transfer')
               ? 'Savings Transfer'
               : expense.expenseType;
            expenseMap[type] = (expenseMap[type] || 0) + expense.expenseValue;
         });
         const summedExpenses = Object.keys(expenseMap).map((expenseType) => ({
            expenseType,
            expenseValue: expenseMap[expenseType],
         }));
         const expenseLabels: string[] = summedExpenses.map((expense) => expense.expenseType);
         const expenseValues = summedExpenses.map((expense) => expense.expenseValue);
         return {
            expenseLabels,
            expenseValues,
         };
      }

      function getNamesAndValues(expenses: IExpenseFormInputs[]): IGetLabelsAndValues {
         const expenseLabels = expenses.map((expense) => expense.expenseName);
         const expenseValues = expenses.map((expense) => expense.expenseValue);
         return {
            expenseLabels,
            expenseValues,
         };
      }

      function getUnpausedAndValues(expenses: IExpenseFormInputs[]): IGetLabelsAndValues {
         const unpausedExpenses = ArrayOfObjects.filterOut(expenses, 'paused', 'true');
         const expenseLabels = unpausedExpenses.map((expense) => expense.expenseName);
         const expenseValues = unpausedExpenses.map((expense) => expense.expenseValue);
         return {
            expenseLabels,
            expenseValues,
         };
      }

      function getYearlyAndValues(expenses: IExpenseFormInputs[]): IGetLabelsAndValues {
         const yearlyExpenses = ArrayOfObjects.filterOut(expenses, 'frequency', 'Monthly');
         const expenseLabels = yearlyExpenses.map((expense) => expense.expenseName);
         const expenseValues = yearlyExpenses.map((expense) => expense.expenseValue);
         return {
            expenseLabels,
            expenseValues,
         };
      }

      function getMonthlyAndValues(expenses: IExpenseFormInputs[]): IGetLabelsAndValues {
         const monthlyExpenses = ArrayOfObjects.filterOut(expenses, 'frequency', 'Yearly');
         const expenseLabels = monthlyExpenses.map((expense) => expense.expenseName);
         const expenseValues = monthlyExpenses.map((expense) => expense.expenseValue);
         return {
            expenseLabels,
            expenseValues,
         };
      }

      export function getLabelsAndValues(
         expenses: IExpenseFormInputs[],
         expenseBy: IExpenseBy,
      ): IGetLabelsAndValues {
         if (expenseBy === 'expenseType') {
            return getTypesAndSumValues(expenses);
         } else if (expenseBy === 'expenseName') {
            return getNamesAndValues(expenses);
         } else if (expenseBy === 'unpaused') {
            return getUnpausedAndValues(expenses);
         } else if (expenseBy === 'Yearly') {
            return getYearlyAndValues(expenses);
         } else if (expenseBy === 'Monthly') {
            return getMonthlyAndValues(expenses);
         }
         throw new Error('Invalid expenseBy value');
      }
   }

   export const borderWidth = 1.5;

   export function backgroundColors(isDarkTheme: boolean): string[] {
      return [
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.6),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.6),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning, 0.6),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.6),
         //Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 0.6),
         // TODO: set for light mode too
         isDarkTheme ? 'rgba(136, 136, 136, 0.6)' : 'rgba(141, 127, 127, 0.6)',
         isDarkTheme ? 'rgba(105, 243, 255, 0.6)' : 'rgba(29, 174, 188, 0.6)',
         isDarkTheme ? 'rgba(161, 72, 161, 0.6)' : 'rgba(160, 36, 160, 0.6)',
         isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
         isDarkTheme ? 'rgba(125, 79, 46, 0.6)' : 'rgba(128, 65, 20, 0.6)',
         isDarkTheme ? 'rgba(38, 38, 117, 0.6)' : 'rgba(16, 16, 109, 0.6)',
         isDarkTheme ? 'rgba(47, 91, 71, 0.6)' : 'rgba(20, 87, 57, 0.6)',
      ];
   }

   export function borderColors(isDarkTheme: boolean): string[] {
      return [
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.9),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.9),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning, 0.9),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.9),
         //Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 0.9),
         // TODO: set for light mode too
         isDarkTheme ? 'rgba(136, 136, 136, 0.9)' : 'rgba(141, 127, 127, 0.9)',
         isDarkTheme ? 'rgba(105, 243, 255, 0.9)' : 'rgba(29, 174, 188, 0.9)',
         isDarkTheme ? 'rgba(161, 72, 161, 0.9)' : 'rgba(160, 36, 160, 0.9)',
         isDarkTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
         isDarkTheme ? 'rgba(125, 79, 46, 0.9)' : 'rgba(128, 65, 20, 0.9)',
         isDarkTheme ? 'rgba(38, 38, 117, 0.9)' : 'rgba(16, 16, 109, 0.9)',
         isDarkTheme ? 'rgba(47, 91, 71, 0.9)' : 'rgba(20, 87, 57, 0.9)',
      ];
   }
}

export default ExpenseChart;
