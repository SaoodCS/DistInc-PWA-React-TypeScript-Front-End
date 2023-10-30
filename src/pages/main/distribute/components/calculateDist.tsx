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

export default function calculateDist(
   savingsAccounts: ISavingsAccountFirebase,
   currentAccounts: ICurrentAccountFirebase,
   incomes: IIncomeFirebase,
   expenses: IExpensesFirebase,
   leftovers: { [id: number]: number },
): ICalcSchema {
   // Initial Setup:
   let savingsAccHistory: ICalcSchema['savingsAccHistory'] = [];
   let messages: ICalcSchema['distributer'][0]['msgs'] = [];

   const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
   const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
   const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
   const totalIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
   const totalExpenses = ArrayOfObjects.sumKeyValues(expenseArr, 'expenseValue');
   const currentAcc = formatCurrentAccounts(currentAccounts, leftovers);

   const currentAccCalculations = currentAccCalcs(
      currentAcc,
      totalIncome,
      totalExpenses,
      savingsAccArr,
      savingsAccHistory,
   );
   messages.push(...currentAccCalculations.messages);
   savingsAccHistory.push(...currentAccCalculations.savingsAccHistory);

   // Manual Expense Calculations:
   const manualExpenseCalculations = expenseCalcs(
      expenseArr,
      savingsAccArr,
      currentAcc,
      savingsAccHistory,
   );
   messages.push(...manualExpenseCalculations.messages);
   savingsAccHistory.push(...manualExpenseCalculations.savingsAccHistory);

   // Delete duplicates in savingsAccHistoryArray:
   savingsAccHistory = ArrayOfObjects.deleteDuplicates(savingsAccHistory, 'id');

   // Create Distributer object:
   const distributer = {
      timestamp: DateHelper.toDDMMYYYY(new Date()),
      msgs: messages,
   };

   // create Analytics object:
   const analytics = {
      totalIncomes: totalIncome,
      totalExpenses: totalExpenses,
      prevMonth: {
         totalSpendings: totalIncome - currentAcc.spendings.leftover,
         totalDisposableSpending: totalIncome - currentAcc.spendings.leftover - totalExpenses,
         totalSavings: currentAcc.spendings.leftover,
      },
      timestamp: DateHelper.toDDMMYYYY(new Date()),
   };

   return {
      distributer: [distributer],
      savingsAccHistory: savingsAccHistory,
      analytics: [analytics],
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

function currentAccCalcs(
   currentAcc: {
      salaryExp: ICurrentFormInputs & {
         leftover: number;
         hasTransferLeftoversTo: boolean;
      };
      spendings: ICurrentFormInputs & {
         leftover: number;
         hasTransferLeftoversTo: boolean;
      };
   },
   totalIncome: number,
   totalExpense: number,
   savingsAccArr: ISavingsFormInputs[],
   savingsAccHistory: ICalcSchema['savingsAccHistory'],
) {
   let salaryExpToTransferLeftoversAcc: number = 0;
   let salaryExpToSpendingAcc: number = 0;
   let messages: string[] = [];

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

   for (const accountKey in currentAcc) {
      if (currentAcc.hasOwnProperty(accountKey)) {
         const acc = currentAcc[accountKey as keyof typeof currentAcc];
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
               savingsAccHistory = updateSavingsAccHistory(
                  savingsAccHistory,
                  savingsAccToTransferTo,
                  amountToTransfer,
               );
            }
         }
      }
   }

   return {
      messages,
      savingsAccHistory,
   };
}

// --------------------------------------------------------------------------------------------------------------------- //

function expenseCalcs(
   expenseArr: IExpenseFormInputs[],
   savingsAccArr: ISavingsFormInputs[],
   currentAcc: {
      salaryExp: ICurrentFormInputs & {
         leftover: number;
         hasTransferLeftoversTo: boolean;
      };
      spendings: ICurrentFormInputs & {
         leftover: number;
         hasTransferLeftoversTo: boolean;
      };
   },
   savingsAccHistory: ICalcSchema['savingsAccHistory'],
) {
   let messages: string[] = [];

   const activeExpenses = expenseArr.filter((exp) => exp.paused === 'false');
   for (let i = 0; i < activeExpenses.length; i++) {
      const isExpenseTypeSavingsTransfer =
         activeExpenses[i].expenseType.includes('Savings Transfer');
      if (isExpenseTypeSavingsTransfer) {
         const savingsAccId = Number(activeExpenses[i].expenseType.split(':')[1]);
         const savingsAcc = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            savingsAccId,
         );
         if (savingsAcc.targetToReach) {
            const amountToTransfer = activeExpenses[i].expenseValue;
            savingsAccHistory = updateSavingsAccHistory(
               savingsAccHistory,
               savingsAcc,
               amountToTransfer,
            );
         }
         if (activeExpenses[i].paymentType === 'Manual') {
            messages.push(
               `Manual Expense: Amount to transfer from ${currentAcc.salaryExp.accountName} to ${
                  savingsAcc.accountName
               }: ${NumberHelper.asCurrencyStr(activeExpenses[i].expenseValue)}`,
            );
         }
      }
      if (!isExpenseTypeSavingsTransfer && activeExpenses[i].paymentType === 'Manual') {
         messages.push(
            `Manual Expense: Make Payment from ${currentAcc.salaryExp.accountName} for expense: ${
               activeExpenses[i].expenseName
            }: ${NumberHelper.asCurrencyStr(activeExpenses[i].expenseValue)}`,
         );
      }
   }
   return {
      messages,
      savingsAccHistory,
   };
}

// --------------------------------------------------------------------------------------------------------------------- //

function updateSavingsAccHistory(
   savingsAccHistoryArr: ICalcSchema['savingsAccHistory'],
   savingsAccToTransferTo: ISavingsFormInputs,
   amountToTransfer: number,
) {
   const savingsAccHistoryArrCopy = [...savingsAccHistoryArr];
   const doesExistInArray = savingsAccHistoryArr.find(
      (item) => item.id === savingsAccToTransferTo.id,
   );
   if (doesExistInArray) {
      const index = savingsAccHistoryArr.findIndex((item) => item.id === savingsAccToTransferTo.id);
      const updatedBalance = savingsAccHistoryArr[index].balance + amountToTransfer;
      savingsAccHistoryArrCopy[index].balance = updatedBalance;
   }
   if (!doesExistInArray) {
      const balance = (savingsAccToTransferTo.currentBalance || 0) + amountToTransfer;
      const savingsAccHistoryObj = {
         id: savingsAccToTransferTo.id,
         balance: balance,
         timestamp: DateHelper.toDDMMYYYY(new Date()),
      };
      savingsAccHistoryArrCopy.push(savingsAccHistoryObj);
   }
   return savingsAccHistoryArrCopy;
}
