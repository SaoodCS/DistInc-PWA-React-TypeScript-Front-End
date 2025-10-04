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
import ArrayOfObjects from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';

export interface ICurrentFormInputs {
   accountName: string;
   minCushion: number;
   accountType: 'Salary & Expenses' | 'Spending';
   transferLeftoversTo: OptionalNumberInput;
   id: number;
}

export interface ICurrentAccountFirebase {
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
            return true;
         },
      },
      {
         name: 'accountType',
         id: 'account-type',
         placeholder: 'Account Type',
         type: 'text',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'Salary & Expenses', label: 'Salary & Expenses' },
            { value: 'Spending', label: 'Spending' },
         ],
         validator: (value: string): string | true => {
            if (!value) return 'Please choose your account type';
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
         name: 'transferLeftoversTo',
         id: 'transfer-leftovers-to',
         placeholder: 'Transfer Leftovers To',
         type: 'number',
         isRequired: false,
         isDropDown: true,
         validator: (value: OptionalNumberInput): string | true => {
            if (value && typeof value !== 'number') {
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
      if (formValues.accountType === 'Spending') {
         formValidation.minCushion = '';
      }
      return formValidation;
   }

   private static useCurrentAccountsQuery(
      options: UseQueryOptions<ICurrentAccountFirebase> = {},
   ): UseQueryResult<ICurrentAccountFirebase, unknown> {
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
   ): UseMutationResult<void, unknown, ICurrentFormInputs, void> {
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
   ): UseMutationResult<void, unknown, ICurrentFormInputs, void> {
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

   private static isItemCurrent(item: unknown): item is ICurrentFormInputs {
      return (
         (item as ICurrentFormInputs).accountName !== undefined &&
         (item as ICurrentFormInputs).accountType !== undefined &&
         (item as ICurrentFormInputs).minCushion !== undefined &&
         (item as ICurrentFormInputs).transferLeftoversTo !== undefined &&
         (item as ICurrentFormInputs).id !== undefined
      );
   }

   private static hasTransferLeftoversTo(currentAccount: ICurrentFormInputs): boolean {
      return currentAccount.transferLeftoversTo !== '';
   }

   private static getAccountType(
      currentAccArr: ICurrentFormInputs[],
      type: ICurrentFormInputs['accountType'],
   ): ICurrentFormInputs {
      return ArrayOfObjects.getObj(currentAccArr, 'accountType', type)!;
   }

   private static getLeftover(
      account: ICurrentFormInputs,
      distForm: { [x: number]: number },
   ): number {
      return distForm[account.id];
   }

   static helper = {
      hasTransferLeftoversTo: CurrentClass.hasTransferLeftoversTo,
      getAccountType: CurrentClass.getAccountType,
      getLeftover: CurrentClass.getLeftover,
   };

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

   static isType = {
      currentItem: CurrentClass.isItemCurrent,
   };
}
