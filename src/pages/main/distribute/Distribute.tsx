import { StyledForm } from '../../../global/components/lib/form/form/Style';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import SavingsClass from '../details/components/accounts/savings/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import DistributeForm from './components/distributerForm/DistributerForm';

export default function Distribute(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Distribute');
   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();

   return (
      <>
         <DistributeForm />
      </>
   );
}
