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

export interface IIncomeFormInputs {
   incomeName: string;
   notes: string;
   id: number;
}

export interface IIncomeFirebase {
   [id: string]: IIncomeFormInputs;
}

export default class IncomeClass {
   private static inputs: InputArray<IIncomeFormInputs> = [
      {
         name: 'incomeName',
         id: 'income-name',
         placeholder: 'Income Name',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Income name is required';
            if (value.length < 3) return 'Income name must be at least 3 characters long';
            return true;
         },
      },
      {
         name: 'notes',
         id: 'income-notes',
         placeholder: 'Income Notes',
         type: 'text',
         isRequired: false,
         validator: (value: string): string | true => {
            if (value && value.length < 3) return 'Notes must be at least 3 characters long';
            return true;
         },
      },
   ];

   private static initialState: IIncomeFormInputs = FormHelper.createInitialState(
      IncomeClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(IncomeClass.inputs);

   private static validate(formValues: IIncomeFormInputs): Record<keyof IIncomeFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, IncomeClass.inputs);
      return formValidation;
   }

   private static useIncomeQuery(
      options: UseQueryOptions<IIncomeFirebase> = {},
   ): UseQueryResult<IIncomeFirebase, unknown> {
      return useQuery({
         queryKey: [microservices.getIncomes.name],
         queryFn: () =>
            APIHelper.gatewayCall<IIncomeFirebase>(undefined, 'GET', microservices.getIncomes.name),
         ...options,
      });
   }

   private static useSetIncomeMutation(
      options: UseMutationOptions<void, unknown, IIncomeFormInputs>,
   ): UseMutationResult<void, unknown, IIncomeFormInputs, void> {
      return useCustomMutation(
         async (formData: IIncomeFormInputs) => {
            const body = APIHelper.createBody(formData);
            const method = 'POST';
            const microserviceName = microservices.setIncome.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelIncomeMutation(
      options: UseMutationOptions<void, unknown, IIncomeFormInputs>,
   ): UseMutationResult<void, unknown, IIncomeFormInputs, void> {
      return useCustomMutation(
         async (formData: IIncomeFormInputs) => {
            const body = APIHelper.createBody({ id: formData.id });
            const method = 'POST';
            const microserviceName = microservices.deleteIncome.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static sumIncomes(
      incomesArr: IIncomeFormInputs[],
      distForm: { [x: number]: number },
   ): number {
      let total: number = 0;
      for (let i = 0; i < incomesArr.length; i++) {
         const income = incomesArr[i];
         total = total + distForm[income.id];
      }
      return total;
   }

   static helper = {
      sumIncomes: IncomeClass.sumIncomes,
   };

   static form = {
      inputs: IncomeClass.inputs,
      initialState: IncomeClass.initialState,
      initialErrors: IncomeClass.initialErrors,
      validate: IncomeClass.validate,
   };

   static useQuery = {
      getIncomes: IncomeClass.useIncomeQuery,
   };
   static useMutation = {
      setIncome: IncomeClass.useSetIncomeMutation,
      delIncome: IncomeClass.useDelIncomeMutation,
   };
}
