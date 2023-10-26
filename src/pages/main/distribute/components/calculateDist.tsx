import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../details/components/Income/class/Class';
import type { ICurrentAccountFirebase } from '../../details/components/accounts/current/class/Class';
import type { ISavingsAccountFirebase } from '../../details/components/accounts/savings/class/Class';
import type { IExpensesFirebase } from '../../details/components/expense/class/ExpensesClass';

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
   const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
   const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
   const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
   const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
   const currentAccWithLeftovers = currentAccArr.map((acc) => {
      const leftover = leftovers[acc.id];
      return {
         ...acc,
         leftover,
      };
   });
   const salaryExpAcc = ArrayOfObjects.getObjWithKeyValuePair(
      currentAccWithLeftovers,
      'accountType',
      'Salary & Expenses',
   );
   const spendingAcc = ArrayOfObjects.getObjWithKeyValuePair(
      currentAccWithLeftovers,
      'accountType',
      'Spending',
   );
   const totalIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
   const totalExpenses = ArrayOfObjects.sumKeyValues(expenseArr, 'expenseValue');

   const messages: string[] = [];

   // Current Acc Calculations:
   let salaryExpToSavingsAcc: number = 0;
   let salaryExpToSpendingAcc: number = 0;
   const isLeftoverLessThanMinCushion = salaryExpAcc.leftover < salaryExpAcc.minCushion;
   const salaryExpHasTransferLeftoversTo = salaryExpAcc.transferLeftoversTo !== '';
   const spendingHasTransferLeftoversTo = spendingAcc.transferLeftoversTo !== '';

   if (isLeftoverLessThanMinCushion) {
      salaryExpToSavingsAcc = salaryExpAcc.leftover;
      if (salaryExpHasTransferLeftoversTo) {
         const savingsAccToTransferTo = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            salaryExpAcc.transferLeftoversTo,
         );
         const salaryExpTransferLeftoversToName = savingsAccToTransferTo.accountName;
         const salaryExpToTransferLeftoversAccMsg = `Leftover amount to transfer from ${
            salaryExpAcc.accountName
         } to ${salaryExpTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(
            salaryExpToSavingsAcc,
         )}`;
         messages.push(salaryExpToTransferLeftoversAccMsg);

         if (savingsAccToTransferTo.targetToReach) {
            const balance = (savingsAccToTransferTo.currentBalance || 0) + salaryExpToSavingsAcc;
            const savingsAccHistoryObj = {
               id: savingsAccToTransferTo.id,
               balance: balance,
               timestamp: DateHelper.toDDMMYYYY(new Date()),
            };
            savingsAccHistory.push(savingsAccHistoryObj);
         }
      }
      salaryExpToSpendingAcc = totalIncome - totalExpenses - salaryExpAcc.minCushion;
      salaryExpToSpendingAcc = salaryExpHasTransferLeftoversTo
         ? salaryExpToSpendingAcc
         : salaryExpToSpendingAcc + salaryExpToSavingsAcc;
      const salaryExpToSpendingAccMsg = `Leftover amount to transfer from ${
         salaryExpAcc.accountName
      } to ${spendingAcc.accountName}: ${NumberHelper.asCurrencyStr(salaryExpToSpendingAcc)}`;
      messages.push(salaryExpToSpendingAccMsg);
   }

   if (!isLeftoverLessThanMinCushion) {
      salaryExpToSavingsAcc = salaryExpAcc.leftover - salaryExpAcc.minCushion;
      if (salaryExpHasTransferLeftoversTo) {
         const savingsAccToTransferTo = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            salaryExpAcc.transferLeftoversTo,
         );
         const salaryExpTransferLeftoversToName = savingsAccToTransferTo.accountName;
         const salaryExpToTransferLeftoversAccMsg = `Leftover amount to transfer from ${
            salaryExpAcc.accountName
         } to ${salaryExpTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(
            salaryExpToSavingsAcc,
         )}`;
         messages.push(salaryExpToTransferLeftoversAccMsg);
         if (savingsAccToTransferTo.targetToReach) {
            const balance = (savingsAccToTransferTo.currentBalance || 0) + salaryExpToSavingsAcc;
            const savingsAccHistoryObj = {
               id: savingsAccToTransferTo.id,
               balance: balance,
               timestamp: DateHelper.toDDMMYYYY(new Date()),
            };
            savingsAccHistory.push(savingsAccHistoryObj);
         }
      }
      salaryExpToSpendingAcc = totalIncome - totalExpenses;
      salaryExpToSpendingAcc = salaryExpHasTransferLeftoversTo
         ? salaryExpToSpendingAcc
         : salaryExpToSpendingAcc + salaryExpToSavingsAcc;
      const salaryExpToSpendingAccMsg = `Leftover amount to transfer from ${
         salaryExpAcc.accountName
      } to ${spendingAcc.accountName}: ${NumberHelper.asCurrencyStr(salaryExpToSpendingAcc)}`;
      messages.push(salaryExpToSpendingAccMsg);
   }

   if (spendingHasTransferLeftoversTo) {
      const spendingsToSavingsAcc = spendingAcc.leftover;
      const savingsAccToTransferTo = ArrayOfObjects.getObjWithKeyValuePair(
         savingsAccArr,
         'id',
         spendingAcc.transferLeftoversTo,
      );
      const spendingsTransferLeftoversToName = savingsAccToTransferTo.accountName;
      const spendingsToSavingsAccMsg = `Leftover amount to transfer from ${
         spendingAcc.accountName
      } to ${spendingsTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(
         spendingsToSavingsAcc,
      )}`;
      messages.push(spendingsToSavingsAccMsg);

      if (savingsAccToTransferTo.targetToReach) {
         const savingsAccHistoryObj = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccHistory,
            'id',
            savingsAccToTransferTo.id,
         );
         if (savingsAccHistoryObj) {
            const balance = savingsAccHistoryObj.balance + spendingsToSavingsAcc;
            savingsAccHistory = savingsAccHistory.filter(
               (obj) => obj.id !== savingsAccToTransferTo.id,
            );
            savingsAccHistory.push({
               ...savingsAccHistoryObj,
               balance: balance,
            });
         } else {
            const balance = (savingsAccToTransferTo.currentBalance || 0) + spendingsToSavingsAcc;
            const savingsAccHistoryObj = {
               id: savingsAccToTransferTo.id,
               balance: balance,
               timestamp: DateHelper.toDDMMYYYY(new Date()),
            };
            savingsAccHistory.push(savingsAccHistoryObj);
         }
      }
   }

   // Manual Expense Calculations:
   //const savingsAccHistory = [];
   const manualExpenses = expenseArr
      .filter((exp) => exp.paymentType === 'Manual')
      .filter((exp) => exp.paused === 'false');

   for (let i = 0; i < manualExpenses.length; i++) {
      if (manualExpenses[i].expenseType.includes('Savings Transfer')) {
         const savingsAccId = Number(manualExpenses[i].expenseType.split(':')[1]);
         const savingsAcc = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            savingsAccId,
         );
         messages.push(
            `Manual Expense: Amount to transfer from ${salaryExpAcc.accountName} to ${
               savingsAcc.accountName
            }: ${NumberHelper.asCurrencyStr(manualExpenses[i].expenseValue)}`,
         );
         if (savingsAcc.targetToReach) {
            // Update the savingsAccHistory array objects that match the savingsAccId
            const savingsAccHistoryObj = ArrayOfObjects.getObjWithKeyValuePair(
               savingsAccHistory,
               'id',
               savingsAccId,
            );
            if (savingsAccHistoryObj) {
               const newBalance = savingsAccHistoryObj.balance + manualExpenses[i].expenseValue;
               // update the savingsAccHistory array by removing the old object and adding the new one
               savingsAccHistory = savingsAccHistory.filter((obj) => obj.id !== savingsAccId);
               savingsAccHistory.push({
                  ...savingsAccHistoryObj,
                  balance: newBalance,
               });
            } else {
               const balance = (savingsAcc.currentBalance || 0) + manualExpenses[i].expenseValue;
               const savingsAccHistoryObj = {
                  id: savingsAccId,
                  balance: balance,
                  timestamp: DateHelper.toDDMMYYYY(new Date()),
               };
               savingsAccHistory.push(savingsAccHistoryObj);
            }
         }
      } else {
         messages.push(
            `Manual Expense: Make Payment from ${salaryExpAcc.accountName} for expense: ${
               manualExpenses[i].expenseName
            }: ${NumberHelper.asCurrencyStr(manualExpenses[i].expenseValue)}`,
         );
      }
   }

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
         totalSpendings: totalIncome - spendingAcc.leftover,
         totalDisposableSpending: totalIncome - spendingAcc.leftover - totalExpenses,
         totalSavings: spendingAcc.leftover,
      },
      timestamp: DateHelper.toDDMMYYYY(new Date()),
   };

   return {
      distributer: [distributer],
      savingsAccHistory: savingsAccHistory,
      analytics: [analytics],
   };
}
