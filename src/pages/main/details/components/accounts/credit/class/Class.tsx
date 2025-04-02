import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import type {
   InputArray,
   OptionalNumberInput,
} from '../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../../global/hooks/useCustomMutation';

export interface ICreditFormInputs {
   accountName: string;
   payBalanceFrom: number;
   id: number;
}

export interface ICreditAccountFirebase {
   [id: string]: ICreditFormInputs;
}

export default class CreditClass {
   private static inputs: InputArray<ICreditFormInputs> = [
      {
         name: 'accountName',
         id: 'credit-account-name',
         placeholder: 'Account Name',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Account name is required';
            if (value.length < 3) return 'Account name must be at least 3 characters long';
            if (value.length > 30) return 'Account name must be less than 30 characters long';
            if (!/^[a-zA-Z0-9 ()]+$/.test(value))
               return 'Account name must only contain letters, numbers, spaces and parentheses';
            return true;
         },
      },
      {
         name: 'payBalanceFrom',
         id: 'pay-balance-from',
         placeholder: 'Pay Balance From',
         type: 'number',
         isRequired: true,
         isDropDown: true,
         validator: (value: OptionalNumberInput): string | true => {
            if (value && typeof value !== 'number') {
               return 'Please choose which account to pay your credit balance from';
            }
            return true;
         },
      },
   ];
   private static initialState: ICreditFormInputs = FormHelper.createInitialState(
      CreditClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(CreditClass.inputs);

   private static validate(formValues: ICreditFormInputs): Record<keyof ICreditFormInputs, string> {
      return FormHelper.validation(formValues, CreditClass.inputs);
   }

   private static useCreditAccountsQuery(
      options: UseQueryOptions<ICreditAccountFirebase> = {},
   ): UseQueryResult<ICreditAccountFirebase, unknown> {
      return useQuery({
         queryKey: [microservices.getCreditAccount.name],
         queryFn: () =>
            APIHelper.gatewayCall<ICreditAccountFirebase>(
               undefined,
               'GET',
               microservices.getCreditAccount.name,
            ),
         ...options,
      });
   }

   private static useSetCreditAccountMutation(
      options: UseMutationOptions<void, unknown, ICreditFormInputs>,
   ): UseMutationResult<void, unknown, ICreditFormInputs, void> {
      return useCustomMutation(
         async (formData: ICreditFormInputs) => {
            const body = APIHelper.createBody(formData);
            const method = 'POST';
            const microserviceName = microservices.setCreditAccount.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelCreditAccountMutation(
      options: UseMutationOptions<void, unknown, ICreditFormInputs>,
   ): UseMutationResult<void, unknown, ICreditFormInputs, void> {
      return useCustomMutation(
         async (formData: ICreditFormInputs) => {
            const body = APIHelper.createBody({ id: formData.id });
            const method = 'POST';
            const microserviceName = microservices.deleteCreditAccount.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static isItemCredit(item: unknown): item is ICreditFormInputs {
      return (
         (item as ICreditFormInputs).accountName !== undefined &&
         (item as ICreditFormInputs).payBalanceFrom !== undefined &&
         (item as ICreditFormInputs).id !== undefined
      );
   }

   static form = {
      inputs: CreditClass.inputs,
      initialState: CreditClass.initialState,
      initialErrors: CreditClass.initialErrors,
      validate: CreditClass.validate,
   };

   static useQuery = {
      getCreditAccounts: CreditClass.useCreditAccountsQuery,
   };
   static useMutation = {
      setCreditAccount: CreditClass.useSetCreditAccountMutation,
      delCreditAccount: CreditClass.useDelCreditAccountMutation,
   };

   static isType = {
      creditItem: CreditClass.isItemCredit,
   };
}
