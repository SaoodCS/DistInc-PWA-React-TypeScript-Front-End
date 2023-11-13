import {
   EmailAuthProvider,
   reauthenticateWithCredential,
   verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { useContext, useState } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../global/components/lib/form/input/Input';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { ModalContext } from '../../../../../../global/context/widget/modal/ModalContext';
import { auth } from '../../../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';
import useForm from '../../../../../../global/hooks/useForm';
import type { IChangeEmailInputs } from './class/ChangeEmailClass';
import ChangeEmailClass from './class/ChangeEmailClass';

export default function ChangeEmailForm(): JSX.Element {
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ChangeEmailClass.initialState,
      ChangeEmailClass.initialErrors,
      ChangeEmailClass.validate,
   );
   const { apiError } = useApiErrorContext();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);

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
            if (!isPortableDevice) {
               setShowSuccessMsg(true);
               return;
            }
            toggleModal(true);
            setModalZIndex(2);
            setModalHeader('Verify New Email');
            setModalContent(ChangeEmailClass.SuccessJSX(form.newEmail));
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
         {showSuccessMsg && ChangeEmailClass.SuccessJSX(form.newEmail)}
         <ConditionalRender condition={!showSuccessMsg}>
            <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
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
         </ConditionalRender>
      </>
   );
}
