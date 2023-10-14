import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type {
   IIncomeFirebase,
   IIncomeFormInputs,
} from '../../../details/components/Income/class/Class';
import type {
   ICurrentAccountFirebase,
   ICurrentFormInputs,
} from '../../../details/components/accounts/current/class/Class';
import type {
   ISavingsAccountFirebase,
   ISavingsFormInputs,
} from '../../../details/components/accounts/savings/class/Class';
import type {
   IExpenseFormInputs,
   IExpensesFirebase,
} from '../../../details/components/expense/class/ExpensesClass';

interface ICalcSchema {
   distributer: {
      timestamp: string;
      msgs: string[];
   }[];
   savingsAccounts: {
      id: string;
      balance: number;
      timestamp: string;
   }[];
   calculations: {
      totalIncomes: number;
      totalExpenses: number;
      prevMonth: {
         totalSpendings: number;
         totalDisposableSpending: number;
         totalSavings: number;
      };
      timestamp: string;
   }[];
}

export default class CalculationsClass {
   // -- Setup -- //
   constructor(
      savingsAccounts: ISavingsAccountFirebase,
      currentAccounts: ICurrentAccountFirebase,
      incomes: IIncomeFirebase,
      expenses: IExpensesFirebase,
      leftovers: { [id: number]: number },
   ) {
      this.savingsAccounts = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
      this.currentAccounts = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
      this.incomes = ObjectOfObjects.convertToArrayOfObj(incomes);
      this.expenses = ObjectOfObjects.convertToArrayOfObj(expenses);
      this.leftovers = leftovers;
   }
   private savingsAccounts: ISavingsFormInputs[];
   private currentAccounts: ICurrentFormInputs[];
   private incomes: IIncomeFormInputs[];
   private expenses: IExpenseFormInputs[];
   private leftovers: { [id: number]: number };

   // -- Methods -- //
   get totalIncomes(): number {
      return this.incomes.reduce((acc, curr) => acc + curr.incomeValue, 0);
   }

   get totalExpenses(): number {
      return this.expenses.reduce((acc, curr) => acc + curr.expenseValue, 0);
   }

   get currentAccWithLeftovers(): (ICurrentFormInputs & { leftover: number })[] {
      const currentAccounts = this.currentAccounts.map((acc) => {
         const leftover = this.leftovers[acc.id];
         return { ...acc, leftover };
      });
      return currentAccounts;
   }
}
