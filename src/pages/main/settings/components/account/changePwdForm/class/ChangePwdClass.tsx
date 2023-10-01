import SuccessMsg from '../../../../../../../global/components/lib/font/successMsg/SuccessMsg';
import type { InputArray } from '../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../global/helpers/react/form/FormHelper';

export interface IChangePwdInputs {
   currentEmail: string;
   currentPassword: string;
   newPassword: string;
}

export default class ChangePwdClass {
   static inputs: InputArray<IChangePwdInputs> = [
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
      {
         name: 'newPassword',
         id: 'new-pwd',
         placeholder: 'New Password',
         type: 'password',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'You must enter your current password';
            if (value.length < 8) return 'Password must be at least 8 characters long';
            return true;
         },
      },
   ];

   static initialState: IChangePwdInputs = FormHelper.createInitialState(ChangePwdClass.inputs);

   static initialErrors = FormHelper.createInitialErrors(ChangePwdClass.inputs);

   static validate(formValues: IChangePwdInputs): Record<keyof IChangePwdInputs, string> {
      const formValidation = FormHelper.validation(formValues, ChangePwdClass.inputs);
      return formValidation;
   }

   static SuccessJSX = (<SuccessMsg>Your password has been changed successfully.</SuccessMsg>);
}
