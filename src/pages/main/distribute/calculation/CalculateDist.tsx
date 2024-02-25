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
import type NDist from '../namespace/NDist';

export default class CalculateDist {
   // -- MAIN FUNCTION -- //
   static calculate(
      distDate: Date,
      savingsAccounts: ISavingsAccountFirebase,
      currentAccounts: ICurrentAccountFirebase,
      incomes: IIncomeFirebase,
      expenses: IExpensesFirebase,
      leftovers: { [id: number]: number },
   ): NDist.ISchema {
      // Initial Setup:
      const currentAcc = CalculateDist.formatCurrentAccounts(currentAccounts, leftovers);
      const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
      const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
      const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
      const monthlyExpenseArr = ArrayOfObjects.filterOut(expenseArr, 'frequency', 'Yearly');
      const yearlyExpenseArr = ArrayOfObjects.filterOut(expenseArr, 'frequency', 'Monthly');
      const activeExpArr = ArrayOfObjects.filterOut(expenseArr, 'paused', 'true');
      const activeMonthlyExpArr = ArrayOfObjects.filterOut(monthlyExpenseArr, 'paused', 'true');
      const activeYearlyExpArr = ArrayOfObjects.filterOut(yearlyExpenseArr, 'paused', 'true');
      // Calculate Total Incomes & Expenses:
      const totalIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
      // const totalExpenses = ArrayOfObjects.sumKeyValues(expenseArr, 'expenseValue');
      // const totalMonthlyExpenses = ArrayOfObjects.sumKeyValues(monthlyExpenseArr, 'expenseValue');
      // const totalYearlyExpenses = ArrayOfObjects.sumKeyValues(yearlyExpenseArr, 'expenseValue');
      const totalActiveExp = ArrayOfObjects.sumKeyValues(activeExpArr, 'expenseValue');
      const totalActiveMonthExp = ArrayOfObjects.sumKeyValues(activeMonthlyExpArr, 'expenseValue');
      const totalActiveYearlyExp = ArrayOfObjects.sumKeyValues(activeYearlyExpArr, 'expenseValue');

      // Calculate Prev Month Analytics:
      const prevMonth = CalculateDist.calcPrevMonthAnaltics(
         currentAcc,
         totalIncome,
         totalActiveExp, // totalExpenses,
         totalActiveMonthExp, // totalMonthlyExpenses,
      );

      // Calculate Current Account Transfers:
      const currentAccTransfers = CalculateDist.calcCurrentAccTransfers(
         currentAcc,
         totalIncome,
         totalActiveExp, // totalExpenses,
         totalActiveMonthExp, // totalMonthlyExpenses,
         totalActiveYearlyExp, // totalYearlyExpenses,
         savingsAccArr,
      );

      // Calculate Expenses Transfers:
      const expensesTransfers = CalculateDist.calcExpensesTransfers(
         expenseArr,
         savingsAccArr,
         currentAcc,
      );

      // Create Savings Account History Array:
      const savingsAccountTransfers = [
         ...currentAccTransfers.savingsAccountTransfers,
         ...expensesTransfers.savingsAccountTransfers,
      ];
      const savingsAccHistory = CalculateDist.updateSavingsAccHistory(
         distDate,
         savingsAccountTransfers,
         savingsAccArr,
      );

      // Create stepsList Array
      const stepsList = [...currentAccTransfers.stepsList, ...expensesTransfers.stepsList];

      // Create distSteps Obj:
      const distSteps = {
         timestamp: DateHelper.toDDMMYYYY(distDate),
         list: stepsList,
      };

      // Create Analytics Obj:
      const analytics = {
         totalIncomes: totalIncome,
         totalExpenses: totalActiveExp, // totalExpenses,
         prevMonth: prevMonth,
         timestamp: DateHelper.toDDMMYYYY(distDate),
      };

      return {
         distSteps: [distSteps],
         savingsAccHistory: savingsAccHistory,
         analytics: [analytics],
      };
   }

