import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../details/components/Income/class/Class';
import type {
   ICreditAccountFirebase,
   ICreditFormInputs,
} from '../../details/components/accounts/credit/class/Class';
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
      creditAccounts: ICreditAccountFirebase,
      incomes: IIncomeFirebase,
      expenses: IExpensesFirebase,
      distForm: { [id: number]: number }, // contains current account leftovers and credit account balances
   ): NDist.ISchema {
      const currentAcc = CalculateDist.formatCurrentAccounts(currentAccounts, distForm);
      const creditAccArr = CalculateDist.formatCreditAccounts(
         creditAccounts,
         currentAccounts,
         distForm,
      );
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
         creditAccArr,
         savingsAccArr,
         totalIncome,
         totalActiveExp, // totalExpenses,
         totalActiveMonthExp, // totalMonthlyExpenses,
         totalActiveYearlyExp, // totalYearlyExpenses,
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
      const SalaryExpAmtAtBegOfMonth = totalActiveExp + currentAcc.salaryExp.minCushion;
      const analytics = {
         totalIncomes: totalIncome,
         totalExpenses: SalaryExpAmtAtBegOfMonth - currentAcc.salaryExp.leftover,
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
      creditAccArr: IFormattedCreditAcc[],
      savingsAccArr: ISavingsFormInputs[],
      totalIncome: number,
      totalExpense: number,
      totalMonthlyExpenses: number,
      totalYearlyExpenses: number,
   ): ICalcTransfers {
      // SE = salary & expenses account
      // SP = spending account
      // SA = savings account
      // TL = transfer leftovers account
      // YEC = yearly expenses coverer account
      // CRA = credit account(s)
      const SE = currentAcc.salaryExp;
      const SP = currentAcc.spendings;
      const YEC = ArrayOfObjects.getObjWithKeyValuePair(
         savingsAccArr,
         'coversYearlyExpenses',
         'true',
      );
      //
      //
      //
      // -- S A L A R Y  &  E X P E N S E S  C U R R E N T  A C C O U N T  T R A N S F E R S -- //

      const SE_startingBalance = totalIncome + SE.leftover;
      const SE_requiredBalance = totalExpense + SE.minCushion;
      const SE_TO_CRAs_accounts = ArrayOfObjects.filterIn(
         creditAccArr,
         'payBalanceFromAccName',
         'Salary And Expenses',
      );
      const stepsList: string[] = [];
      let SE_TO_TL: number = 0;
      let SE_TO_SP: number = 0;
      let YEC_TO_SE: number = 0;

      // Paying off credit cards that are set to be paid by salary expenses account
      const SE_TO_CRA_Msgs: string[] = [];
      let SE_TO_CRAs_accounts_total_balance: number = 0;
      for (let i = 0; i < SE_TO_CRAs_accounts.length; i++) {
         const credAcc = SE_TO_CRAs_accounts[i];
         SE_TO_CRAs_accounts_total_balance = SE_TO_CRAs_accounts_total_balance + credAcc.balance;
         const SE_TO_CRA_Msg = CalculateDist.createMsg({
            amount: credAcc.balance,
            fromAccount: SE.accountName,
            transfer: {
               transferToAccount: credAcc.accountName,
            },
         });
         SE_TO_CRA_Msgs.push(SE_TO_CRA_Msg);
      }

      SE_TO_TL = SE.leftover - SE.minCushion;
      SE_TO_TL = NumberHelper.isPositive(SE_TO_TL) ? SE_TO_TL : 0;
      SE_TO_SP = totalIncome - totalMonthlyExpenses;
      // If the Salary & Expenses balance isn't high enough to cover all the transfers leaving the account, then firstly transfer the amount required to break even from the yearly cost cover account
      const SE_outgoings_total = SE_TO_CRAs_accounts_total_balance + SE_TO_TL + SE_TO_SP;
      const YEC_TO_SE_INITIAL = NumberHelper.isPositive(SE_outgoings_total)
         ? 0
         : NumberHelper.toPositive(SE_outgoings_total);
      const YEC_TO_SE_INITIAL_msg = CalculateDist.createMsg({
         amount: YEC_TO_SE_INITIAL,
         fromAccount: YEC.accountName,
         transfer: { transferToAccount: SE.accountName },
      });

      stepsList.push(YEC_TO_SE_INITIAL_msg);
      let SE_newBalance = SE_startingBalance + YEC_TO_SE_INITIAL;
      stepsList.push(...SE_TO_CRA_Msgs);
      SE_newBalance = SE_newBalance - SE_TO_CRAs_accounts_total_balance;

      // The rest of the salary and expenses account transfers
      if (!SE.hasTransferLeftoversTo) {
         SE_TO_SP = SE_TO_SP + SE_TO_TL;
         const SE_TO_SP_msg = CalculateDist.createMsg({
            amount: SE_TO_SP,
            fromAccount: SE.accountName,
            transfer: { transferToAccount: SP.accountName },
         });
         stepsList.push(SE_TO_SP_msg);
         SE_newBalance = SE_newBalance - SE_TO_SP;
      }

      const savingsAccountTransfers: ISavingsAccountTransfers = [];
      if (SE.hasTransferLeftoversTo) {
         const SE_TO_SP_msg = CalculateDist.createMsg({
            amount: SE_TO_SP,
            fromAccount: SE.accountName,
            transfer: { transferToAccount: SP.accountName },
         });
         stepsList.push(SE_TO_SP_msg);
         SE_newBalance = SE_newBalance - SE_TO_SP;

         const TL = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            SE.transferLeftoversTo,
         );
         const SE_TO_TL_msg = CalculateDist.createMsg({
            amount: SE_TO_TL,
            fromAccount: SE.accountName,
            transfer: {
               transferToAccount: TL.accountName,
               leftover: true,
            },
         });
         stepsList.push(SE_TO_TL_msg);
         SE_newBalance = SE_newBalance - SE_TO_TL;

         if (TL.isTracked === 'true') {
            const savingsAccHistoryObj = {
               id: TL.id,
               amountToTransfer: SE_TO_TL,
            };
            savingsAccountTransfers.push(savingsAccHistoryObj);
         }
      }

      YEC_TO_SE = SE_requiredBalance - SE_newBalance;
      const YEC_TO_SE_msg = CalculateDist.createMsg({
         amount: YEC_TO_SE,
         fromAccount: YEC.accountName,
         transfer: { transferToAccount: SE.accountName },
      });
      stepsList.push(YEC_TO_SE_msg);

      //
      //
      //
      // -- S P E N D I N G S  A C C O U N T  T R A N S F E R S  (EXCEPT SE_TO_SP) -- //

      // Paying off credit cards that are set to be paid by spendings account
      const SP_TO_CRAs_accounts = ArrayOfObjects.filterIn(
         creditAccArr,
         'payBalanceFromAccName',
         'Spendings',
      );
      let SP_TO_CRAs_accounts_total_balance: number = 0;
      for (let i = 0; i < SP_TO_CRAs_accounts.length; i++) {
         const credAcc = SP_TO_CRAs_accounts[i];
         SP_TO_CRAs_accounts_total_balance = SP_TO_CRAs_accounts_total_balance + credAcc.balance;
         const SP_TO_CRA_msg = CalculateDist.createMsg({
            amount: credAcc.balance,
            fromAccount: SP.accountName,
            transfer: {
               transferToAccount: credAcc.accountName,
            },
         });
         stepsList.push(SP_TO_CRA_msg);
      }

      // The rest of the spendings account transfers
      if (SP.hasTransferLeftoversTo) {
         const SP_TO_TL: number = SP.leftover - SP_TO_CRAs_accounts_total_balance;
         const TL = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            SP.transferLeftoversTo,
         );
         const SP_TO_TL_msg = CalculateDist.createMsg({
            amount: SP_TO_TL,
            fromAccount: SP.accountName,
            transfer: {
               transferToAccount: TL.accountName,
               leftover: true,
            },
         });
         stepsList.push(SP_TO_TL_msg);

         if (TL.isTracked === 'true') {
            const savingsAccHistoryObj = {
               id: TL.id,
               amountToTransfer: SP_TO_TL,
            };
            savingsAccountTransfers.push(savingsAccHistoryObj);
         }
      }

      //
      //
      //

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
      distForm: { [id: number]: number },
   ): IFormattedCurrentAcc {
      const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
      const currentAccWithLeftovers = currentAccArr.map((acc) => {
         const leftover = distForm[acc.id];
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

   // -- FORMAT CREDIT ACCOUNTS -- //
   private static formatCreditAccounts(
      creditAccounts: ICreditAccountFirebase,
      currentAccounts: ICurrentAccountFirebase,
      distForm: { [id: number]: number },
   ): IFormattedCreditAcc[] {
      const creditAccArr = ObjectOfObjects.convertToArrayOfObj(creditAccounts);
      return creditAccArr.map((acc) => {
         const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
         const currentAccToPayBalanceFrom = ArrayOfObjects.getObjWithKeyValuePair(
            currentAccArr,
            'id',
            acc.payBalanceFrom,
         );
         const balance = distForm[acc.id];
         return {
            ...acc,
            balance,
            payBalanceFromAccName: currentAccToPayBalanceFrom.accountName,
         };
      });
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

type IFormattedCreditAcc = ICreditFormInputs & {
   balance: number;
   payBalanceFromAccName: string;
};

type ISavingsAccountTransfers = {
   id: number;
   amountToTransfer: number;
}[];

type ICalcTransfers = {
   stepsList: string[];
   savingsAccountTransfers: ISavingsAccountTransfers;
};
