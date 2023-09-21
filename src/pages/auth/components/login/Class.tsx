import type { InputArray } from '../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../global/helpers/react/form/FormHelper';

interface ILoginInputs {
   email: string;
   password: string;
}

export default class LoginClass {
   static inputs: InputArray<ILoginInputs> = [
      {
         name: 'email',
         id: 'login-email',
         placeholder: 'Email',
         type: 'email',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
            return true;
         },
      },
      {
         name: 'password',
         id: 'login-password',
         placeholder: 'Password',
         type: 'password',
         autoComplete: 'current-password',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Password is required';
            if (value.length < 6) return 'Password must be at least 6 characters';
            return true;
         },
      },
   ];

   static initialState = FormHelper.createInitialState(LoginClass.inputs);

   static initialErrors = FormHelper.createInitialErrors(LoginClass.inputs);

   static validate(formValues: ILoginInputs): Record<keyof ILoginInputs, string> {
      const formValidation = FormHelper.validation(formValues, LoginClass.inputs);
      return formValidation;
   }
}
