import { TextColourizer } from '../../../../global/components/lib/font/textColorizer/TextColourizer';
import { BulletList, ListItem } from '../../../../global/components/lib/list/Style';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../global/css/colors';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import IncomeClass from '../../details/components/Income/class/Class';
import CurrentClass from '../../details/components/accounts/current/class/Class';
import ExpensesClass from '../../details/components/expense/class/ExpensesClass';

export default function HelpRequirements(): JSX.Element {
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const { isDarkTheme } = useThemeContext();

   function itemColor(requirement: 'salaryExp' | 'spending' | 'income' | 'expense'): string {
      const salaryExpAcc =
         currentAccounts &&
         ObjectOfObjects.findObjFromUniqueVal(currentAccounts, 'Salary & Expenses');
      const spendingAcc =
         currentAccounts && ObjectOfObjects.findObjFromUniqueVal(currentAccounts, 'Spending');
      if (requirement === 'salaryExp' && salaryExpAcc) {
         return isDarkTheme ? Color.darkThm.success : Color.lightThm.success;
      }
      if (requirement === 'spending' && spendingAcc) {
         return isDarkTheme ? Color.darkThm.success : Color.lightThm.success;
      }
      if (requirement === 'income' && income && !ObjectOfObjects.isEmpty(income)) {
         return isDarkTheme ? Color.darkThm.success : Color.lightThm.success;
      }
      if (requirement === 'expense' && expenses && !ObjectOfObjects.isEmpty(expenses)) {
         return isDarkTheme ? Color.darkThm.success : Color.lightThm.success;
      }
      return 'red';
   }

   return (
      <>
         <TextColourizer>
            The following are required in order to calculate your income distribution:
         </TextColourizer>
         <BulletList>
            <ListItem color={itemColor('salaryExp')}>"Salary & Expense" Current Account</ListItem>
            <ListItem color={itemColor('spending')}>"Spending" Current Account</ListItem>
            <ListItem color={itemColor('income')}>At least 1 Income</ListItem>
            <ListItem color={itemColor('expense')}>At least 1 Expense</ListItem>
         </BulletList>
      </>
   );
}
