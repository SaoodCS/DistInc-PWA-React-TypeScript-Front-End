import type { InputArray } from '../../../global/helpers/lib/react/form/FormHelper';
import FormHelper from '../../../global/helpers/lib/react/form/FormHelper';

interface IRegInputs {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
}

export default class RegClass {
   static inputs: InputArray<IRegInputs> = [
      {
         name: 'email',
         id: 'reg-email',
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
         id: 'reg-password',
         placeholder: 'Password',
         type: 'password',
         autoComplete: 'new-password',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Password is required';
            if (value.length < 6) return 'Password must be at least 6 characters';
            return true;
         },
      },
      {
         name: 'confirmPassword',
         id: 'reg-confirmPassword',
         placeholder: 'Confirm Password',
         type: 'password',
         autoComplete: 'new-password',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Confirm Password is required';
            if (value.length < 6) return 'Confirm Password must be at least 6 characters';
            return true;
         },
      },
   ];

   static initialState: IRegInputs = FormHelper.createInitialState(RegClass.inputs);

   static initialErrors = FormHelper.createInitialErrors(RegClass.inputs);

   static validate(formValues: IRegInputs): Record<keyof IRegInputs, string> {
      const formValidation = FormHelper.validation(formValues, RegClass.inputs);
      if (formValues.password !== formValues.confirmPassword) {
         formValidation.confirmPassword = 'Passwords do not match';
         formValidation.password = 'Passwords do not match';
      }
      return formValidation;
   }
}
