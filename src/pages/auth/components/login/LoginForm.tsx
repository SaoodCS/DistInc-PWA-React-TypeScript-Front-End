import { signInWithEmailAndPassword } from 'firebase/auth';
import { useContext } from 'react';
import { StaticButton } from '../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { ModalContext } from '../../../../global/context/widget/modal/ModalContext';
import { auth } from '../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../global/hooks/useCustomMutation';
import useForm from '../../../../global/hooks/useForm';
import { ForgottenPwdBtn } from '../../style/Style';
import ResetPwdForm from '../resetPwd/ResetPwdForm';
import type { ILoginInputs } from './Class';
import LoginClass from './Class';

export default function LoginForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const {
      form: loginForm,
      errors,
      handleChange,
      initHandleSubmit,
   } = useForm(LoginClass.initialState, LoginClass.initialErrors, LoginClass.validate);
   const { apiError } = useApiErrorContext();
   const { toggleModal, setModalHeader, setModalContent, setModalZIndex } =
      useContext(ModalContext);

   const loginUser = useCustomMutation(async (formData: ILoginInputs) => {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await loginUser.mutateAsync(loginForm);
   }

   async function handleForgotPwd(): Promise<void> {
      setModalHeader('Reset Password');
      setModalContent(<ResetPwdForm />);
      setModalZIndex(0);
      toggleModal();
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
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
         <ForgottenPwdBtn isDarkTheme={isDarkTheme} type={'button'} onClick={handleForgotPwd}>
            Forgot Password?
         </ForgottenPwdBtn>
      </StyledForm>
   );
}

// const loginMutationInstance = useMutation(loginMutation, {
//    onMutate: () => {
//       setShowLoader(true);
//    },
//    onSettled: (data, error) => {
//       setShowLoader(false);
//       if (error) setApiError(APIHelper.handleError(error));
//       if (data) console.log(data);
//    },
// });

// // useMutation instead to sign user in:

// async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
//    const { isFormValid } = initHandleSubmit(e);
//    if (!isFormValid) return;
//    try {
//       //setShowLoader(true);
//       await loginMutationInstance.mutateAsync(loginForm);
//       //setShowLoader(false);
//    } catch (e: unknown) {
//       setApiError(APIHelper.handleError(e));
//    }
// }
