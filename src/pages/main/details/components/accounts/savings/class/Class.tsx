import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import ObjectOfObjects from '../../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type {
   InputArray,
   OptionalNumberInput,
} from '../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../../global/hooks/useCustomMutation';

export interface ISavingsFormInputs {
   accountName: string;
   targetToReach: OptionalNumberInput;
   currentBalance: OptionalNumberInput;
   isTracked: 'true' | 'false';
   coversYearlyExpenses: 'true' | 'false';
   id: number;
}

export interface ISavingsAccountFirebase {
   [id: string]: ISavingsFormInputs;
}

export default class SavingsClass {
   private static inputs: InputArray<ISavingsFormInputs> = [
      {
         name: 'accountName',
         id: 'savings-account-name',
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
         name: 'isTracked',
         id: 'savings-is-tracked',
         placeholder: 'Track Balance?',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
         ],
         validator: (value: string): string | true => {
            if (value !== 'true' && value !== 'false') {
               return 'Please choose if you want to track this account';
            }
            return true;
         },
      },

      {
         name: 'coversYearlyExpenses',
         id: 'covers-yearly-expenses',
         placeholder: 'Covers Yearly Expenses?',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
         ],
         validator: (value: string): string | true => {
            if (value !== 'true' && value !== 'false') {
               return 'Please choose if you would like to cover yearly expenses with this account';
            }
            return true;
         },
      },
      {
         name: 'targetToReach',
         id: 'target-to-reach',
         placeholder: 'Target To Reach (£)',
         type: 'number',
         isRequired: false,
         validator: (value: number | ''): string | true => {
            if (value && typeof value !== 'number') return 'Target to reach must be a number';
            return true;
         },
      },
      {
         name: 'currentBalance',
         id: 'current-balance',
         placeholder: 'Current Balance (£)',
         type: 'number',
         isRequired: false,
         validator: (value: number | ''): string | true => {
            if (value && typeof value !== 'number')
               return 'Current balance to reach must be a number';
            return true;
         },
      },
   ];
   private static initialState: ISavingsFormInputs = FormHelper.createInitialState(
      SavingsClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(SavingsClass.inputs);

   private static validate(
      formValues: ISavingsFormInputs,
   ): Record<keyof ISavingsFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, SavingsClass.inputs);
      return formValidation;
   }

   private static useSavingsAccountsQuery(
      options: UseQueryOptions<ISavingsAccountFirebase> = {},
   ): UseQueryResult<ISavingsAccountFirebase, unknown> {
      return useQuery({
         queryKey: [microservices.getSavingsAccount.name],
         queryFn: () =>
            APIHelper.gatewayCall<ISavingsAccountFirebase>(
               undefined,
               'GET',
               microservices.getSavingsAccount.name,
            ),
         ...options,
      });
   }

   private static useSetSavingsAccountMutation(
      options: UseMutationOptions<void, unknown, ISavingsFormInputs>,
   ): UseMutationResult<void, unknown, ISavingsFormInputs, void> {
      return useCustomMutation(
         async (formData: ISavingsFormInputs) => {
            const body = APIHelper.createBody(formData);
            const method = 'POST';
            const microserviceName = microservices.setSavingsAccount.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelSavingsAccountMutation(
      options: UseMutationOptions<void, unknown, ISavingsFormInputs>,
   ): UseMutationResult<void, unknown, ISavingsFormInputs, void> {
      return useCustomMutation(
         async (formData: ISavingsFormInputs) => {
            const body = APIHelper.createBody({ id: formData.id });
            const method = 'POST';
            const microserviceName = microservices.deleteSavingsAccount.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static isItemSavings(item: unknown): item is ISavingsFormInputs {
      return (
         (item as ISavingsFormInputs).targetToReach !== undefined &&
         (item as ISavingsFormInputs).currentBalance !== undefined &&
         (item as ISavingsFormInputs).id !== undefined &&
         (item as ISavingsFormInputs).accountName !== undefined
      );
   }

   static form = {
      inputs: SavingsClass.inputs,
      initialState: SavingsClass.initialState,
      initialErrors: SavingsClass.initialErrors,
      validate: SavingsClass.validate,
   };

   static useQuery = {
      getSavingsAccounts: SavingsClass.useSavingsAccountsQuery,
   };
   static useMutation = {
      setSavingsAccount: SavingsClass.useSetSavingsAccountMutation,
      delSavingsAccount: SavingsClass.useDelSavingsAccountMutation,
   };

   static isType = {
      savingsItem: SavingsClass.isItemSavings,
   };

   static getNameFromId(
      savingsAccountId: number,
      savingsAccounts: ISavingsAccountFirebase,
   ): string {
      return (
         ObjectOfObjects.findObjFromUniqueVal(savingsAccounts, savingsAccountId)?.accountName || ''
      );
   }

   static getObjFromId(
      savingsAccountId: number,
      savingsAccounts: ISavingsAccountFirebase,
   ): ISavingsFormInputs | undefined {
      return ObjectOfObjects.findObjFromUniqueVal(savingsAccounts, savingsAccountId) || undefined;
   }
}

export interface IYearlyExpSavingsAccForm {
   selectedAccName: string;
   id: number;
}

export class YearlyExpSavingsAccForm {
   private static inputs: InputArray<IYearlyExpSavingsAccForm> = [
      {
         name: 'selectedAccName',
         id: 'selected-acc-name',
         placeholder: 'Change account that covers yearly expenses to:',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [],
         validator: (value: string): string | true => {
            if (!value) return 'Please select the account to cover yearly expenses';
            return true;
         },
      },
   ];

   private static initialState: IYearlyExpSavingsAccForm = FormHelper.createInitialState(
      YearlyExpSavingsAccForm.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(YearlyExpSavingsAccForm.inputs);

   private static validate(
      formValues: IYearlyExpSavingsAccForm,
   ): Record<keyof IYearlyExpSavingsAccForm, string> {
      const formValidation = FormHelper.validation(formValues, YearlyExpSavingsAccForm.inputs);
      return formValidation;
   }

   static form = {
      inputs: YearlyExpSavingsAccForm.inputs,
      initialState: YearlyExpSavingsAccForm.initialState,
      initialErrors: YearlyExpSavingsAccForm.initialErrors,
      validate: YearlyExpSavingsAccForm.validate,
   };
}
