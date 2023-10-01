import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useContext, useState } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { ModalContext } from '../../../../../../global/context/widget/modal/ModalContext';
import { auth } from '../../../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';
import useForm from '../../../../../../global/hooks/useForm';
import type { IChangePwdInputs } from './class/ChangePwdClass';
import ChangePwdClass from './class/ChangePwdClass';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';

export default function ChangePasswordForm(): JSX.Element {
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ChangePwdClass.initialState,
      ChangePwdClass.initialErrors,
      ChangePwdClass.validate,
   );

   const { apiError } = useApiErrorContext();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { setIsModalOpen, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);

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
            if (!isPortableDevice) return setShowSuccessMsg(true);
            setModalZIndex(1);
            setModalHeader('Password Changed');
            setModalContent(ChangePwdClass.SuccessJSX);
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
      <>
         {showSuccessMsg && ChangePwdClass.SuccessJSX}
         <ConditionalRender condition={!showSuccessMsg}>
            <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
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
         </ConditionalRender>
      </>
   );
}
