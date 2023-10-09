import { UseMutationOptions, UseQueryOptions, useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import FormHelper, { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';

export interface IIncomeFormInputs {
   incomeName: string;
   incomeValue: number;
   id: string;
}

interface IIncomeFirebase {
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
            if (value.length > 30) return 'Income name must be less than 30 characters long';
            if (!/^[a-zA-Z0-9 ]+$/.test(value))
               return 'Income name must only contain letters, numbers and spaces';
            return true;
         },
      },
      {
         name: 'incomeValue',
         id: 'income-value',
         placeholder: 'Income Value',
         type: 'number',
         isRequired: true,
         validator: (value: number): string | true => {
            if (typeof value !== 'number') return 'Income value must be a number';
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

   private static useIncomeQuery(options: UseQueryOptions<IIncomeFirebase> = {}) {
      return useQuery({
         queryKey: [microservices.getIncomes.name],
         queryFn: () =>
            APIHelper.gatewayCall<IIncomeFirebase>(undefined, 'GET', microservices.getIncomes.name),
         ...options,
      });
   }

   private static useSetIncomeMutation(
      options: UseMutationOptions<void, unknown, IIncomeFormInputs>,
   ) {
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
   ) {
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
