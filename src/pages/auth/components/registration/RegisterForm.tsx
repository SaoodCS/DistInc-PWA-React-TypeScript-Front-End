import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { StaticButton } from '../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../global/components/lib/form/input/Input';
import useAuthContext from '../../../../global/context/auth/hooks/useAuthContext';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import { auth } from '../../../../global/firebase/config/config';
import FormHelper from '../../../../global/helpers/react/form/FormHelper';
import RegClass from './Class';

export default function RegisterForm(): JSX.Element {
   const [regForm, setRegForm] = useState(RegClass.initialState);
   const [errors, setErrors] = useState(RegClass.initialErrors);
   const { isDarkTheme } = useThemeContext();
   const { setIsSignedIn } = useAuthContext();

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      e.preventDefault();
      setErrors(RegClass.validate(regForm));
      console.log(RegClass.validate(regForm));
      if (FormHelper.hasNoErrors(errors)) {
         // Register the user to the microservice endpoint
      }
   }

   function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
      const { name, value } = e.target;
      setRegForm((prev) => ({ ...prev, [name]: value }));
   }

   return (
      <StyledForm onSubmit={handleSubmit}>
         {RegClass.inputs.map((input) => (
            <InputComponent
               placeholder={input.placeholder}
               type={input.type}
               name={input.name}
               isRequired={input.isRequired}
               autoComplete={input.autoComplete}
               handleChange={handleChange}
               value={regForm[input.name]}
               error={errors[input.name]}
               id={input.id}
               key={input.id}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Sign Up
         </StaticButton>
      </StyledForm>
   );
}