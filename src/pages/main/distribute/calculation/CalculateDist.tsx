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
      const totalIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
      const totalActiveExp = ArrayOfObjects.sumKeyValues(activeExpArr, 'expenseValue');
      const totalActiveMonthExp = ArrayOfObjects.sumKeyValues(activeMonthlyExpArr, 'expenseValue');
      const totalActiveYearlyExp = ArrayOfObjects.sumKeyValues(activeYearlyExpArr, 'expenseValue');

      // Calculate Prev Month Analytics:
      const prevMonth = CalculateDist.calcPrevMonthAnaltics(
         currentAcc,
         totalIncome,
         totalActiveExp,
         totalActiveMonthExp,
      );

      // Calculate Current Account Transfers:
      const { stepsList, trackedSavingsAccountTransfers } = CalculateDist.calcTransfers(
         currentAcc,
         creditAccArr,
         savingsAccArr,
         activeExpArr,
         totalIncome,
         totalActiveExp,
         totalActiveMonthExp,
         totalActiveYearlyExp,
      );

      // Create Savings Account History Array:
      const savingsAccHistory = CalculateDist.updateSavingsAccHistory(
         distDate,
         trackedSavingsAccountTransfers,
         savingsAccArr,
      );

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
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
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
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   // -- CALC TRANSFERS FUNC: CURRENTACC TRANSFERS -- //
   private static calcTransfers(
      currentAcc: IFormattedCurrentAcc,
      creditAccArr: IFormattedCreditAcc[],
      savingsAccArr: ISavingsFormInputs[],
      activeExpensesArr: IExpenseFormInputs[],
      totalIncome: number,
      totalExpense: number,
      totalMonthlyExpenses: number,
      totalYearlyExpenses: number,
   ): { stepsList: string[]; trackedSavingsAccountTransfers: ISavingsAccountTransfers } {
      // ORDER OF MSGS: (Mx = multiple times)
      // 1x:   SCA (shortfall coverer savings account) --> SE (salary & expenses account)  [if the SE starting balance doesn't cover all outgoings, this makes up for it]
      // 0-Mx: SE (salary & expenses account) --> CRA (credit account(s))
      // 0-Mx: SE (salary & expenses account) --> SMA (savings manual transfer account(s)) [SMAs i.e. expenses that are of type "transfer to x savings account". These are trasnferred from SE acc by default]
      // 1x:   SE (salary & expenses account) --> SP (spendings account)
      // 1x:   SE (salary & expenses account) --> TL ('transfer leftovers to' account related to se acc)
      // 1x:   SCA (shortfall coverer savings account) --> SE (salary & expenses account)  [if the SE final balance after all outgoings doesn't meet the required balance, this transfer makes up for it]
      // 0-Mx: SP (spendings account) --> CRA (credit account(s))
      // 1x:   SP (spendings account) --> TL ('transfer leftovers to' account related to sp acc)
      //TODO: Potential future improvement could be to also set the shortfall coverer account to cover shortfall if the spendings account balance is less than it's total credit account transfers ie. it's total outgoings -- in a similar way I did for salaryexp using the same steps setup

      // Gathering Data
      const SE = currentAcc.salaryExp;
      const SP = currentAcc.spendings;
      const SCA = ArrayOfObjects.getObjWithKeyValuePair(savingsAccArr, 'coversShortfall', 'true');
      const SE_TO_CRAs_accounts = ArrayOfObjects.filterIn(
         creditAccArr,
         'payBalanceFromAccName',
         'Salary And Expenses',
      );
      const SP_TO_CRAs_accounts = ArrayOfObjects.filterIn(
         creditAccArr,
         'payBalanceFromAccName',
         'Spendings',
      );
      const SE_TO_SAs_expenses = ArrayOfObjects.getObjectsWithKeyWhichIncludesValue(
         activeExpensesArr,
         'expenseType',
         'Saving',
      );
      // i.e. expenses that I have to manually transfer from salaryExp account to savings accounts
      const SE_TO_SMAs_expenses = ArrayOfObjects.filterIn(
         SE_TO_SAs_expenses,
         'hasDistInstruction',
         'true',
      );
      let SE_TO_TL: number = 0;
      let SE_TO_SP: number = 0;
      let SCA_TO_SE: number = 0;
      let SP_TO_TL: number = 0;
      const stepsList: string[] = [];
      const trackedSavingsAccountTransfers: ISavingsAccountTransfers = [];
      //
      // -- S A L A R Y  &  E X P E N S E S  C U R R E N T  A C C O U N T  T R A N S F E R S -- //
      //
      //
      const SE_startingBalance = totalIncome + SE.leftover;
      const SE_requiredBalance = totalExpense + SE.minCushion;
      const SE_TO_CRAs_total = ArrayOfObjects.sumKeyValues(SE_TO_CRAs_accounts, 'balance');
      const SE_TO_SMAs_total = ArrayOfObjects.sumKeyValues(SE_TO_SMAs_expenses, 'expenseValue');

      //
      // Calculation Prep Steps:
      //
      SE_TO_SP = totalIncome - totalMonthlyExpenses;
      //
      const SE_outgoings = SE_TO_CRAs_total + SE_TO_SMAs_total + SE_TO_SP;
      const SE_final_bal = SE_startingBalance - SE_outgoings;
      SE_TO_TL = Math.max(SE_final_bal - SE_requiredBalance, 0);
      //
      const SE_out_total = SE_outgoings + SE_TO_TL;
      const SE_balance_shortfall = SE_startingBalance - SE_out_total;
      const SCA_TO_SE_INITIAL = SE_balance_shortfall >= 0 ? 0 : Math.abs(SE_balance_shortfall);
      const SCA_TO_SE_INITIAL_msg = CalculateDist.createMsg({
         amount: SCA_TO_SE_INITIAL,
         fromAccount: SCA.accountName,
         transfer: { transferToAccount: SE.accountName },
      });
      stepsList.push(SCA_TO_SE_INITIAL_msg);
      let SE_newBalance = SE_startingBalance + SCA_TO_SE_INITIAL;
      //
      // Actual Distribution Calculation Steps
      //
      for (let i = 0; i < SE_TO_CRAs_accounts.length; i++) {
         const credAcc = SE_TO_CRAs_accounts[i];
         const SE_TO_CRA_msg = CalculateDist.createMsg({
            amount: credAcc.balance,
            fromAccount: SE.accountName,
            transfer: { transferToAccount: credAcc.accountName },
         });
         stepsList.push(SE_TO_CRA_msg);
         SE_newBalance = SE_newBalance - credAcc.balance;
      }

      for (let i = 0; i < SE_TO_SAs_expenses.length; i++) {
         const expense = SE_TO_SAs_expenses[i];
         const SA_id = Number(expense.expenseType.split(':')[1]);
         const SA = ArrayOfObjects.getObjWithKeyValuePair(savingsAccArr, 'id', SA_id);
         const SE_TO_SA_isManualStep = expense.hasDistInstruction === 'true';
         if (SE_TO_SA_isManualStep) {
            const SE_TO_SA_msg = CalculateDist.createMsg({
               amount: expense.expenseValue,
               fromAccount: SE.accountName,
               transfer: { transferToAccount: SA.accountName },
               expenseName: expense.expenseName,
            });
            stepsList.push(SE_TO_SA_msg);
            SE_newBalance = SE_newBalance - expense.expenseValue;
         }
         if (SA.isTracked !== 'true') continue;
         trackedSavingsAccountTransfers.push({ id: SA.id, amountToTransfer: expense.expenseValue });
      }

      SE_TO_SP = SE.hasTransferLeftoversTo ? SE_TO_SP : SE_TO_SP + SE_TO_TL;
      const SE_TO_SP_msg = CalculateDist.createMsg({
         amount: SE_TO_SP,
         fromAccount: SE.accountName,
         transfer: { transferToAccount: SP.accountName },
      });
      stepsList.push(SE_TO_SP_msg);
      SE_newBalance = SE_newBalance - SE_TO_SP;

      if (SE.hasTransferLeftoversTo) {
         const TL = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            SE.transferLeftoversTo,
         );
         const SE_TO_TL_msg = CalculateDist.createMsg({
            amount: SE_TO_TL,
            fromAccount: SE.accountName,
            transfer: { transferToAccount: TL.accountName, leftover: true },
         });
         stepsList.push(SE_TO_TL_msg);
         SE_newBalance = SE_newBalance - SE_TO_TL;

         if (TL.isTracked === 'true') {
            trackedSavingsAccountTransfers.push({ id: TL.id, amountToTransfer: SE_TO_TL });
         }
      }

      SCA_TO_SE = SE_requiredBalance - SE_newBalance;
      const SCA_TO_SE_msg = CalculateDist.createMsg({
         amount: SCA_TO_SE,
         fromAccount: SCA.accountName,
         transfer: { transferToAccount: SE.accountName },
      });
      stepsList.push(SCA_TO_SE_msg);
      //
      // -- S P E N D I N G S  A C C O U N T  T R A N S F E R S -- //
      //
      SP_TO_TL = SP.leftover;
      for (let i = 0; i < SP_TO_CRAs_accounts.length; i++) {
         const CRA = SP_TO_CRAs_accounts[i];
         const SP_TO_CRA_msg = CalculateDist.createMsg({
            amount: CRA.balance,
            fromAccount: SP.accountName,
            transfer: { transferToAccount: CRA.accountName },
         });
         stepsList.push(SP_TO_CRA_msg);
         SP_TO_TL = SP_TO_TL - CRA.balance;
      }
      if (!SP.hasTransferLeftoversTo) return { stepsList, trackedSavingsAccountTransfers };
      const TL = ArrayOfObjects.getObjWithKeyValuePair(savingsAccArr, 'id', SP.transferLeftoversTo);
      const SP_TO_TL_msg = CalculateDist.createMsg({
         amount: SP_TO_TL,
         fromAccount: SP.accountName,
         transfer: { transferToAccount: TL.accountName, leftover: true },
      });
      stepsList.push(SP_TO_TL_msg);
      if (TL.isTracked === 'true') {
         trackedSavingsAccountTransfers.push({ id: TL.id, amountToTransfer: SP_TO_TL });
      }

      return { stepsList, trackedSavingsAccountTransfers };
   }
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   // -- CALC BALANCES AND UPDATE SAVINGSACC HISTORY -- //
   private static updateSavingsAccHistory(
      distDate: Date,
      savingsAccountTransfers: ISavingsAccountTransfers,
      savingsAccArr: ISavingsFormInputs[],
   ): NDist.ISavingsAccHist[] {
      const savingsAccHistory: NDist.ISavingsAccHist[] = [];
      // Sum up amounts that have been transferred into same savings account
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
      // Sum the total amount transferred into savings account with it's currentBalance to get it's new balance
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
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
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
