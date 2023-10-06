import type {
   InputArray,
   OptionalNumberInput,
} from '../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../global/helpers/react/form/FormHelper';

export interface ISavingsFormInputs {
   accountName: string;
   targetToReach: OptionalNumberInput;
   currentBalance: OptionalNumberInput;
   id: string;
}

export default class SavingsFormClass {
   static inputs: InputArray<ISavingsFormInputs> = [
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
   static initialState: ISavingsFormInputs = FormHelper.createInitialState(SavingsFormClass.inputs);

   static initialErrors = FormHelper.createInitialErrors(SavingsFormClass.inputs);

   static validate(formValues: ISavingsFormInputs): Record<keyof ISavingsFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, SavingsFormClass.inputs);

      return formValidation;
   }
}
