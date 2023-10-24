import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import NumberHelper from '../../../../global/helpers/dataTypes/number/NumberHelper';
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

   let messages: string[] = [];

   // Current Acc Calculations:
   let salaryExpToSavingsAcc: number = 0;
   let salaryExpToSpendingAcc: number = 0;
   const isLeftoverLessThanMinCushion = salaryExpAcc.leftover < salaryExpAcc.minCushion;
   const salaryExpHasTransferLeftoversTo = salaryExpAcc.transferLeftoversTo !== '';
   const spendingHasTransferLeftoversTo = spendingAcc.transferLeftoversTo !== '';

   if (isLeftoverLessThanMinCushion) {
      salaryExpToSavingsAcc = salaryExpAcc.leftover;
      if (salaryExpHasTransferLeftoversTo) {
         const salaryExpTransferLeftoversToName = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            salaryExpAcc.transferLeftoversTo,
         ).accountName;

         const salaryExpToTransferLeftoversAccMsg = `Leftover amount to transfer from ${
            salaryExpAcc.accountName
         } to ${salaryExpTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(
            salaryExpToSavingsAcc,
         )}`;
         messages.push(salaryExpToTransferLeftoversAccMsg);
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
         const salaryExpTransferLeftoversToName = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            salaryExpAcc.transferLeftoversTo,
         ).accountName;
         const salaryExpToTransferLeftoversAccMsg = `Leftover amount to transfer from ${
            salaryExpAcc.accountName
         } to ${salaryExpTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(
            salaryExpToSavingsAcc,
         )}`;
         messages.push(salaryExpToTransferLeftoversAccMsg);
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
      const spendingsTransferLeftoversToName = ArrayOfObjects.getObjWithKeyValuePair(
         savingsAccArr,
         'id',
         spendingAcc.transferLeftoversTo,
      ).accountName;
      const spendingsToSavingsAccMsg = `Leftover amount to transfer from ${
         spendingAcc.accountName
      } to ${spendingsTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(
         spendingsToSavingsAcc,
      )}`;
      messages.push(spendingsToSavingsAccMsg);
   }

   // Manual Expense Calculations:
   let savingsAccHistory = [];
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
            let balance = (savingsAcc.currentBalance || 0) + manualExpenses[i].expenseValue;
            if (savingsAccId === salaryExpAcc.transferLeftoversTo) {
               balance = balance + salaryExpToSavingsAcc;
            }
            if (savingsAccId === spendingAcc.transferLeftoversTo) {
               balance = balance + spendingAcc.leftover;
            }
            const savingsAccHistoryObj = {
               id: savingsAccId,
               balance: balance,
               timestamp: new Date().toISOString(),
            };
            savingsAccHistory.push(savingsAccHistoryObj);
            // TODO: when uploading the calculations to firebase via microservice, update the savingsAccount doc's currentBalance as well
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
   };

   return {
      distributer: [distributer],
      savingsAccHistory: savingsAccHistory,
      analytics: [analytics],
   };
}

// export default function calculateDist(
//    savingsAccounts: ISavingsAccountFirebase,
//    currentAccounts: ICurrentAccountFirebase,
//    incomes: IIncomeFirebase,
//    expenses: IExpensesFirebase,
//    leftovers: { [id: number]: number },
// ): ICalcSchema {
//    // Initial Setup:
//    const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
//    const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
//    const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
//    const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
//    const currentAccWithLeftovers = currentAccArr.map((acc) => {
//       const leftover = leftovers[acc.id];
//       return {
//          ...acc,
//          leftover,
//       };
//    });
//    const salaryExpAcc = ArrayOfObjects.getObjWithKeyValuePair(
//       currentAccWithLeftovers,
//       'accountType',
//       'Salary & Expenses',
//    );
//    const spendingAcc = ArrayOfObjects.getObjWithKeyValuePair(
//       currentAccWithLeftovers,
//       'accountType',
//       'Spending',
//    );
//    const totalIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
//    const totalExpenses = ArrayOfObjects.sumKeyValues(expenseArr, 'expenseValue');

