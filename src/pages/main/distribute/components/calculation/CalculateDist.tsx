import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../../details/components/Income/class/Class';
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
import NDist from '../../namespace/NDist';


export default class CalculateDist {
   // -- MAIN FUNCTION -- //
   static calculate(
      savingsAccounts: ISavingsAccountFirebase,
      currentAccounts: ICurrentAccountFirebase,
      incomes: IIncomeFirebase,
      expenses: IExpensesFirebase,
      leftovers: { [id: number]: number },
   ): NDist.ISchema {
      // Initial Setup:
      const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
      const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
      const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
      const currentAcc = this.formatCurrentAccounts(currentAccounts, leftovers);

      // Calculate Total Incomes & Expenses:
      const totalIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
      const totalExpenses = ArrayOfObjects.sumKeyValues(expenseArr, 'expenseValue');

      // Calculate Prev Month Analytics:
      const prevMonth = {
         totalSpendings: totalIncome - currentAcc.spendings.leftover,
         totalDisposableSpending: totalIncome - currentAcc.spendings.leftover - totalExpenses,
         totalSavings: currentAcc.spendings.leftover,
      };

      // Calculate Current Account Transfers:
      const currentAccTransfers = this.calcCurrentAccTransfers(
         currentAcc,
         totalIncome,
         totalExpenses,
         savingsAccArr,
      );

      // Calculate Expenses Transfers:
      const expensesTransfers = this.calcExpensesTransfers(expenseArr, savingsAccArr, currentAcc);

      // Create Savings Account History Array:
      const savingsAccountTransfers = [
         ...currentAccTransfers.savingsAccountTransfers,
         ...expensesTransfers.savingsAccountTransfers,
      ];
      const savingsAccHistory = this.updateSavingsAccHistory(
         savingsAccountTransfers,
         savingsAccArr,
      );

      // Create Messages Array
      const messages = [...currentAccTransfers.messages, ...expensesTransfers.messages];

      // Create Distributer Obj:
      const distributer = {
         timestamp: DateHelper.toDDMMYYYY(new Date()),
         msgs: messages,
      };

      // Create Analytics Obj:
      const analytics = {
         totalIncomes: totalIncome,
         totalExpenses: totalExpenses,
         prevMonth: prevMonth,
         timestamp: DateHelper.toDDMMYYYY(new Date()),
      };

      return {
         distributer: [distributer],
         savingsAccHistory: savingsAccHistory,
         analytics: [analytics],
      };
   }

   // -- CALC TRANSFERS FUNC: CURRENTACC TRANSFERS -- //
   private static calcCurrentAccTransfers(
      currentAcc: IFormattedCurrentAcc,
      totalIncome: number,
      totalExpense: number,
      savingsAccArr: ISavingsFormInputs[],
   ): ICalcTransfers {
      let salaryExpToTransferLeftoversAcc: number = 0;
      let salaryExpToSpendingAcc: number = 0;
      const messages: string[] = [];
      const savingsAccountTransfers: ISavingsAccountTransfers = [];

      const isLeftoverLessThanMinCushion =
         currentAcc.salaryExp.leftover < currentAcc.salaryExp.minCushion;

      if (isLeftoverLessThanMinCushion) {
         salaryExpToTransferLeftoversAcc = currentAcc.salaryExp.leftover;
         salaryExpToSpendingAcc = totalIncome - totalExpense - currentAcc.salaryExp.minCushion;
      }
      if (!isLeftoverLessThanMinCushion) {
         salaryExpToTransferLeftoversAcc =
            currentAcc.salaryExp.leftover - currentAcc.salaryExp.minCushion;
         salaryExpToSpendingAcc = totalIncome - totalExpense;
      }
      if (!currentAcc.salaryExp.hasTransferLeftoversTo) {
         salaryExpToSpendingAcc = salaryExpToSpendingAcc + salaryExpToTransferLeftoversAcc;
      }

      const salaryExpToSpendingAccMsg = `Leftover amount to transfer from ${
         currentAcc.salaryExp.accountName
      } to ${currentAcc.spendings.accountName}: ${NumberHelper.asCurrencyStr(
         salaryExpToSpendingAcc,
      )}`;

      messages.push(salaryExpToSpendingAccMsg);

      const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAcc);

      for (let i = 0; i < currentAccArr.length; i++) {
         const acc = currentAccArr[i];
         if (!acc.hasTransferLeftoversTo) continue;
         const savingsAccToTransferTo = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            acc.transferLeftoversTo,
         );
         const transferLeftoverToAccName = savingsAccToTransferTo.accountName;
         const amountToTransfer =
            acc.accountType === 'Salary & Expenses'
               ? salaryExpToTransferLeftoversAcc
               : acc.leftover;
         const leftoverToTransferToMsg = `Leftover amount to transfer from ${
            acc.accountName
         } to ${transferLeftoverToAccName}: ${NumberHelper.asCurrencyStr(amountToTransfer)}`;
         messages.push(leftoverToTransferToMsg);

