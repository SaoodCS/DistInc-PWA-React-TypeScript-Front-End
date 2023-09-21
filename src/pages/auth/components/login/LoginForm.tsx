import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { StaticButton } from '../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import { ForgottenPwdBtn } from '../../style/Style';
import LoginClass from './Class';

export default function RegisterForm(): JSX.Element {
   const [loginForm, setLoginForm] = useState(LoginClass.initialState);
   const [errors, setErrors] = useState(LoginClass.initialErrors);
   const { isDarkTheme } = useThemeContext();

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      e.preventDefault();
      setErrors(LoginClass.validate(loginForm));
  
         // Log the user in using firebase
         try {
            // await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
         } catch (e: unknown) {}
      
   }

   function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
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
               autoComplete={input.autoComplete}
               handleChange={handleChange}
               value={loginForm[input.name]}
               error={errors[input.name]}
               id={input.id}
               key={input.id}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Sign In
         </StaticButton>
         <ForgottenPwdBtn isDarkTheme={isDarkTheme}>Forgot Password?</ForgottenPwdBtn>
      </StyledForm>
   );
}
