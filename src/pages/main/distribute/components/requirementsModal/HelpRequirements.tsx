import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { BulletList, ListItem } from '../../../../../global/components/lib/list/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import IncomeClass from '../../../details/components/Income/class/Class';
import CurrentClass from '../../../details/components/accounts/current/class/Class';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import type { IReqNames } from '../distributerForm/class/DistributerClass';
import DistributerClass from '../distributerForm/class/DistributerClass';

export default function HelpRequirements(): JSX.Element {
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const { isDarkTheme } = useThemeContext();

   function itemColor(requirement: IReqNames): string {
      const reqCheck = DistributerClass.checkCalcReq(
         currentAccounts || {},
         income || {},
         expenses || {},
      );
      const isValid = ArrayOfObjects.getObjWithKeyValuePair(reqCheck, 'name', requirement).isValid;
      if (isValid) return isDarkTheme ? Color.darkThm.success : Color.lightThm.success;
      return isDarkTheme ? Color.darkThm.error : Color.lightThm.error;
   }

   return (
      <>
         <TextColourizer>
            The following are required in order to calculate your income distribution:
         </TextColourizer>
         <BulletList>
            <ListItem color={itemColor('salaryExp')}>Salary & Expenses Current Account</ListItem>
            <ListItem color={itemColor('spending')}>Spendings Current Account</ListItem>
            <ListItem color={itemColor('income')}>At least 1 Income</ListItem>
            <ListItem color={itemColor('expense')}>At least 1 Expense</ListItem>
         </BulletList>
      </>
   );
}
