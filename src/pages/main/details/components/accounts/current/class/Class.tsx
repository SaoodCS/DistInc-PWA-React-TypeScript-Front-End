import { UseMutationOptions, UseQueryOptions, useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import type { InputArray } from '../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../../global/hooks/useCustomMutation';

export interface ICurrentFormInputs {
   accountName: string;
   minCushion: number;
   accountType: string;
   transferLeftoversTo: string;
   id: string;
}

interface ICurrentAccountFirebase {
   [id: string]: ICurrentFormInputs;
}

export default class CurrentClass {
   private static inputs: InputArray<ICurrentFormInputs> = [
      {
         name: 'accountName',
         id: 'current-account-name',
         placeholder: 'Account Name',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Account name is required';
            if (value.length < 3) return 'Account name must be at least 3 characters long';
            if (value.length > 30) return 'Account name must be less than 30 characters long';
            if (!/^[a-zA-Z0-9 ]+$/.test(value))
               return 'Account name must only contain letters, numbers and spaces';
            return true;
         },
      },
      {
         name: 'minCushion',
         id: 'min-cushion',
         placeholder: 'Min Cushion (£)',
         type: 'number',
         isRequired: true,
         validator: (value: number): string | true => {
            if (typeof value !== 'number') return 'Minimum cushion must be a number';
            return true;
         },
      },
      {
         name: 'accountType',
         id: 'account-type',
         placeholder: 'Account Type',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'salaryexpenses', label: 'Salary & Expenses' },
            { value: 'spending', label: 'Spending' },
         ],

         validator: (value: string): string | true => {
            if (!value) return 'Please choose your account type';
            return true;
         },
      },
      {
         name: 'transferLeftoversTo',
         id: 'transfer-leftovers-to',
         placeholder: 'Transfer Leftovers To',
         type: 'string',
         isRequired: false,
         isDropDown: true,
         validator: (value: string): string | true => {
            if (value && typeof value !== 'string') {
               return 'Please choose where to transfer leftovers to';
            }
            return true;
         },
      },
   ];
   private static initialState: ICurrentFormInputs = FormHelper.createInitialState(
      CurrentClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(CurrentClass.inputs);

   private static validate(
      formValues: ICurrentFormInputs,
   ): Record<keyof ICurrentFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, CurrentClass.inputs);
      return formValidation;
   }

   private static useCurrentAccountsQuery(options: UseQueryOptions<ICurrentAccountFirebase> = {}) {
      return useQuery({
         queryKey: [microservices.getCurrentAccount.name],
         queryFn: () =>
            APIHelper.gatewayCall<ICurrentAccountFirebase>(
               undefined,
               'GET',
               microservices.getCurrentAccount.name,
            ),
         ...options,
      });
   }

   private static useSetCurrentAccountMutation(
      options: UseMutationOptions<void, unknown, ICurrentFormInputs>,
   ) {
      return useCustomMutation(
         async (formData: ICurrentFormInputs) => {
            const body = APIHelper.createBody(formData);
            const method = 'POST';
            const microserviceName = microservices.setCurrentAccount.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelCurrentAccountMutation(
      options: UseMutationOptions<void, unknown, ICurrentFormInputs>,
   ) {
      return useCustomMutation(
         async (formData: ICurrentFormInputs) => {
            const body = APIHelper.createBody({ id: formData.id });
            const method = 'POST';
            const microserviceName = microservices.deleteCurrentAccount.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   static form = {
      inputs: CurrentClass.inputs,
      initialState: CurrentClass.initialState,
      initialErrors: CurrentClass.initialErrors,
      validate: CurrentClass.validate,
   };

   static useQuery = {
      getCurrentAccounts: CurrentClass.useCurrentAccountsQuery,
   };
   static useMutation = {
      setCurrentAccount: CurrentClass.useSetCurrentAccountMutation,
      delCurrentAccount: CurrentClass.useDelCurrentAccountMutation,
   };
}
