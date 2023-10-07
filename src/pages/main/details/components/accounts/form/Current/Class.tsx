import type { InputArray } from '../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../global/helpers/react/form/FormHelper';

export interface ICurrentFormInputs {
   accountName: string;
   minCushion: number;
   accountType: string;
   transferLeftoversTo: string;
}

export default class CurrentFormClass {
   static inputs: InputArray<ICurrentFormInputs> = [
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
   static initialState: ICurrentFormInputs = FormHelper.createInitialState(CurrentFormClass.inputs);

   static initialErrors = FormHelper.createInitialErrors(CurrentFormClass.inputs);

   static validate(formValues: ICurrentFormInputs): Record<keyof ICurrentFormInputs, string> {
      const formValidation = FormHelper.validation(formValues, CurrentFormClass.inputs);

      return formValidation;
   }
}
