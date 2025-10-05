/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
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
import CurrentClass from '../../../../details/components/accounts/current/class/Class';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';

export default function ResetAccount(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const setCurrentAccountInFirestore = CurrentClass.useMutation.setCurrentAccount({});
   const setSavingsAccountInFirestore = SavingsClass.useMutation.setSavingsAccount({});
   const queryClient = useQueryClient();

   const resetAccount = useCustomMutation(
      async (email: string) => {
         const body = APIHelper.createBody({ email });
         const method = 'POST';
         const microserviceName = microservices.resetUser.name;
         await APIHelper.gatewayCall(body, method, microserviceName);
         await Promise.all([
            setCurrentAccountInFirestore.mutateAsync({
               accountName: 'Income And Expenses',
               notes: '',
               minCushion: 0,
               accountType: 'Income & Expenses',
               transferLeftoversTo: '',
            }),
            setCurrentAccountInFirestore.mutateAsync({
               accountName: 'Spendings',
               notes: '',
               minCushion: 0,
               accountType: 'Spending',
               transferLeftoversTo: '',
            }),
            setSavingsAccountInFirestore.mutateAsync({
               accountName: 'Savings Default',
               notes: '',
               targetToReach: 0,
               currentBalance: 0,
               isTracked: 'false',
               coversShortfall: 'true',
            }),
         ]);
      },
      {
         onError: () => {
            console.error(apiError);
         },
         onSuccess: async () => {
            sessionStorage.clear();
            queryClient.clear();
            if (!isPortableDevice) {
               setShowSuccessMsg(true);
               return;
            }
            toggleModal(true);
            setModalZIndex(2);
            setModalHeader('Success');
            setModalContent(<SuccessMsg>Account resetted successfully</SuccessMsg>);
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
