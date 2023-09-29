import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useContext } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { ModalContext } from '../../../../../../global/context/widget/modal/ModalContext';
import { auth } from '../../../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';
import useForm from '../../../../../../global/hooks/useForm';
import ChangePwdClass, { IChangePwdInputs } from './class/ChangePwdClass';

export default function ChangePasswordForm() {
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ChangePwdClass.initialState,
      ChangePwdClass.initialErrors,
      ChangePwdClass.validate,
   );

   const { apiError } = useApiErrorContext();
   const { isDarkTheme } = useThemeContext();
   const { setIsModalOpen, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);

   const updateEmailCall = useCustomMutation(
      async (formData: IChangePwdInputs) => {
         const currentUser = auth.currentUser;
         const { currentEmail, currentPassword, newPassword } = formData;
         if (currentUser) {
            const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
         }
      },
      {
         onSuccess: () => {
            setModalZIndex(1);
            setModalHeader('Password Changed');
            setModalContent(<p>Your password has been successfully changed</p>);
            setIsModalOpen(true);
         },
      },
   );

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await updateEmailCall.mutateAsync(form);
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} style={{ width: '90%' }}>
         {ChangePwdClass.inputs.map((input) => (
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
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Change Password
         </StaticButton>
      </StyledForm>
   );
}