   // -- CALC PREV MONTH ANALYTICS -- //
   private static calcPrevMonthAnaltics(
      currentAcc: IFormattedCurrentAcc,
      totalIncome: number,
      totalExpenses: number,
      totalMonthlyExpenses: number,
   ): NDist.ISchema['analytics'][0]['prevMonth'] {
      const initialSalaryExpBalancePrevMonth = totalExpenses + currentAcc.salaryExp.minCushion; // Note: this is actually from this month rather than prev month, because I haven't implemented storing the data: total expenses from prev month and minCushion from prev month
      const salaryExpLeftoverNow = currentAcc.salaryExp.leftover;
      const spendingsLeftoverNow = currentAcc.spendings.leftover;
      const totalExpensesSpending = initialSalaryExpBalancePrevMonth - salaryExpLeftoverNow;
      const initialSpendingsAccBalancePrevMonth = totalIncome - totalMonthlyExpenses; // Note: this is actually from this month rather than prev month, because I haven't implemented storing the data: total Income from prev month and total monthly expenses from prev month
      const totalDisposableSpending = initialSpendingsAccBalancePrevMonth - spendingsLeftoverNow;
      const totalSpendings = totalDisposableSpending + totalExpensesSpending;
      return {
         totalSpendings,
         totalDisposableSpending,
         totalSavings: currentAcc.spendings.leftover,
      };
   }

