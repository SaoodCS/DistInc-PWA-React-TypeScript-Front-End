import type { InputArray } from '../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../global/helpers/react/form/FormHelper';

export interface IResetPwdInputs {
   email: string;
}

export default class ResetPwdClass {
   static inputs: InputArray<IResetPwdInputs> = [
      {
         name: 'email',
         id: 'resetpwd-email',
         placeholder: 'Email',
         type: 'email',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
            return true;
         },
      },
   ];

   static initialState = FormHelper.createInitialState(ResetPwdClass.inputs);

   static initialErrors = FormHelper.createInitialErrors(ResetPwdClass.inputs);

   static validate(formValues: IResetPwdInputs): Record<keyof IResetPwdInputs, string> {
      const formValidation = FormHelper.validation(formValues, ResetPwdClass.inputs);
      return formValidation;
   }
}
