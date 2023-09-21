import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { useContext } from 'react';
import { StaticButton } from '../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import { LoaderContext } from '../../../../global/context/widget/loader/LoaderContext';
import APIHelper from '../../../../global/firebase/apis/helper/apiHelper';
import microservices from '../../../../global/firebase/apis/microservices/microservices';
import { auth } from '../../../../global/firebase/config/config';
import useForm from '../../../../global/hooks/useForm';
import RegClass from './Class';

export default function RegisterForm(): JSX.Element {
   const {
      form: regForm,
      errors,
      apiError,
      setApiError,
      handleChange,
      initHandleSubmit,
   } = useForm(RegClass.initialState, RegClass.initialErrors, RegClass.validate);

   const { isDarkTheme } = useThemeContext();
   const { setShowLoader } = useContext(LoaderContext);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      try {
         const body = APIHelper.createBody(regForm);
         const method = 'POST';
         const microserviceName = microservices.registerUser.name;
         setShowLoader(true);
         const response = await APIHelper.gatewayCall(body, method, microserviceName);
         setShowLoader(false);
         if (APIHelper.isAPICallerError(response)) return setApiError(response.error);
         if (!APIHelper.isSuccessMsgRes(response)) return setApiError('Unknown Error');
         const signInUser = await signInWithEmailAndPassword(auth, regForm.email, regForm.password);
         await sendEmailVerification(signInUser.user);
      } catch (e: unknown) {
         setApiError(APIHelper.handleError(e));
      }
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError}>
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
