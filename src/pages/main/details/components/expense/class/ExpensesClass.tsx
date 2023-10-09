import { UseMutationOptions, UseQueryOptions, useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import FormHelper, { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';

export interface IExpenseFormInputs {
   expenseName: string;
   expenseValue: number;
   expenseType: string;
   paused: string;
   paymentType: string;
   id: string;
}

interface IExpensesFirebase {
   [id: string]: IExpenseFormInputs;
}

export default class ExpensesClass {
   private static inputs: InputArray<IExpenseFormInputs> = [
      {
         name: 'expenseName',
         id: 'expense-name',
         placeholder: 'Expense Name',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Expense name is required';
            if (value.length < 3) return 'Expense name must be at least 3 characters long';
            if (value.length > 30) return 'Expense name must be less than 30 characters long';
            if (!/^[a-zA-Z0-9 ]+$/.test(value))
               return 'Expense name must only contain letters, numbers and spaces';
            return true;
         },
      },
      {
         name: 'expenseType',
         id: 'expense-type',
         placeholder: 'Expense Type',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'Subscription', label: 'Subscription' },
            { value: 'Household', label: 'Household' },
         ],

         validator: (value: string): string | true => {
            if (!value) return 'Please choose your expense type';
            return true;
         },
      },
      {
         name: 'expenseValue',
         id: 'expense-value',
         placeholder: 'Expense Value',
         type: 'number',
         isRequired: true,
         validator: (value: number): string | true => {
            if (typeof value !== 'number') return 'Expense value must be a number';
            return true;
         },
      },
      {
         name: 'paused',
         id: 'expense-paused',
         placeholder: 'Pause',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
         ],
         validator: (value: string): string | true => {
            if (value !== 'true' && value !== 'false') {
               return 'Please choose if you want to pause this expense';
            }
            return true;
         },
      },
      {
         name: 'paymentType',
         id: 'payment-type',
         placeholder: 'Payment Type',
         type: 'string',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'Automated', label: 'Automated' },
            { value: 'Manual', label: 'Manual' },
         ],
         validator: (value: string): string | true => {
            if (!value) return 'Please choose your payment type';
            return true;
         },
      },
   ];

   private static initialState: IExpenseFormInputs = FormHelper.createInitialState(
      ExpensesClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(ExpensesClass.inputs);

   private static validate(
      formValues: IExpenseFormInputs,
   ): Record<keyof IExpenseFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, ExpensesClass.inputs);
      return formValidation;
   }

   private static useExpensesQuery(options: UseQueryOptions<IExpensesFirebase> = {}) {
      return useQuery({
         queryKey: [microservices.getExpenses.name],
         queryFn: () =>
            APIHelper.gatewayCall<IExpensesFirebase>(
               undefined,
               'GET',
               microservices.getExpenses.name,
            ),
         ...options,
      });
   }

   private static useSetExpenseMutation(
      options: UseMutationOptions<void, unknown, IExpenseFormInputs>,
   ) {
      return useCustomMutation(
         async (formData: IExpenseFormInputs) => {
            const body = APIHelper.createBody(formData);
            const method = 'POST';
            const microserviceName = microservices.setExpense.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelExpenseMutation(
      options: UseMutationOptions<void, unknown, IExpenseFormInputs>,
   ) {
      return useCustomMutation(
         async (formData: IExpenseFormInputs) => {
            const body = APIHelper.createBody({ id: formData.id });
            const method = 'POST';
            const microserviceName = microservices.deleteExpense.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   static form = {
      inputs: ExpensesClass.inputs,
      initialState: ExpensesClass.initialState,
      initialErrors: ExpensesClass.initialErrors,
      validate: ExpensesClass.validate,
   };

   static useQuery = {
      getExpenses: ExpensesClass.useExpensesQuery,
   };

   static useMutation = {
      setExpense: ExpensesClass.useSetExpenseMutation,
      delExpense: ExpensesClass.useDelExpenseMutation,
   };
}