//    // Current Acc Calculations:
//    let salaryExpToSavingsAcc: number = 0;
//    let salaryExpToSpendingAcc: number = 0;
//    const isLeftoverLessThanMinCushion = salaryExpAcc.leftover < salaryExpAcc.minCushion;
//    if (isLeftoverLessThanMinCushion) {
//       salaryExpToSavingsAcc = salaryExpAcc.leftover;
//       salaryExpToSpendingAcc = totalIncome - totalExpenses - salaryExpAcc.minCushion;
//    }
//    if (!isLeftoverLessThanMinCushion) {
//       salaryExpToSavingsAcc = salaryExpAcc.leftover - salaryExpAcc.minCushion;
//       salaryExpToSpendingAcc = totalIncome - totalExpenses;
//    }
//    const spendingsToSavingsAcc = spendingAcc.leftover;

//    const salaryExpTransferLeftoversToName = ArrayOfObjects.getObjWithKeyValuePair(
//       savingsAccArr,
//       'id',
//       salaryExpAcc.transferLeftoversTo,
//    ).accountName;

//    const spendingsTransferLeftoversToName = ArrayOfObjects.getObjWithKeyValuePair(
//       savingsAccArr,
//       'id',
//       spendingAcc.transferLeftoversTo,
//    ).accountName;

//    const salaryExpToSavingsAccMsg = `Leftover amount to transfer from ${
//       salaryExpAcc.accountName
//    } to ${salaryExpTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(salaryExpToSavingsAcc)}`;
//    const salaryExpToSpendingAccMsg = `Leftover amount to transfer from ${
//       salaryExpAcc.accountName
//    } to ${spendingAcc.accountName}: ${NumberHelper.asCurrencyStr(salaryExpToSpendingAcc)}`;
//    const spendingsToSavingsAccMsg = `Leftover amount to transfer from ${
//       spendingAcc.accountName
//    } to ${spendingsTransferLeftoversToName}: ${NumberHelper.asCurrencyStr(spendingsToSavingsAcc)}`;

//    // Manual Expense Calculations:
//    let savingsAccHistory = [];
//    let manualExpenseMsgs: string[] = [];
//    const manualExpenses = expenseArr
//       .filter((exp) => exp.paymentType === 'Manual')
//       .filter((exp) => exp.paused === 'false');

//    for (let i = 0; i < manualExpenses.length; i++) {
//       if (manualExpenses[i].expenseType.includes('Savings Transfer')) {
//          const savingsAccId = Number(manualExpenses[i].expenseType.split(':')[1]);
//          const savingsAcc = ArrayOfObjects.getObjWithKeyValuePair(
//             savingsAccArr,
//             'id',
//             savingsAccId,
//          );
//          manualExpenseMsgs.push(
//             `Amount to transfer from ${salaryExpAcc.accountName} to ${
//                savingsAcc.accountName
//             }: £${NumberHelper.asCurrencyStr(manualExpenses[i].expenseValue)}`,
//          );
//          if (savingsAcc.targetToReach) {
//             const savingsAccHistoryObj = {
//                id: savingsAccId,
//                balance: (savingsAcc.currentBalance || 0) + manualExpenses[i].expenseValue,
//                timestamp: new Date().toISOString(),
//             };
//             savingsAccHistory.push(savingsAccHistoryObj);
//             // TODO: when uploading the calculations to firebase via microservice, update the savingsAccount doc's currentBalance as well
//          }
//       } else {
//          manualExpenseMsgs.push(
//             `Make Manual Payment from ${salaryExpAcc.accountName} for expense ${
//                manualExpenses[i].expenseName
//             }: £${NumberHelper.asCurrencyStr(manualExpenses[i].expenseValue)}`,
//          );
//       }
//    }

//    // Create distributer object:
//    const distributer = {
//       timestamp: new Date().toISOString(),
//       msgs: [
//          salaryExpToSavingsAccMsg,
//          salaryExpToSpendingAccMsg,
//          spendingsToSavingsAccMsg,
//          ...manualExpenseMsgs,
//       ],
//    };

//    // create analytics object:
//    const analytics = {
//       totalIncomes: totalIncome,
//       totalExpenses: totalExpenses,
//       prevMonth: {
//          totalSpendings: totalIncome - spendingAcc.leftover,
//          totalDisposableSpending: totalIncome - spendingAcc.leftover - totalExpenses,
//          totalSavings: spendingAcc.leftover,
//       },
//       timestamp: new Date().toISOString(),
//    };

//    return {
//       distributer: [distributer],
//       savingsAccHistory: savingsAccHistory,
//       analytics: [analytics],
//    };
// }
