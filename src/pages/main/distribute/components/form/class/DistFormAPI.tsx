import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import type { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';
import type { ICurrentFormInputs } from '../../../../details/components/accounts/current/class/Class';
import type NDist from '../../../namespace/NDist';
import type { ICreditFormInputs } from '../../../../details/components/accounts/credit/class/Class';
import type { IIncomeFormInputs } from '../../../../details/components/Income/class/Class';
import DateObjHelper from '../../../../../../global/helpers/dataTypes/date/DateObjHelper';

export default class DistFormAndAPI {
   // -- FORM -- //
   constructor(
      currentAccounts: ICurrentFormInputs[],
      creditAccounts: ICreditFormInputs[],
      incomes: IIncomeFormInputs[],
   ) {
      this.currentAccounts = currentAccounts;
      this.creditAccounts = creditAccounts;
      this.incomes = incomes;
   }

   private currentAccounts: ICurrentFormInputs[];
   private creditAccounts: ICreditFormInputs[];
   private incomes: IIncomeFormInputs[];

   private inputs(): InputArray<{ [x: number]: number }> {
      const mappedCurrentAccounts = this.currentAccounts.map((currentAccount) => {
         const currentMonth = DateObjHelper.getCurrentMonthName();
         const isIncomeAndExpenses = currentAccount.accountType === 'Income & Expenses';
         const defaultPlaceholder = `${currentAccount.accountName} Balance`;
         const spendingsPlaceholder = `${defaultPlaceholder} (Set to 0 if partner distributed their income for ${currentMonth} before you)`;
         const incomeExpPlaceholder = `${defaultPlaceholder} (before ${currentMonth}'s first expense)`;
         return {
            name: currentAccount.id,
            id: `leftovers-${currentAccount.accountName}`,
            placeholder: isIncomeAndExpenses ? incomeExpPlaceholder : spendingsPlaceholder,
            type: 'number',
            isRequired: true,
            validator: (value: number): string | true => {
               if (typeof value !== 'number') return 'Balance is required';
               if (value < 0) return 'Balance cannot be negative';
               return true;
            },
         };
      });
      const mappedCreditAccounts = this.creditAccounts.map((creditAccount) => {
         return {
            name: creditAccount.id,
            id: `balance-${creditAccount.accountName}`,
            placeholder: `${creditAccount.accountName} Latest Statement Balance`,
            type: 'number',
            isRequired: true,
            validator: (value: number): string | true => {
               if (typeof value !== 'number') return 'Credit statement balance is required';
               if (value < 0) return 'Credit statement balance cannot be negative';
               return true;
            },
         };
      });
      const mappedIncomes = this.incomes.map((income) => {
         const { getPrevMonthFirstDay, getPrevMonthLastDay, formatAs } = DateObjHelper;
         const firstDayOfPrevMonth = formatAs(getPrevMonthFirstDay(), 'dd/mm');
         const lastDayOfPrevMonth = formatAs(getPrevMonthLastDay(), 'dd/mm');
         return {
            name: income.id,
            id: `value-${income.incomeName}`,
            placeholder: `${income.incomeName} Income (from ${firstDayOfPrevMonth} (before first expense) to ${lastDayOfPrevMonth} (after last expense))`,
            type: 'number',
            isRequired: true,
            validator: (value: number): string | true => {
               if (typeof value !== 'number') return 'Income value is required';
               if (value < 0) return 'Income value cannot be negative';
               return true;
            },
         };
      });
      return [...mappedCurrentAccounts, ...mappedCreditAccounts, ...mappedIncomes];
   }

   private initialState(): { [x: number]: number } {
      const inputs = this.inputs();
      const initialState = FormHelper.createInitialState(
         inputs as InputArray<{ [x: number]: number }>,
      );
      return initialState;
   }

   private initialErrors(): Record<number, string> {
      const inputs = this.inputs();
      const initialErrors = FormHelper.createInitialErrors(
         inputs as InputArray<{ [x: number]: number }>,
      );
      return initialErrors;
   }

   private validate(formValues: { [x: number]: number }): Record<number, string> {
      const inputs = this.inputs();
      const formValidation = FormHelper.validation(
         formValues,
         inputs as InputArray<{ [x: number]: number }>,
      );
      return formValidation;
   }

   // -- API QUERIES / MUTATIONS -- //
   private static useCalcDistQuery(
      options: UseQueryOptions<NDist.ISchema> = {},
   ): UseQueryResult<NDist.ISchema, unknown> {
      return useQuery({
         queryKey: [microservices.getCalculations.name],
         queryFn: () =>
            APIHelper.gatewayCall<NDist.ISchema>(
               undefined,
               'GET',
               microservices.getCalculations.name,
            ),
         ...options,
      });
   }

   private static useSetCalcDistMutation(
      options: UseMutationOptions<void, unknown, NDist.ISchema>,
   ): UseMutationResult<void, unknown, NDist.ISchema> {
      return useCustomMutation(
         async (calculatedData: NDist.ISchema) => {
            const body = APIHelper.createBody(calculatedData);
            const method = 'POST';
            const microserviceName = microservices.setCalculations.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelCalcDistMutation(
      options: UseMutationOptions<void, unknown, IDelCalcDist>,
   ): UseMutationResult<void, unknown, IDelCalcDist> {
      return useCustomMutation(
         async (delCalcDistBody: IDelCalcDist) => {
            const body = APIHelper.createBody(delCalcDistBody);
            const method = 'POST';
            const microserviceName = microservices.deleteCalculations.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   get form(): {
      inputs: InputArray<{ [x: number]: number }>;
      initialState: { [x: number]: number };
      initialErrors: Record<number, string>;
      validate: (formValues: { [x: number]: number }) => Record<number, string>;
   } {
      return {
         inputs: this.inputs(),
         initialState: this.initialState(),
         initialErrors: this.initialErrors(),
         validate: this.validate.bind(this),
      };
   }

   static useQuery = {
      getCalcDist: this.useCalcDistQuery,
   };

   static useMutation = {
      setCalcDist: this.useSetCalcDistMutation,
      delCalcDist: this.useDelCalcDistMutation,
   };
}

// -- PRIVATE TYPES FOR DELCALCDIST MUTATION: -- //

interface IDelCalcDistItem {
   type: 'analyticsItem' | 'distStepsItem' | 'savingsAccHistoryItem';
   data: NDist.IAnalytics | NDist.IDistSteps | NDist.ISavingsAccHist;
}

interface IDelCalcDistMonth {
   type: 'month';
   monthYear: string;
}

interface IDelCalcDistAllSavingsAccIdHistory {
   type: 'allSavingsAccIdHistory';
   savingsAccId: number;
}

type IDelCalcDist = IDelCalcDistItem | IDelCalcDistMonth | IDelCalcDistAllSavingsAccIdHistory;

// -------------------------------------------------------------------------------------------- //
