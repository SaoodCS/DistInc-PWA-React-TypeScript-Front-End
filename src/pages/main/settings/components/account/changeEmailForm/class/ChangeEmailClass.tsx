import FormHelper, { InputArray } from '../../../../../../../global/helpers/react/form/FormHelper';

export interface IChangeEmailInputs {
   newEmail: string;
   currentEmail: string;
   currentPassword: string;
}

export default class ChangeEmailClass {
   static inputs: InputArray<IChangeEmailInputs> = [
      {
         name: 'newEmail',
         id: 'new-email',
         placeholder: 'New Email',
         type: 'email',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'You must enter your new email address';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid new email address';
            return true;
         },
      },
      {
         name: 'currentEmail',
         id: 'current-email',
         placeholder: 'Current Email',
         type: 'email',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'You must enter your current email address';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid current email address';
            return true;
         },
      },
      {
         name: 'currentPassword',
         id: 'current-password',
         placeholder: 'Current Password',
         type: 'password',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'You must enter your current password';
            if (value.length < 8) return 'Password must be at least 8 characters long';
            return true;
         },
      },
   ];

   static initialState: IChangeEmailInputs = FormHelper.createInitialState(ChangeEmailClass.inputs);

   static initialErrors = FormHelper.createInitialErrors(ChangeEmailClass.inputs);

   static validate(formValues: IChangeEmailInputs): Record<keyof IChangeEmailInputs, string> {
      const formValidation = FormHelper.validation(formValues, ChangeEmailClass.inputs);
      return formValidation;
   }
}
