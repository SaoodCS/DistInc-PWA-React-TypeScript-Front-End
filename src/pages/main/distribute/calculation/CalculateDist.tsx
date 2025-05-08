import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../details/components/Income/class/Class';
import type {
   ICreditAccountFirebase,
   ICreditFormInputs,
} from '../../details/components/accounts/credit/class/Class';
import CreditClass from '../../details/components/accounts/credit/class/Class';
import type {
   ICurrentAccountFirebase,
   ICurrentFormInputs,
} from '../../details/components/accounts/current/class/Class';
import CurrentClass from '../../details/components/accounts/current/class/Class';
import type {
   ISavingsAccountFirebase,
   ISavingsFormInputs,
} from '../../details/components/accounts/savings/class/Class';
import type {
   IExpenseFormInputs,
   IExpensesFirebase,
} from '../../details/components/expense/class/ExpensesClass';
import ExpensesClass from '../../details/components/expense/class/ExpensesClass';
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
      const creditAccArr = ObjectOfObjects.convertToArrayOfObj(creditAccounts);
      const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
      const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
      const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
      const totalMonthlyIncome = ArrayOfObjects.sumKeyValues(incomeArr, 'incomeValue');
      const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
      const activeExpArr = ArrayOfObjects.filterOut(expenseArr, 'paused', 'true');
      const totalActiveExp = ArrayOfObjects.sumKeyValues(activeExpArr, 'expenseValue');
      const yearlyExpenseArr = ArrayOfObjects.filterOut(expenseArr, 'frequency', 'Monthly');
      const activeYearlyExpArr = ArrayOfObjects.filterOut(yearlyExpenseArr, 'paused', 'true');
      const totalActiveYearlyExp = ArrayOfObjects.sumKeyValues(activeYearlyExpArr, 'expenseValue');
      const monthlyExpenseArr = ArrayOfObjects.filterOut(expenseArr, 'frequency', 'Yearly');
      const activeMonthlyExpArr = ArrayOfObjects.filterOut(monthlyExpenseArr, 'paused', 'true');
      const totalActiveMonthExp = ArrayOfObjects.sumKeyValues(activeMonthlyExpArr, 'expenseValue');

      // Calculate Prev Month Analytics:
      const prevMonth = CalculateDist.calcPrevMonthAnaltics(
         currentAccArr,
         totalMonthlyIncome,
         totalActiveExp,
         totalActiveMonthExp,
         distForm,
      );

      // Calculate Current Account Transfers:
      const { stepsList, trackedSavingsAccountTransfers } = CalculateDist.calcTransfers(
         currentAccArr,
         creditAccArr,
         savingsAccArr,
         activeExpArr,
         totalMonthlyIncome,
         totalActiveExp,
         totalActiveMonthExp,
         totalActiveYearlyExp,
         distForm,
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
      const salaryExpAcc = CurrentClass.helper.getAccountType(currentAccArr, 'Salary & Expenses');
      const salExpLeftovers = CurrentClass.helper.getLeftover(salaryExpAcc, distForm);
      const SalaryExpAmtAtBegOfMonth = totalActiveExp + salaryExpAcc.minCushion;
      const analytics = {
         totalIncomes: totalMonthlyIncome,
         totalExpenses: SalaryExpAmtAtBegOfMonth - salExpLeftovers,
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
      currentAccArr: ICurrentFormInputs[],
      totalMonthlyIncome: number,
      totalActiveExp: number,
      totalActiveMonthExp: number,
      distForm: { [id: number]: number },
   ): NDist.ISchema['analytics'][0]['prevMonth'] {
      const SE = CurrentClass.helper.getAccountType(currentAccArr, 'Salary & Expenses');
      const SP = CurrentClass.helper.getAccountType(currentAccArr, 'Spending');
      const SE_initialBal_prevMonth = totalActiveExp + SE.minCushion; // Note: this is actually from this month rather than prev month, because I haven't implemented storing the data: total expenses from prev month and minCushion from prev month
      const SE_leftover = CurrentClass.helper.getLeftover(SE, distForm);
      const SP_leftover = CurrentClass.helper.getLeftover(SP, distForm);
      const totalExpensesSpending = SE_initialBal_prevMonth - SE_leftover;
      const SP_initialBal_prevMonth = totalMonthlyIncome - totalActiveMonthExp; // Note: this is actually from this month rather than prev month, because I haven't implemented storing the data: total Income from prev month and total monthly expenses from prev month
      const totalDisposableSpending = SP_initialBal_prevMonth - SP_leftover;
      const totalSpendings = totalDisposableSpending + totalExpensesSpending;
      return {
         totalSpendings,
         totalDisposableSpending,
         totalSavings: SP_leftover,
      };
   }
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   // -- CALC TRANSFERS FUNC: CURRENTACC TRANSFERS -- //
   private static calcTransfers(
      currentAccArr: ICurrentFormInputs[],
      creditAccArr: ICreditFormInputs[],
      savingsAccArr: ISavingsFormInputs[],
      activeExpArr: IExpenseFormInputs[],
      totalMonthlyIncome: number,
      totalActiveExp: number,
      totalActiveMonthExp: number,
      totalActiveYearlyExp: number,
      distForm: { [id: number]: number },
   ): { stepsList: string[]; trackedSavingsAccountTransfers: ISavingsAccountTransfers } {
      // ORDER OF MSGS: (Mx = multiple times)
      // 1x:   SCA (shortfall coverer savings account) --> SE (salary & expenses account)  [if the SE starting balance doesn't cover all outgoings, this makes up for it]
      // 0-Mx: SE (salary & expenses account) --> CRA (credit account(s))
      // 0-Mx: SE (salary & expenses account) --> SMA (savings manual transfer account(s)) [SMAs i.e. expenses that are of type "transfer to x savings account". These are trasnferred from SE acc by default]
      // 1x:   SE (salary & expenses account) --> SP (spendings account)
      // 1x:   SE (salary & expenses account) --> TL ('transfer leftovers to' account related to se acc)
      // 1x:   SCA (shortfall coverer savings account) --> SE (salary & expenses account)  [if the SE final balance after all outgoings doesn't meet the required balance, this transfer makes up for it]
      // 1x:   SCA (shortfall coverer savings account) --> SP (spendings account)  [if the SP starting balance doesn't cover all outgoings, this makes up for it]
      // 0-Mx: SP (spendings account) --> CRA (credit account(s))
      // 1x:   SP (spendings account) --> TL ('transfer leftovers to' account related to sp acc)

      // Gathering Data
      const SE = CurrentClass.helper.getAccountType(currentAccArr, 'Salary & Expenses');
      const SE_leftover = CurrentClass.helper.getLeftover(SE, distForm);
      const SE_hasTransferLeftoversTo = CurrentClass.helper.hasTransferLeftoversTo(SE);
      const SP = CurrentClass.helper.getAccountType(currentAccArr, 'Spending');
      const SP_leftover = CurrentClass.helper.getLeftover(SP, distForm);
      const SP_hasTransferLeftoversTo = CurrentClass.helper.hasTransferLeftoversTo(SP);
      const SCA = ArrayOfObjects.getObj(savingsAccArr, 'coversShortfall', 'true')!;
      const SE_TO_CRAs_accounts = CreditClass.helper.getAccountsWithPayBalanceFromVal(
         creditAccArr,
         currentAccArr,
         'Salary & Expenses',
      );
      const SP_TO_CRAs_accounts = CreditClass.helper.getAccountsWithPayBalanceFromVal(
         creditAccArr,
         currentAccArr,
         'Spending',
      );
      const SE_TO_SAs_expenses = ArrayOfObjects.getObjectsWithKeyWhichIncludesValue(
         activeExpArr,
         'expenseType',
         'Saving',
      );
      // i.e. Expenses that I have set to manually transfer from salaryExp to Savings Accounts when I distribute my income.
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
      const SE_startingBalance = totalMonthlyIncome + SE_leftover;
      const SE_requiredBalance = totalActiveExp + SE.minCushion;
      const SE_TO_CRAs_total = CreditClass.helper.sumBalances(SE_TO_CRAs_accounts, distForm);
      const SE_TO_SMAs_total = ArrayOfObjects.sumKeyValues(SE_TO_SMAs_expenses, 'expenseValue');

      //
      // Calculation Prep Steps:
      //
      SE_TO_SP = totalMonthlyIncome - totalActiveMonthExp;
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
         const CRA = SE_TO_CRAs_accounts[i];
         const CRA_balance = CreditClass.helper.getBalance(CRA, distForm);
         const SE_TO_CRA_msg = CalculateDist.createMsg({
            amount: CRA_balance,
            fromAccount: SE.accountName,
            transfer: { transferToAccount: CRA.accountName },
         });
         stepsList.push(SE_TO_CRA_msg);
         SE_newBalance = SE_newBalance - CRA_balance;
      }

      for (let i = 0; i < SE_TO_SAs_expenses.length; i++) {
         const expense = SE_TO_SAs_expenses[i];
         const SA = ExpensesClass.helper.savingsTransferType.getSavingsAcc(expense, savingsAccArr);
         const SE_TO_SA_isManualExp = expense.hasDistInstruction === 'true';
         const SA_isTracked = SA.isTracked === 'true';
         const SE_TO_SA_isMonthlyExp = expense.frequency === 'Monthly';
         if (SE_TO_SA_isManualExp && SE_TO_SA_isMonthlyExp) {
            const SE_TO_SA_msg = CalculateDist.createMsg({
               amount: expense.expenseValue,
               fromAccount: SE.accountName,
               transfer: { transferToAccount: SA.accountName },
               expenseName: expense.expenseName,
            });
            stepsList.push(SE_TO_SA_msg);
            SE_newBalance = SE_newBalance - expense.expenseValue;
         }
         if (SA_isTracked && SE_TO_SA_isMonthlyExp) {
            trackedSavingsAccountTransfers.push({
               id: SA.id,
               amountToTransfer: expense.expenseValue,
            });
         }
      }

      SE_TO_SP = SE_hasTransferLeftoversTo ? SE_TO_SP : SE_TO_SP + SE_TO_TL;
      const SE_TO_SP_msg = CalculateDist.createMsg({
         amount: SE_TO_SP,
         fromAccount: SE.accountName,
         transfer: { transferToAccount: SP.accountName },
      });
      stepsList.push(SE_TO_SP_msg);
      SE_newBalance = SE_newBalance - SE_TO_SP;

      if (SE_hasTransferLeftoversTo) {
         const TL = ArrayOfObjects.getObj(savingsAccArr, 'id', SE.transferLeftoversTo)!;
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
      const SP_startingBalance = SP_leftover;
      const SP_requiredBalance = SP.minCushion;
      const SP_TO_CRAs_total = CreditClass.helper.sumBalances(SP_TO_CRAs_accounts, distForm);

      //
      // Calculation Prep Steps:
      //
      const SP_outgoings = SP_TO_CRAs_total;
      const SP_final_bal = SP_startingBalance - SP_outgoings;
      SP_TO_TL = Math.max(SP_final_bal - SP_requiredBalance, 0);
      //
      const SP_out_total = SP_outgoings + SP_TO_TL;
      const SP_balance_shortfall = SP_startingBalance - SP_out_total;
      const SCA_TO_SP_INITIAL = SP_balance_shortfall >= 0 ? 0 : Math.abs(SP_balance_shortfall);
      const SCA_TO_SP_INITIAL_msg = CalculateDist.createMsg({
         amount: SCA_TO_SP_INITIAL,
         fromAccount: SCA.accountName,
         transfer: { transferToAccount: SP.accountName },
      });
      stepsList.push(SCA_TO_SP_INITIAL_msg);
      let SP_newBalance = SP_startingBalance + SCA_TO_SP_INITIAL;
      //
      // Actual Distribution Calculation Steps
      //
      for (let i = 0; i < SP_TO_CRAs_accounts.length; i++) {
         const CRA = SP_TO_CRAs_accounts[i];
         const CRA_balance = CreditClass.helper.getBalance(CRA, distForm);
         const SP_TO_CRA_msg = CalculateDist.createMsg({
            amount: CRA_balance,
            fromAccount: SP.accountName,
            transfer: { transferToAccount: CRA.accountName },
         });
         stepsList.push(SP_TO_CRA_msg);
         SP_newBalance = SP_newBalance - CRA_balance;
      }

      if (SP_hasTransferLeftoversTo) {
         const TL = ArrayOfObjects.getObj(savingsAccArr, 'id', SP.transferLeftoversTo)!;
         const SP_TO_TL_msg = CalculateDist.createMsg({
            amount: SP_TO_TL,
            fromAccount: SP.accountName,
            transfer: { transferToAccount: TL.accountName, leftover: true },
         });
         stepsList.push(SP_TO_TL_msg);
         SP_newBalance = SP_newBalance - SP_TO_TL;
         if (TL.isTracked === 'true') {
            trackedSavingsAccountTransfers.push({ id: TL.id, amountToTransfer: SP_TO_TL });
         }
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
      //
      const savingsAccHistory: NDist.ISavingsAccHist[] = [];
      //
      // Sum up amounts that have been transferred into same savings account
      //
      const totalTransfersPerSavingsAccount = ArrayOfObjects.mergeAndSum(
         savingsAccountTransfers,
         'id',
         'amountToTransfer',
      );
      //
      // Sum the total amount transferred into savings account with it's currentBalance to get it's new balance
      //
      for (let i = 0; i < totalTransfersPerSavingsAccount.length; i++) {
         const account = totalTransfersPerSavingsAccount[i];
         const currentBalance = ArrayOfObjects.getObj(
            savingsAccArr,
            'id',
            account.id,
         )!.currentBalance;
         savingsAccHistory.push({
            id: account.id,
            balance: (currentBalance || 0) + account.amountToTransfer,
            timestamp: DateHelper.toDDMMYYYY(distDate),
         });
      }
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

type ISavingsAccountTransfers = {
   id: number;
   amountToTransfer: number;
}[];
