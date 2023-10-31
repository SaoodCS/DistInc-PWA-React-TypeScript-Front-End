import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../details/components/Income/class/Class';
import type {
   ICurrentAccountFirebase,
   ICurrentFormInputs,
} from '../../details/components/accounts/current/class/Class';
import type {
   ISavingsAccountFirebase,
   ISavingsFormInputs,
} from '../../details/components/accounts/savings/class/Class';
import type {
   IExpenseFormInputs,
   IExpensesFirebase,
} from '../../details/components/expense/class/ExpensesClass';

export interface ICalcSchema {
   distributer: {
      timestamp: string;
      msgs: string[];
   }[];
   savingsAccHistory: {
      id: number;
      balance: number;
      timestamp: string;
   }[];
   analytics: {
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

type IFormattedCurrentAcc = {
   salaryExp: ICurrentFormInputs & {
      leftover: number;
      hasTransferLeftoversTo: boolean;
   };
   spendings: ICurrentFormInputs & {
      leftover: number;
      hasTransferLeftoversTo: boolean;
   };
};

type ISavingsAccountTransfers = {
   id: number;
   amountToTransfer: number;
}[];

export default function calculateDist(
   savingsAccounts: ISavingsAccountFirebase,
   currentAccounts: ICurrentAccountFirebase,
   incomes: IIncomeFirebase,
   expenses: IExpensesFirebase,
   leftovers: { [id: number]: number },
): ICalcSchema {
   // Initial Setup:
   const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
   const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
   const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
   const currentAcc = formatCurrentAccounts(currentAccounts, leftovers);

   // Calculate Total Income & Expenses:
   const totalIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
   const totalExpenses = ArrayOfObjects.sumKeyValues(expenseArr, 'expenseValue');

   // Current Account Transfers:
   const currentAccTransfers = calcCurrentAccTransfers(
      currentAcc,
      totalIncome,
      totalExpenses,
      savingsAccArr,
   );

   // Expenses Transfers:
   const expensesTransfers = calcExpensesTransfers(expenseArr, savingsAccArr, currentAcc);

   // Create Savings Account History Array:
   const savingsAccountTransfers = [
      ...currentAccTransfers.savingsAccountTransfers,
      ...expensesTransfers.savingsAccountTransfers,
   ];
   const savingsAccHistory = updateSavingsAccHistory(savingsAccountTransfers, savingsAccArr);

   // Create Messages Array
   const messages = [...currentAccTransfers.messages, ...expensesTransfers.messages];

   // Create Distributer Array:
   const distributer = [
      {
         timestamp: DateHelper.toDDMMYYYY(new Date()),
         msgs: messages,
      },
   ];

   // Create Analytics Array:
   const analytics = [
      {
         totalIncomes: totalIncome,
         totalExpenses: totalExpenses,
         prevMonth: {
            totalSpendings: totalIncome - currentAcc.spendings.leftover,
            totalDisposableSpending: totalIncome - currentAcc.spendings.leftover - totalExpenses,
            totalSavings: currentAcc.spendings.leftover,
         },
         timestamp: DateHelper.toDDMMYYYY(new Date()),
      },
   ];

   return {
      distributer: distributer,
      savingsAccHistory: savingsAccHistory,
      analytics: analytics,
   };
}

// --------------------------------------------------------------------------------------------------------------------- //

function formatCurrentAccounts(
   currentAccounts: ICurrentAccountFirebase,
   leftovers: { [id: number]: number },
) {
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

// --------------------------------------------------------------------------------------------------------------------- //

function calcCurrentAccTransfers(
   currentAcc: IFormattedCurrentAcc,
   totalIncome: number,
   totalExpense: number,
   savingsAccArr: ISavingsFormInputs[],
) {
   let salaryExpToTransferLeftoversAcc: number = 0;
   let salaryExpToSpendingAcc: number = 0;
   let messages: string[] = [];
   let savingsAccountTransfers = [];

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
   } to ${currentAcc.spendings.accountName}: ${NumberHelper.asCurrencyStr(salaryExpToSpendingAcc)}`;

   messages.push(salaryExpToSpendingAccMsg);

   const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAcc);

   for (let i = 0; i < currentAccArr.length; i++) {
      const acc = currentAccArr[i];
      if (acc.hasTransferLeftoversTo) {
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

         if (savingsAccToTransferTo.targetToReach) {
            const savingsAccHistoryObj = {
               id: savingsAccToTransferTo.id,
               amountToTransfer: amountToTransfer,
            };
            savingsAccountTransfers.push(savingsAccHistoryObj);
         }
      }
   }

   return {
      messages,
      savingsAccountTransfers,
   };
}

// --------------------------------------------------------------------------------------------------------------------- //

function calcExpensesTransfers(
   expenseArr: IExpenseFormInputs[],
   savingsAccArr: ISavingsFormInputs[],
   currentAcc: IFormattedCurrentAcc,
) {
   let messages: string[] = [];
   const activeExpenses = ArrayOfObjects.filterOut(expenseArr, 'paused', 'true');
   let savingsAccountTransfers = [];

   for (let i = 0; i < activeExpenses.length; i++) {
      const isExpenseTypeSavingsTransfer = activeExpenses[i].expenseType.includes('Savings');
      const isPaymentTypeManual = activeExpenses[i].paymentType === 'Manual';

      if (isExpenseTypeSavingsTransfer) {
         const savingsAccId = Number(activeExpenses[i].expenseType.split(':')[1]);
         const savingsAcc = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            savingsAccId,
         );
         if (savingsAcc.targetToReach) {
            const amountToTransfer = activeExpenses[i].expenseValue;
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
               }: ${NumberHelper.asCurrencyStr(activeExpenses[i].expenseValue)}`,
            );
         }
      }
      if (!isExpenseTypeSavingsTransfer && isPaymentTypeManual) {
         messages.push(
            `Manual Expense: Make Payment from ${currentAcc.salaryExp.accountName} for expense: ${
               activeExpenses[i].expenseName
            }: ${NumberHelper.asCurrencyStr(activeExpenses[i].expenseValue)}`,
         );
      }
   }
   return {
      messages,
      savingsAccountTransfers,
   };
}

// --------------------------------------------------------------------------------------------------------------------- //

function updateSavingsAccHistory(
   savingsAccountTransfers: ISavingsAccountTransfers,
   savingsAccArr: ISavingsFormInputs[],
): ICalcSchema['savingsAccHistory'] {
   let savingsAccHistory: ICalcSchema['savingsAccHistory'] = [];

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