   // -- CALC TRANSFERS FUNC: CURRENTACC TRANSFERS -- //
   private static calcCurrentAccTransfers(
      currentAcc: IFormattedCurrentAcc,
      totalIncome: number,
      totalExpense: number,
      totalMonthlyExpenses: number,
      totalYearlyExpenses: number,
      savingsAccArr: ISavingsFormInputs[],
   ): ICalcTransfers {
      // SE = salary & expenses account
      // SP = spending account
      // SA = savings account
      // TL = transfer leftovers account
      // YEC = yearly expenses coverer account
      const SE = currentAcc.salaryExp;
      const SP = currentAcc.spendings;
      const YEC = ArrayOfObjects.getObjWithKeyValuePair(
         savingsAccArr,
         'coversYearlyExpenses',
         'true',
      );
      let SE_TO_TL: number = 0;
      let SE_TO_SP: number = 0;
      let YEC_TO_SE: number = 0;
      const SE_startingBalance = totalIncome + SE.leftover;
      const SE_requiredBalance = totalExpense + SE.minCushion;
      const stepsList: string[] = [];
      const savingsAccountTransfers: ISavingsAccountTransfers = [];
      const isLeftoverLessThanMinCushion = SE.leftover < SE.minCushion;
      if (!isLeftoverLessThanMinCushion) {
         SE_TO_TL = NumberHelper.makeZeroIfNeg(SE.leftover - SE.minCushion - totalYearlyExpenses);
         const SE_newBalance = SE_startingBalance - SE_TO_TL;
         SE_TO_SP = totalIncome - totalMonthlyExpenses;
         YEC_TO_SE = SE_requiredBalance - (SE_newBalance - SE_TO_SP);
      }
      if (isLeftoverLessThanMinCushion) {
         SE_TO_TL = SE.leftover;
         const SE_newBalance = SE_startingBalance - SE_TO_TL;
         SE_TO_SP = totalIncome - totalMonthlyExpenses - SE.minCushion;
         YEC_TO_SE = SE_requiredBalance - (SE_newBalance - SE_TO_SP);
      }
      if (!SE.hasTransferLeftoversTo) {
         SE_TO_SP = SE_TO_SP + SE_TO_TL;
      }
      const YEC_TO_SE_msg = CalculateDist.createMsg({
         amount: YEC_TO_SE,
         fromAccount: YEC.accountName,
         transfer: { transferToAccount: SE.accountName },
      });
      const SE_TO_SP_msg = CalculateDist.createMsg({
         amount: SE_TO_SP,
         fromAccount: SE.accountName,
         transfer: { transferToAccount: SP.accountName },
      });
      stepsList.push(YEC_TO_SE_msg);
      stepsList.push(SE_TO_SP_msg);

      const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAcc);
      for (let i = 0; i < currentAccArr.length; i++) {
         const CA = currentAccArr[i];
         if (!CA.hasTransferLeftoversTo) continue;
         const TL = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            CA.transferLeftoversTo,
         );
         const TL_accountName = TL.accountName;
         const amountToTransfer = CA.accountType === 'Salary & Expenses' ? SE_TO_TL : CA.leftover;
         const CA_TO_TL_msg = CalculateDist.createMsg({
            amount: amountToTransfer,
            fromAccount: CA.accountName,
            transfer: { transferToAccount: TL_accountName, leftover: true },
         });
         stepsList.push(CA_TO_TL_msg);
         if (TL.isTracked === 'true') {
            const savingsAccHistoryObj = {
               id: TL.id,
               amountToTransfer: amountToTransfer,
            };
            savingsAccountTransfers.push(savingsAccHistoryObj);
         }
      }
      return {
         stepsList,
         savingsAccountTransfers,
      };
   }

   // -- CALC TRANSFERS FUNC: EXPENSES TRANSFERS -- //
   private static calcExpensesTransfers(
      expenseArr: IExpenseFormInputs[],
      savingsAccArr: ISavingsFormInputs[],
      currentAcc: IFormattedCurrentAcc,
   ): ICalcTransfers {
      const stepsList: string[] = [];
      const savingsAccountTransfers: ISavingsAccountTransfers = [];

      for (let i = 0; i < expenseArr.length; i++) {
         const expense = expenseArr[i];
         if (expense.paused === 'true' || expense.frequency === 'Yearly') continue; // Skip expense if paused or yearly expense. Note: I haven't implemented logic for yearly expense transfers nor yearly expenses instructions to appear once a year (As this would require me to add yet another "field" date or something - therefore, I am disabling the ability for the user to set hasDistInstructions to true for yearly expenses)
         const isExpenseTypeSavingsTransfer = expense.expenseType.includes('Savings');
         const hasDistInstruction = expense.hasDistInstruction === 'true';

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
            if (hasDistInstruction) {
               const msg = CalculateDist.createMsg({
                  amount: expense.expenseValue,
                  fromAccount: currentAcc.salaryExp.accountName,
                  transfer: { transferToAccount: savingsAcc.accountName },
                  expenseName: expense.expenseName,
               });
               stepsList.push(msg);
            }
         }
         if (!isExpenseTypeSavingsTransfer && hasDistInstruction) {
            const msg = CalculateDist.createMsg({
               amount: expense.expenseValue,
               fromAccount: currentAcc.salaryExp.accountName,
               expenseName: expense.expenseName,
            });
            stepsList.push(msg);
         }
      }
      return {
         stepsList,
         savingsAccountTransfers,
      };
   }

   // -- CALC BALANCES AND UPDATE SAVINGSACC HISTORY -- //
   private static updateSavingsAccHistory(
      distDate: Date,
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
            timestamp: DateHelper.toDDMMYYYY(distDate), // was new Date()
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

   // -- CREATE MSGS -- //
   static createMsg(details: ICreateMsgs): string {
      const { amount, fromAccount, transfer, expenseName } = details;
      if (transfer) {
         const { transferToAccount, leftover } = transfer;
         const msgStart = leftover ? 'Leftover amount' : 'Amount';
         return `${msgStart} to transfer from ${fromAccount} to ${transferToAccount}: ${NumberHelper.asCurrencyStr(
            amount,
         )}`;
      }
      return `Make Payment from ${fromAccount} for expense: ${expenseName}: ${NumberHelper.asCurrencyStr(
         amount,
      )}`;
   }
}

interface ICreateMsgs {
   amount: number;
   fromAccount: string;
   transfer?: {
      transferToAccount: string;
      leftover?: boolean;
   };
   expenseName?: string;
}

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
   stepsList: string[];
   savingsAccountTransfers: ISavingsAccountTransfers;
};
