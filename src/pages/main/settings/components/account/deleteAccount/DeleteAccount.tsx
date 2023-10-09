import { InlineTxtBtn } from '../../../../../../global/components/lib/button/inlineTextBtn/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import { auth } from '../../../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';

export default function DeleteAccount(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const deleteAccount = useCustomMutation(
      async (email: string) => {
         const body = APIHelper.createBody({ email });
         const method = 'POST';
         const microserviceName = microservices.deleteUser.name;
         await APIHelper.gatewayCall(body, method, microserviceName);
      },
      {
         onSuccess: async () => {
            await auth.signOut();
         },
         onError: () => {
            console.error(apiError);
         },
      },
   );

   async function handleDeleteBtn(): Promise<void> {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
         console.error('Current user is not found');
         return;
      }
      await deleteAccount.mutateAsync(currentUser.email);
   }

   return (
      <div style={{ padding: '1em' }}>
         <strong>Deleting your account will do the following:</strong>
         <ul>
            <li>Log you out on all devices</li>
            <li>Remove all your account information from our database</li>
         </ul>
         <div>
            <strong>
               Press delete if you still want to go through with this:{' '}
               <InlineTxtBtn isDarkTheme={isDarkTheme} isDangerBtn onClick={handleDeleteBtn}>
                  Delete
               </InlineTxtBtn>
            </strong>
         </div>
      </div>
   );
}
