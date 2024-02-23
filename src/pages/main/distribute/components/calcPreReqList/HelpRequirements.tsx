import ErrorMsg from '../../../../../global/components/lib/font/errorMsg/ErrorMsg';
import SuccessMsg from '../../../../../global/components/lib/font/successMsg/SuccessMsg';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { BulletList, ListItem } from '../../../../../global/components/lib/list/Style';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import IncomeClass from '../../../details/components/Income/class/Class';
import CurrentClass from '../../../details/components/accounts/current/class/Class';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import NDist from '../../namespace/NDist';

export default function HelpRequirements(): JSX.Element {
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();

   function isReqMet(requirement: NDist.Calc.IPreReqs): boolean {
      const reqCheck = NDist.Calc.checkPreReqsMet(
         currentAccounts || {},
         savingsAccounts || {},
         income || {},
         expenses || {},
      );
      const isValid = ArrayOfObjects.getObjWithKeyValuePair(reqCheck, 'name', requirement).isValid;
      return isValid;
   }

   return (
      <>
         <TextColourizer>
            The following are required in order to calculate your income distribution:
         </TextColourizer>
         <BulletList removeBullets>
            <ListItem>
               {isReqMet('salaryExp') && <SuccessMsg>Salary & Expenses Current Account</SuccessMsg>}
               {!isReqMet('salaryExp') && <ErrorMsg>Salary & Expenses Current Account</ErrorMsg>}
            </ListItem>
            <ListItem>
               {isReqMet('salaryExp') && <SuccessMsg>Spendings Current Account</SuccessMsg>}
               {!isReqMet('salaryExp') && <ErrorMsg>Spendings Current Account</ErrorMsg>}
            </ListItem>
            <ListItem>
               {isReqMet('savings') && <SuccessMsg>At least 1 Savings Account</SuccessMsg>}
               {!isReqMet('savings') && <ErrorMsg>At least 1 Savings Account</ErrorMsg>}
            </ListItem>
            <ListItem>
               {isReqMet('income') && <SuccessMsg>At least 1 Income</SuccessMsg>}
               {!isReqMet('income') && <ErrorMsg>At least 1 Income</ErrorMsg>}
            </ListItem>
            <ListItem>
               <ListItem>
                  {isReqMet('expense') && <SuccessMsg>At least 1 Expense</SuccessMsg>}
                  {!isReqMet('expense') && <ErrorMsg>At least 1 Expense</ErrorMsg>}
               </ListItem>
            </ListItem>
         </BulletList>
      </>
   );
}
