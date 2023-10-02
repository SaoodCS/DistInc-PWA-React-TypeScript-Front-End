import { useContext, useState } from 'react';
import { InlineTxtBtn } from '../../../../../../global/components/lib/button/inlineTextBtn/Style';
import { TextBtn } from '../../../../../../global/components/lib/button/textBtn/Style';
import SuccessMsg from '../../../../../../global/components/lib/font/successMsg/SuccessMsg';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { ModalContext } from '../../../../../../global/context/widget/modal/ModalContext';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import { auth } from '../../../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';
import Color from '../../../../../../global/theme/colors';

export default function ResetAccount(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);
   const { setIsModalOpen, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);

   const resetAccount = useCustomMutation(
      async (email: string) => {
         const body = APIHelper.createBody({ email });
         const method = 'POST';
         const microserviceName = microservices.resetUser.name;
         await APIHelper.gatewayCall(body, method, microserviceName);
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
            setModalZIndex(1);
            setModalHeader('Success');
            setModalContent(<SuccessMsg>Account resetted successfully</SuccessMsg>);
            setIsModalOpen(true);
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
      <div style = {{padding:'1em'}}>
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
