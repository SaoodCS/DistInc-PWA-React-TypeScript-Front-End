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
         sortDataOptions: IncomeClass.form.inputs.map((input) => ({
            sortUrlKey: 'sortIncomeBy',
            orderUrlKey: 'orderIncome',
            name: input.name,
            placeholder: input.placeholder,
            menuHeight: 195,
         })),
      },
      {
         slideNo: 2,
         name: 'Expense',
         component: <ExpenseSlide />,
         sortDataOptions: ExpensesClass.form.inputs.map((input) => ({
            sortUrlKey: 'sortExpenseBy',
            orderUrlKey: 'orderExpense',
            name: input.name,
            placeholder: input.placeholder,
            menuHeight: 295,
         })),
      },
      {
         slideNo: 3,
         name: 'Accounts',
         component: <AccountsSlide />,
         sortDataOptions: [
            ...CurrentClass.form.inputs
               .filter((input) => input.name === 'accountName' || input.name === 'accountType')
               .map((input) => ({
                  sortUrlKey: 'sortAccountsBy',
                  orderUrlKey: 'orderAccounts',
                  name: input.name,
                  placeholder: input.placeholder,
                  menuHeight: 230,
               })),
            {
               sortUrlKey: 'sortAccountsBy',
               orderUrlKey: 'orderAccounts',
               name: 'category',
               placeholder: 'Category',
               menuHeight: 230,
            },
         ],
      },
   ];

   export const keys = {
      localStorage: {
         currentSlide: `detailsCarousel.currentSlide`,
         incomeSlide: `detailsCarousel.incomeSlide`,
         expenseSlide: `detailsCarousel.expenseSlide`,
         accountsSlide: `detailsCarousel.accountsSlide`,
      },
      searchParams: {
         sort: {
            income: getSearchParamKey(slides, 'Income', 'sort'),
            expense: getSearchParamKey(slides, 'Expense', 'sort'),
            accounts: getSearchParamKey(slides, 'Accounts', 'sort'),
         },
         order: {
            income: getSearchParamKey(slides, 'Income', 'order'),
            expense: getSearchParamKey(slides, 'Expense', 'order'),
            accounts: getSearchParamKey(slides, 'Accounts', 'order'),
         },
      },
   };
}

export default NDetails;

function getSearchParamKey(
   slides: typeof NDetails.slides,
   slideName: string,
   sortOrOrder: 'sort' | 'order',
): string {
   const slide = slides.filter((slide) => slide.name === slideName)[0];
   return slide.sortDataOptions[0][`${sortOrOrder}UrlKey`];
}