         if (savingsAccToTransferTo.isTracked === 'true') {
            const savingsAccHistoryObj = {
               id: savingsAccToTransferTo.id,
               amountToTransfer: amountToTransfer,
            };
            savingsAccountTransfers.push(savingsAccHistoryObj);
         }
      }
      return {
         messages,
         savingsAccountTransfers,
      };
   }

   // -- CALC TRANSFERS FUNC: EXPENSES TRANSFERS -- //
   private static calcExpensesTransfers(
      expenseArr: IExpenseFormInputs[],
      savingsAccArr: ISavingsFormInputs[],
      currentAcc: IFormattedCurrentAcc,
   ): ICalcTransfers {
      const messages: string[] = [];
      const savingsAccountTransfers: ISavingsAccountTransfers = [];

      for (let i = 0; i < expenseArr.length; i++) {
         const expense = expenseArr[i];
         if (expense.paused === 'true') continue; //skip expense if paused
         const isExpenseTypeSavingsTransfer = expense.expenseType.includes('Savings');
         const isPaymentTypeManual = expense.paymentType === 'Manual';

         if (isExpenseTypeSavingsTransfer) {
            const savingsAccId = Number(expense.expenseType.split(':')[1]);
            const savingsAcc = ArrayOfObjects.getObjWithKeyValuePair(
               savingsAccArr,
               'id',
               savingsAccId,
            );
            if (savingsAcc.isTracked === 'true') {
               const amountToTransfer = expense.expenseValue;
               const savingsAccHistoryObj = {
                  id: savingsAcc.id,
                  amountToTransfer: amountToTransfer,
               };
               savingsAccountTransfers.push(savingsAccHistoryObj);
            }
            if (isPaymentTypeManual) {
               messages.push(
                  `Manual Expense: Amount to transfer from ${currentAcc.salaryExp.accountName} to ${
                     savingsAcc.accountName
                  }: ${NumberHelper.asCurrencyStr(expense.expenseValue)}`,
               );
            }
         }
         if (!isExpenseTypeSavingsTransfer && isPaymentTypeManual) {
            messages.push(
               `Manual Expense: Make Payment from ${
                  currentAcc.salaryExp.accountName
               } for expense: ${expense.expenseName}: ${NumberHelper.asCurrencyStr(
                  expense.expenseValue,
               )}`,
            );
         }
      }
      return {
         messages,
         savingsAccountTransfers,
      };
   }

   // -- CALC BALANCES AND UPDATE SAVINGSACC HISTORY -- //
   private static updateSavingsAccHistory(
      savingsAccountTransfers: ISavingsAccountTransfers,
      savingsAccArr: ISavingsFormInputs[],
   ): NDist.ISavingsAccHist[] {
      const savingsAccHistory: NDist.ISavingsAccHist[] = [];
      const savingsAccHistoryObjArr = savingsAccountTransfers.reduce(
         (acc, curr) => {
            const doesExistInArray = acc.find((item) => item.id === curr.id);
            if (doesExistInArray) {
               const index = acc.findIndex((item) => item.id === curr.id);
               acc[index].amountToTransfer = acc[index].amountToTransfer + curr.amountToTransfer;
            }
            if (!doesExistInArray) {
               acc.push(curr);
            }
            return acc;
         },
         [] as { id: number; amountToTransfer: number }[],
      );

      savingsAccHistoryObjArr.forEach((item) => {
         const savingsAcc = ArrayOfObjects.getObjWithKeyValuePair(savingsAccArr, 'id', item.id);
         const newBalance = (savingsAcc.currentBalance || 0) + item.amountToTransfer;
         const savingsAccHistoryObj = {
            id: savingsAcc.id,
            balance: newBalance,
            timestamp: DateHelper.toDDMMYYYY(new Date()),
         };
         savingsAccHistory.push(savingsAccHistoryObj);
      });

      return savingsAccHistory;
   }

   // -- FORMAT CURRENT ACCOUNTS -- //
   private static formatCurrentAccounts(
      currentAccounts: ICurrentAccountFirebase,
      leftovers: { [id: number]: number },
   ): IFormattedCurrentAcc {
      const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
      const currentAccWithLeftovers = currentAccArr.map((acc) => {
         const leftover = leftovers[acc.id];
         const hasTransferLeftoversTo = acc.transferLeftoversTo !== '';
         return {
            ...acc,
            leftover,
            hasTransferLeftoversTo,
         };
      });

      const salaryExp: ICurrentFormInputs & {
         leftover: number;
         hasTransferLeftoversTo: boolean;
      } = ArrayOfObjects.getObjWithKeyValuePair(
         currentAccWithLeftovers,
         'accountType',
         'Salary & Expenses',
      );

      const spendings: ICurrentFormInputs & {
         leftover: number;
         hasTransferLeftoversTo: boolean;
      } = ArrayOfObjects.getObjWithKeyValuePair(currentAccWithLeftovers, 'accountType', 'Spending');

      const currentAcc = {
         salaryExp: salaryExp,
         spendings,
      };

      return currentAcc;
   }
}

// -- PRIVATE TYPES -- //

interface IFormattedCurrentAcc {
   [key: string]: ICurrentFormInputs & {
      leftover: number;
      hasTransferLeftoversTo: boolean;
   };
}

type ISavingsAccountTransfers = {
   id: number;
   amountToTransfer: number;
}[];

type ICalcTransfers = {
   messages: string[];
   savingsAccountTransfers: ISavingsAccountTransfers;
};
