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

// TODO: Change all instances of "DistributerClass" in project to DistFormAPI
export default class DistFormAndAPI {
   // -- FORM -- //
   constructor(currentAccounts: ICurrentFormInputs[]) {
      this.currentAccounts = currentAccounts;
   }

   private currentAccounts: ICurrentFormInputs[];

   private inputs(): InputArray<{ [x: number]: number }> {
      const mappedCurrentAccounts = this.currentAccounts.map((currentAccount) => {
         return {
            name: currentAccount.id,
            id: `leftovers-${currentAccount.accountName}`,
            placeholder: `${currentAccount.accountName} Leftover (Before Monthly Wage)`,
            type: 'number',
            isRequired: true,
            validator: (value: number): string | true => {
               if (typeof value !== 'number') return 'Leftover amount is required';
               if (value < 0) return 'Leftover amount cannot be negative';
               return true;
            },
         };
      });
      return mappedCurrentAccounts;
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
   type: 'analyticsItem' | 'distributerItem' | 'savingsAccHistoryItem';
   data: NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist;
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
