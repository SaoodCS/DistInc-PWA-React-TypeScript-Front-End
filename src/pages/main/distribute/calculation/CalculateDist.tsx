/* eslint-disable @typescript-eslint/naming-convention */
import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import _Date from '../../../../global/helpers/dataTypes/date/_Date';
import NumberHelper from '../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../details/components/Income/class/Class';
import IncomeClass from '../../details/components/Income/class/Class';
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
      distForm: { [id: number]: number }, // contains current account balances and credit account balances and income earnt this month from different sources
   ): NDist.ISchema {
      const creditAccArr = ObjectOfObjects.convertToArrayOfObj(creditAccounts);
      const currentAccArr = ObjectOfObjects.convertToArrayOfObj(currentAccounts);
      const savingsAccArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
      const incomeArr = ObjectOfObjects.convertToArrayOfObj(incomes);
      const expenseArr = ObjectOfObjects.convertToArrayOfObj(expenses);
      const yearlyExpenseArr = ArrayOfObjects.filterOut(expenseArr, 'frequency', 'Monthly');
      const monthlyExpenseArr = ArrayOfObjects.filterOut(expenseArr, 'frequency', 'Yearly');
      const activeYearlyExpArr = ArrayOfObjects.filterOut(yearlyExpenseArr, 'paused', 'true');
      const activeMonthlyExpArr = ArrayOfObjects.filterOut(monthlyExpenseArr, 'paused', 'true');
      const activeExpArr = ArrayOfObjects.filterOut(expenseArr, 'paused', 'true');

      const IE = CurrentClass.helper.getAccountFromType(currentAccArr, 'Income & Expenses');
      const SP = CurrentClass.helper.getAccountFromType(currentAccArr, 'Spending');

      const totalIncome_pastMonth = IncomeClass.helper.sumIncomes(incomeArr, distForm);
      const incomeNamesAndEarnings_pastMonth = incomeArr.map((income) => ({
         name: income.incomeName,
         earned: distForm[income.id],
      }));
      const totalExp_active = ArrayOfObjects.sumKeyValues(activeExpArr, 'expenseValue');
      const totalExp_active_yearly = ArrayOfObjects.sumKeyValues(
         activeYearlyExpArr,
         'expenseValue',
      );
      const totalExp_active_monthly = ArrayOfObjects.sumKeyValues(
         activeMonthlyExpArr,
         'expenseValue',
      );

      // Calculate Current Account Transfers:
      const { stepsList, trackedSavingsAccountTransfers } = CalculateDist.calcTransfers(
         IE,
         SP,
         creditAccArr,
         savingsAccArr,
         activeExpArr,
         totalIncome_pastMonth,
         totalExp_active,
         totalExp_active_monthly,
         totalExp_active_yearly,
         distForm,
      );

      // Create Savings Account History Array:
      const savingsAccHistory = CalculateDist.updateSavingsAccHistory(
         distDate,
         trackedSavingsAccountTransfers,
         savingsAccArr,
      );

      // Create distSteps Obj:
      const distSteps = { timestamp: _Date.Obj.toDDMMYYYY(distDate), list: stepsList };

      // Create Analytics Obj:

      const IE_balance_endOfPastMonth = CurrentClass.helper.getBalance(IE, distForm);
      const IE_leftovers_endOfPastMonth = IE_balance_endOfPastMonth - totalIncome_pastMonth;
      const IE_balance_startOfPastMonth = totalExp_active + IE.minCushion;
      const analytics = {
         totalIncomes: totalIncome_pastMonth,
         totalDisposableIncome: totalIncome_pastMonth - totalExp_active_monthly,
         incomeEarnings: incomeNamesAndEarnings_pastMonth,
         totalExpenses: IE_balance_startOfPastMonth - IE_leftovers_endOfPastMonth,
         totalMonthlyExpenses: totalExp_active_monthly,
         timestamp: _Date.Obj.toDDMMYYYY(distDate),
      };

      return {
         distSteps: [distSteps],
         savingsAccHistory: savingsAccHistory,
         analytics: [analytics],
      };
   }
   //----------------------------------------------------------------------------
   //----------------------------------------------------------------------------
   // -- CALC TRANSFERS FUNC: CURRENTACC TRANSFERS -- //
   private static calcTransfers(
      IE: ICurrentFormInputs,
      SP: ICurrentFormInputs,
      creditAccArr: ICreditFormInputs[],
      savingsAccArr: ISavingsFormInputs[],
      activeExpArr: IExpenseFormInputs[],
      totalIncome_pastMonth: number,
      totalExp_active: number,
      totalExp_active_monthly: number,
      totalExp_active_yearly: number,
      distForm: { [id: number]: number },
   ): { stepsList: string[]; trackedSavingsAccountTransfers: ISavingsAccountTransfers } {
      // ORDER OF MSGS: (Mx = multiple times)
      // 1x:   SCA (shortfall coverer savings account) --> IE (income & expenses account)  [if the IE starting balance doesn't cover all outgoings, this makes up for it]
      // 0-Mx: IE (income & expenses account) --> CRA (credit account(s))
      // 0-Mx: IE (income & expenses account) --> SMA (savings manual transfer account(s)) [SMAs i.e. expenses that are of type "transfer to x savings account". These are trasnferred from IE acc by default]
      // 1x:   IE (income & expenses account) --> SP (spendings account)
      // 1x:   IE (income & expenses account) --> TL ('transfer leftovers to' account related to se acc)
      // 1x:   SCA (shortfall coverer savings account) --> IE (income & expenses account)  [if the IE final balance after all outgoings doesn't meet the required balance, this transfer makes up for it]
      // 1x:   SCA (shortfall coverer savings account) --> SP (spendings account)  [if the SP starting balance doesn't cover all outgoings, this makes up for it]
      // 0-Mx: SP (spendings account) --> CRA (credit account(s))
      // 1x:   SP (spendings account) --> TL ('transfer leftovers to' account related to sp acc)

      // Gathering Data
      const IE_balance_endOfPastMonth = CurrentClass.helper.getBalance(IE, distForm);
      const IE_hasTransferLeftoversTo = CurrentClass.helper.hasTransferLeftoversTo(IE);
      const SP_balance_endOfPastMonth = CurrentClass.helper.getBalance(SP, distForm);
      const SP_hasTransferLeftoversTo = CurrentClass.helper.hasTransferLeftoversTo(SP);
      const SCA = ArrayOfObjects.getObj(savingsAccArr, 'coversShortfall', 'true')!;
      const IE_TO_CRAs_accounts = ArrayOfObjects.getObjects(creditAccArr, 'payBalanceFrom', IE.id);
      const SP_TO_CRAs_accounts = ArrayOfObjects.getObjects(creditAccArr, 'payBalanceFrom', SP.id);

      const IE_TO_SAs_expenses = ArrayOfObjects.getObjectsWithKeyWhichIncludesValue(
         activeExpArr,
         'expenseType',
         'Saving',
      );
      // i.e. Expenses that I have set to manually transfer from incomeExp to Savings Accounts when I distribute my income.
      const IE_TO_SMAs_expenses = ArrayOfObjects.filterIn(
         IE_TO_SAs_expenses,
         'hasDistInstruction',
         'true',
      );
      let IE_TO_TL: number = 0;
      let IE_TO_SP: number = 0;
      let SCA_TO_IE: number = 0;
      let SP_TO_TL: number = 0;
      const stepsList: string[] = [];
      const trackedSavingsAccountTransfers: ISavingsAccountTransfers = [];
      //
      // -- S A L A R Y  &  E X P E N S E S  C U R R E N T  A C C O U N T  T R A N S F E R S -- //
      //
      const IE_startingBalance = IE_balance_endOfPastMonth;
      const IE_requiredBalance = totalExp_active + IE.minCushion;
      const IE_TO_CRAs_total = CreditClass.helper.sumBalances(IE_TO_CRAs_accounts, distForm);
      const IE_TO_SMAs_total = ArrayOfObjects.sumKeyValues(IE_TO_SMAs_expenses, 'expenseValue');

      //
      // Calculation Prep Steps:
      //
      IE_TO_SP = Math.max(totalIncome_pastMonth - totalExp_active_monthly, 0);
      //
      const IE_outgoings = IE_TO_CRAs_total + IE_TO_SMAs_total + IE_TO_SP;
      const IE_final_bal = IE_startingBalance - IE_outgoings;
      IE_TO_TL = Math.max(IE_final_bal - IE_requiredBalance, 0);
      //
      const IE_out_total = IE_outgoings + IE_TO_TL;
      const IE_balance_shortfall = IE_startingBalance - IE_out_total;
      const SCA_TO_IE_INITIAL = IE_balance_shortfall >= 0 ? 0 : Math.abs(IE_balance_shortfall);
      const SCA_TO_IE_INITIAL_msg = CalculateDist.createMsg({
         amount: SCA_TO_IE_INITIAL,
         fromAccount: SCA.accountName,
         transfer: { transferToAccount: IE.accountName },
      });
      stepsList.push(SCA_TO_IE_INITIAL_msg);
      let IE_newBalance = IE_startingBalance + SCA_TO_IE_INITIAL;
      //
      // Actual Distribution Calculation Steps
      //
      for (let i = 0; i < IE_TO_CRAs_accounts.length; i++) {
         const CRA = IE_TO_CRAs_accounts[i];
         const CRA_balance = CreditClass.helper.getBalance(CRA, distForm);
         const IE_TO_CRA_msg = CalculateDist.createMsg({
            amount: CRA_balance,
            fromAccount: IE.accountName,
            transfer: { transferToAccount: CRA.accountName },
         });
         stepsList.push(IE_TO_CRA_msg);
         IE_newBalance = IE_newBalance - CRA_balance;
      }

      for (let i = 0; i < IE_TO_SAs_expenses.length; i++) {
         const expense = IE_TO_SAs_expenses[i];
         const SA = ExpensesClass.helper.savingsTransferType.getSavingsAcc(expense, savingsAccArr);
         const IE_TO_SA_isManualExp = expense.hasDistInstruction === 'true';
         const SA_isTracked = SA.isTracked === 'true';
         const IE_TO_SA_isMonthlyExp = expense.frequency === 'Monthly';
         if (IE_TO_SA_isManualExp && IE_TO_SA_isMonthlyExp) {
            const IE_TO_SA_msg = CalculateDist.createMsg({
               amount: expense.expenseValue,
               fromAccount: IE.accountName,
               transfer: { transferToAccount: SA.accountName },
               expenseName: expense.expenseName,
            });
            stepsList.push(IE_TO_SA_msg);
            IE_newBalance = IE_newBalance - expense.expenseValue;
         }
         if (SA_isTracked && IE_TO_SA_isMonthlyExp) {
            trackedSavingsAccountTransfers.push({
               id: SA.id,
               amountToTransfer: expense.expenseValue,
            });
         }
      }

      IE_TO_SP = IE_hasTransferLeftoversTo ? IE_TO_SP : IE_TO_SP + IE_TO_TL;
      const IE_TO_SP_msg = CalculateDist.createMsg({
         amount: IE_TO_SP,
         fromAccount: IE.accountName,
         transfer: { transferToAccount: SP.accountName },
      });
      stepsList.push(IE_TO_SP_msg);
      IE_newBalance = IE_newBalance - IE_TO_SP;

      if (IE_hasTransferLeftoversTo) {
         const TL = ArrayOfObjects.getObj(savingsAccArr, 'id', IE.transferLeftoversTo)!;
         const IE_TO_TL_msg = CalculateDist.createMsg({
            amount: IE_TO_TL,
            fromAccount: IE.accountName,
            transfer: { transferToAccount: TL.accountName, leftover: true },
         });
         stepsList.push(IE_TO_TL_msg);
         IE_newBalance = IE_newBalance - IE_TO_TL;
         if (TL.isTracked === 'true') {
            trackedSavingsAccountTransfers.push({ id: TL.id, amountToTransfer: IE_TO_TL });
         }
      }

      SCA_TO_IE = IE_requiredBalance - IE_newBalance;
      const SCA_TO_IE_msg = CalculateDist.createMsg({
         amount: SCA_TO_IE,
         fromAccount: SCA.accountName,
         transfer: { transferToAccount: IE.accountName },
      });
      stepsList.push(SCA_TO_IE_msg);
      //
      // -- S P E N D I N G S  A C C O U N T  T R A N S F E R S -- //
      //
      const SP_startingBalance = SP_balance_endOfPastMonth;
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
            timestamp: _Date.Obj.toDDMMYYYY(distDate),
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
