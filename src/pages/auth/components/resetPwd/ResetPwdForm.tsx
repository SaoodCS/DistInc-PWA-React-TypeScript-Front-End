import { sendPasswordResetEmail } from 'firebase/auth';
import { useContext } from 'react';
import { TextBtn } from '../../../../global/components/lib/button/textBtn/Style';
import { StyledForm } from '../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { BannerContext } from '../../../../global/context/widget/banner/BannerContext';
import { auth } from '../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../global/hooks/useCustomMutation';
import useForm from '../../../../global/hooks/useForm';
import ResetPwdClass, { IResetPwdInputs } from './Class';

export default function ResetPwdForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ResetPwdClass.initialState,
      ResetPwdClass.initialErrors,
      ResetPwdClass.validate,
   );
   const { apiError } = useApiErrorContext();
   const { setShowBanner, setBannerMessage, setBannerZIndex } = useContext(BannerContext);
   const sendResetPwdEmail = useCustomMutation(
      async (formData: IResetPwdInputs) => {
         await sendPasswordResetEmail(auth, formData.email);
      },
      {
         onSuccess: () => {
            setBannerMessage('Email sent successfully. Check your inbox!');
            setBannerZIndex(1);
            setShowBanner(true);
         },
      },
   );

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await sendResetPwdEmail.mutateAsync(form);
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError}>
         {ResetPwdClass.inputs.map((input) => (
            <InputComponent
               placeholder={input.placeholder}
               type={input.type}
               name={input.name}
               isRequired={input.isRequired}
               autoComplete={input.autoComplete}
               handleChange={handleChange}
               value={form[input.name]}
               error={errors[input.name]}
               id={input.id}
               key={input.id}
            />
         ))}
         <TextBtn isDarkTheme={isDarkTheme} type="submit" position="right">
            Send Email
         </TextBtn>
      </StyledForm>
   );
}
