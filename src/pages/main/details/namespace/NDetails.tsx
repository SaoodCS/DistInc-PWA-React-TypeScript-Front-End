import AccountClass from '../../settings/components/account/class/AccountClass';
import IncomeClass from '../components/Income/class/Class';
import IncomeSlide from '../components/Income/slide/IncomeSlide';
import AccountsSlide from '../components/accounts/AccountsSlide';
import CurrentClass from '../components/accounts/current/class/Class';
import ExpensesClass from '../components/expense/class/ExpensesClass';
import ExpenseSlide from '../components/expense/slide/ExpenseSlide';

export namespace NDetails {
   export const slides = [
      {
         slideNo: 1,
         name: 'Income',
         component: <IncomeSlide />,
         inputNamesAndPlaceholders: IncomeClass.form.inputs.map((input) => ({
            prefix: 'income',
            name: input.name,
            placeholder: input.placeholder,
         })),
      },
      {
         slideNo: 2,
         name: 'Expense',
         component: <ExpenseSlide />,
         inputNamesAndPlaceholders: ExpensesClass.form.inputs.map((input) => ({
            prefix: 'expense',
            name: input.name,
            placeholder: input.placeholder,
         })),
      },
      {
         slideNo: 3,
         name: 'Accounts',
         component: <AccountsSlide />,
         inputNamesAndPlaceholders: CurrentClass.form.inputs.map((input) => ({
            prefix: 'account',
            name: input.name,
            placeholder: input.placeholder,
         })),
      },
   ];

   const storageKeyPrefix = 'detailsCarousel';
   export const key = {
      currentSlide: `${storageKeyPrefix}.currentSlide`,
      incomeSlide: `${storageKeyPrefix}.incomeSlide`,
      expenseSlide: `${storageKeyPrefix}.expenseSlide`,
      accountsSlide: `${storageKeyPrefix}.accountsSlide`,
   };
}

export default NDetails;
