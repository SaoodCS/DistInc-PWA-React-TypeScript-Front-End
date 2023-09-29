import {
   EmailAuthProvider,
   reauthenticateWithCredential,
   verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { useState } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../global/components/lib/form/input/Input';
import Loader from '../../../../../../global/components/lib/loader/Loader';
import Modal from '../../../../../../global/components/lib/modal/Modal';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
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
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

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
         onMutate: () => {
            setIsLoading(true);
         },
         onSuccess: () => {
            setIsLoading(false);
            setIsModalOpen(true);
         },
         onSettled: () => {
            setIsLoading(false);
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
         <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            header={'Verify New Email'}
         >
            <p>
               We sent a verification email to <strong>{form.newEmail}</strong>. Please click the
               link in that email to verify your new email address.
            </p>
         </Modal>
         <Loader isDisplayed={isLoading} />
      </StyledForm>
   );
}
