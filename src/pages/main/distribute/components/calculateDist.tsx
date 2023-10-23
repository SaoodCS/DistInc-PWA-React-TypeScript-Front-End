import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import { IIncomeFirebase } from '../../details/components/Income/class/Class';
import { ICurrentAccountFirebase } from '../../details/components/accounts/current/class/Class';
import { ISavingsAccountFirebase } from '../../details/components/accounts/savings/class/Class';
import { IExpensesFirebase } from '../../details/components/expense/class/ExpensesClass';

interface ICalcSchema {
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

   // Current Acc Calculations:
   let salaryExpToSavingsAcc: number = 0;
   let salaryExpToSpendingAcc: number = 0;
   const isLeftoverLessThanMinCushion = salaryExpAcc.leftover < salaryExpAcc.minCushion;
   if (isLeftoverLessThanMinCushion) {
      salaryExpToSavingsAcc = salaryExpAcc.leftover;
      salaryExpToSpendingAcc = totalIncome - totalExpenses - salaryExpAcc.minCushion;
   }
   if (!isLeftoverLessThanMinCushion) {
      salaryExpToSavingsAcc = salaryExpAcc.leftover - salaryExpAcc.minCushion;
      salaryExpToSpendingAcc = totalIncome - totalExpenses;
   }
   const spendingsToSavingsAcc = spendingAcc.leftover;

   const salaryExpTransferLeftoversToName = ArrayOfObjects.getObjWithKeyValuePair(
      savingsAccArr,
      'id',
      salaryExpAcc.transferLeftoversTo,
   ).accountName;

   const spendingsTransferLeftoversToName = ArrayOfObjects.getObjWithKeyValuePair(
      savingsAccArr,
      'id',
      spendingAcc.transferLeftoversTo,
   ).accountName;

   const salaryExpToSavingsAccMsg = `Leftover amount to transfer from ${
      salaryExpAcc.accountName
   } to ${salaryExpTransferLeftoversToName}: £${salaryExpToSavingsAcc.toFixed(2)}`;
   const salaryExpToSpendingAccMsg = `Leftover amount to transfer from ${
      salaryExpAcc.accountName
   } to ${spendingAcc.accountName}: £${salaryExpToSpendingAcc.toFixed(2)}`;
   const spendingsToSavingsAccMsg = `Leftover amount to transfer from ${
      spendingAcc.accountName
   } to ${spendingsTransferLeftoversToName}: £${spendingsToSavingsAcc.toFixed(2)}`;

   // Manual Expense Calculations:
   // get all objects from the expenseArr that's paymentType is 'Manual' and paused is 'false'
   let savingsAccHistory = [];
   let manualExpenseMsgs: string[] = [];
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
         manualExpenseMsgs.push(
            `Amount to transfer from ${salaryExpAcc.accountName} to ${
               savingsAcc.accountName
            }: £${manualExpenses[i].expenseValue.toFixed(2)}`,
         );
         if (savingsAcc.targetToReach) {
            const savingsAccHistoryObj = {
               id: savingsAccId,
               balance: (savingsAcc.currentBalance || 0) + manualExpenses[i].expenseValue,
               timestamp: new Date().toISOString(),
            };
            savingsAccHistory.push(savingsAccHistoryObj);
            // TODO: when uploading the calculations to firebase via microservice, update the savingsAccount doc's currentBalance as well
         }
      } else {
         manualExpenseMsgs.push(
            `Make Manual Payment from ${salaryExpAcc.accountName} for expense ${
               manualExpenses[i].expenseName
            }: £${manualExpenses[i].expenseValue.toFixed(2)}`,
         );
      }
   }

   // Create distributer object:
   const distributer = {
      timestamp: new Date().toISOString(),
      msgs: [
         salaryExpToSavingsAccMsg,
         salaryExpToSpendingAccMsg,
         spendingsToSavingsAccMsg,
         ...manualExpenseMsgs,
      ],
   };

   // create analytics object:
   const analytics = {
      totalIncomes: totalIncome,
      totalExpenses: totalExpenses,
      prevMonth: {
         totalSpendings: totalIncome - spendingAcc.leftover,
         totalDisposableSpending: totalIncome - spendingAcc.leftover - totalExpenses,
         totalSavings: spendingAcc.leftover,
      },
      timestamp: new Date().toISOString(),
   };

   return {
      distributer: [distributer],
      savingsAccHistory: savingsAccHistory,
      analytics: [analytics],
   };
}
