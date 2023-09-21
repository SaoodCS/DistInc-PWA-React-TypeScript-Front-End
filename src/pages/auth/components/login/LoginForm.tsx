import { signInWithEmailAndPassword } from 'firebase/auth';
import { StaticButton } from '../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import APIHelper from '../../../../global/firebase/apis/helper/apiHelper';
import { auth } from '../../../../global/firebase/config/config';
import useForm from '../../../../global/hooks/useForm';
import { ForgottenPwdBtn } from '../../style/Style';
import LoginClass from './Class';

export default function RegisterForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const {
      form: loginForm,
      errors,
      apiError,
      setApiError,
      handleChange,
      initHandleSubmit,
   } = useForm(LoginClass.initialState, LoginClass.initialErrors, LoginClass.validate);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      try {
         await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      } catch (e: unknown) {
         setApiError(APIHelper.handleError(e));
      }
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError}>
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
            Sign Up
         </StaticButton>
         <ForgottenPwdBtn isDarkTheme={isDarkTheme}>Forgot Password?</ForgottenPwdBtn>
      </StyledForm>
   );
}
