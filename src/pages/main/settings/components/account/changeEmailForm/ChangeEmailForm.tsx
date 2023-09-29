import {
   EmailAuthProvider,
   reauthenticateWithCredential,
   verifyBeforeUpdateEmail,
} from 'firebase/auth';
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
import ChangeEmailClass, { IChangeEmailInputs } from './Class';

export default function ChangeEmailForm() {
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ChangeEmailClass.initialState,
      ChangeEmailClass.initialErrors,
      ChangeEmailClass.validate,
   );
   const { apiError } = useApiErrorContext();
   const { isDarkTheme } = useThemeContext();
   const { setIsModalOpen, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);

   const updateEmailCall = useCustomMutation(
      async (formData: IChangeEmailInputs) => {
         const currentUser = auth.currentUser;
         const { currentEmail, currentPassword, newEmail } = formData;
         if (currentUser) {
            const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await verifyBeforeUpdateEmail(currentUser, newEmail);
         }
      },
      {
         onSuccess: () => {
            setModalZIndex(1);
            setModalHeader('Verify New Email');
            setModalContent(
               <p>
                  We sent a verification email to <strong>{form.newEmail}</strong>. Please click the
                  link in that email to verify your new email address.
               </p>,
            );
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
         {ChangeEmailClass.inputs.map((input) => (
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
            Change Email
         </StaticButton>
      </StyledForm>
   );
}
