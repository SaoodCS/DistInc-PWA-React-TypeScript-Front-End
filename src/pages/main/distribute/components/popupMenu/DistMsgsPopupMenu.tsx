/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../global/components/lib/popupMenu/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import type { ICalcSchema } from '../calculation/CalculateDist';
import DistributerClass from '../distributerForm/class/DistributerClass';

interface IDistMsgsPopupMenu {
   distributerItem: ICalcSchema['distributer'][0];
}

export default function DistMsgsPopupMenu(props: IDistMsgsPopupMenu): JSX.Element {
   const { distributerItem } = props;
   const { isDarkTheme } = useThemeContext();

   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = DistributerClass.useMutation.delCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });
   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'distributerItem',
         data: distributerItem,
      });
   }

   function handleView() {
      //TODO: handleView modal here
   }

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer onClick={() => handleView()} isDarkTheme={isDarkTheme}>
            <PMItemTitle>View Details</PMItemTitle>
            <DocumentDelete />
         </PMItemContainer>
         <PMItemContainer onClick={() => handleDelete()} isDarkTheme={isDarkTheme} dangerItem>
            <PMItemTitle>Delete This</PMItemTitle>
            <DocumentDelete />
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
