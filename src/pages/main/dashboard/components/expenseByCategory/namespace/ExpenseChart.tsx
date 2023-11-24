import Color from '../../../../../../global/css/colors';
import type { IExpenseFormInputs } from '../../../../details/components/expense/class/ExpensesClass';

export namespace ExpenseChart {
   export const borderWidth = 1.5;

   export function backgroundColors(isDarkTheme: boolean): string[] {
      return [
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.6),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.6),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning, 0.6),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.6),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 0.6),
      ];
   }

   export function borderColors(isDarkTheme: boolean): string[] {
      return [
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.9),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.9),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning, 0.9),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.9),
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 0.9),
      ];
   }

   type IGetTypesAndSumValues = { expenseTypes: string[]; expenseValues: number[] };
   export function getTypesAndSumValues(expenses: IExpenseFormInputs[]): IGetTypesAndSumValues {
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
      const expenseTypes: string[] = summedExpenses.map((expense) => expense.expenseType);
      const expenseValues = summedExpenses.map((expense) => expense.expenseValue);
      return {
         expenseTypes,
         expenseValues,
      };
   }
}

export default ExpenseChart;
