import { useQueryClient } from '@tanstack/react-query';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../global/components/lib/popupMenu/Style';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import { ICalcSchema } from '../calculation/CalculateDist';
import DistributerClass from '../distributerForm/class/DistributerClass';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';

interface IDistMsgsPopupMenu {
   distributerItem: ICalcSchema['distributer'][0];
}

export default function DistMsgsPopupMenu(props: IDistMsgsPopupMenu) {
   const { distributerItem } = props;
   const { isDarkTheme } = useThemeContext();

   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = DistributerClass.useMutation.delCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });
   async function handleDelete() {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'distributerItem',
         data: distributerItem,
      });
   }

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer onClick={() => handleDelete()} isDarkTheme={isDarkTheme} dangerItem>
            <PMItemTitle>Delete This</PMItemTitle>
            <DocumentDelete />
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
