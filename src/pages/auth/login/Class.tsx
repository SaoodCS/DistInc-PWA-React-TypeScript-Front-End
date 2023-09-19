import FormHelper, { InputArray } from '../../../global/helpers/lib/react/form/FormHelper';

interface ILoginInputs {
   email: string;
   password: string;
}

export default class LoginClass {
   static inputs: InputArray<ILoginInputs> = [
      {
         name: 'email',
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
         placeholder: 'Password',
         type: 'password',
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

   static validate(formValues: ILoginInputs) {
      const formValidation = FormHelper.validation(formValues, LoginClass.inputs);
      return formValidation;
   }
}
