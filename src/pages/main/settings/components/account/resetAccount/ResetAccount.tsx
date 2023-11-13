import { useContext, useState } from 'react';
import { InlineTxtBtn } from '../../../../../../global/components/lib/button/inlineTextBtn/Style';
import SuccessMsg from '../../../../../../global/components/lib/font/successMsg/SuccessMsg';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { ModalContext } from '../../../../../../global/context/widget/modal/ModalContext';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import { auth } from '../../../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';
import type { ICurrentFormInputs } from '../../../../details/components/accounts/current/class/Class';
import CurrentClass from '../../../../details/components/accounts/current/class/Class';

export default function ResetAccount(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const setCurrentAccountInFirestore = CurrentClass.useMutation.setCurrentAccount({});

   const resetAccount = useCustomMutation(
      async (email: string) => {
         const body = APIHelper.createBody({ email });
         const method = 'POST';
         const microserviceName = microservices.resetUser.name;
         await APIHelper.gatewayCall(body, method, microserviceName);
         await setCurrentAccountInFirestore.mutateAsync({
            accountName: 'Salary And Expenses',
            minCushion: 0,
            accountType: 'Salary & Expenses',
            transferLeftoversTo: '',
         } as ICurrentFormInputs);
         await setCurrentAccountInFirestore.mutateAsync({
            accountName: 'Spendings',
            minCushion: 0,
            accountType: 'Spending',
            transferLeftoversTo: '',
         } as ICurrentFormInputs);
      },
      {
         onError: () => {
            console.error(apiError);
         },
         onSuccess: async () => {
            if (!isPortableDevice) {
               setShowSuccessMsg(true);
               return;
            }
            setModalZIndex(2);
            setModalHeader('Success');
            setModalContent(<SuccessMsg>Account resetted successfully</SuccessMsg>);
            toggleModal();
         },
      },
   );

   async function handleResetBtn(): Promise<void> {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
         console.error('Current user is not found');
         return;
      }
      await resetAccount.mutateAsync(currentUser.email);
   }

   return (
      <div style={{ padding: '1em' }}>
         {showSuccessMsg && <SuccessMsg>Account resetted successfully</SuccessMsg>}
         <ConditionalRender condition={!showSuccessMsg}>
            <strong>Resetting your account will do the following:</strong>
            <ul>
               <li>Remove all your account information from our database</li>
               <li>Set up your account with a new blank storage</li>
            </ul>
            <strong>
               Press reset if you still want to go through with this:{' '}
               <InlineTxtBtn isDarkTheme={isDarkTheme} isWarningBtn onClick={handleResetBtn}>
                  Reset
               </InlineTxtBtn>
            </strong>
         </ConditionalRender>
      </div>
   );
}
