import { useState } from 'react';
import { StaticButton } from '../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../global/components/lib/form/form/Style';
import InputComponent from '../../../global/components/lib/form/input/Input';
import FormHelper from '../../../global/helpers/lib/react/form/FormHelper';
import useThemeContext from '../../../global/hooks/useThemeContext';
import { ForgottenPwdBtn } from '../Style';
import LoginClass from './Class';

export default function RegisterForm(): JSX.Element {
   const [loginForm, setLoginForm] = useState(LoginClass.initialState);
   const [errors, setErrors] = useState(LoginClass.initialErrors);
   const { isDarkTheme } = useThemeContext();

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setErrors(LoginClass.validate(loginForm));
      if (FormHelper.hasNoErrors(errors)) {
         // Log the user in using firebase
      }
   }

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target;
      setLoginForm((prev) => ({ ...prev, [name]: value }));
   }
   return (
      <StyledForm onSubmit={handleSubmit}>
         {LoginClass.inputs.map((input) => (
            <InputComponent
               placeholder={input.placeholder}
               type={input.type}
               name={input.name}
               isRequired={input.isRequired}
               handleChange={handleChange}
               value={loginForm[input.name]}
               error={errors[input.name]}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Sign Up
         </StaticButton>
         <ForgottenPwdBtn isDarkTheme={isDarkTheme}>Forgot Password?</ForgottenPwdBtn>
      </StyledForm>
   );
}
