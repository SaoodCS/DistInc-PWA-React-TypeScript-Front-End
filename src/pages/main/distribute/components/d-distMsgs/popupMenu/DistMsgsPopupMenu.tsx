/* eslint-disable @typescript-eslint/no-floating-promises */
import { ViewShow } from '@styled-icons/zondicons/ViewShow';
import { useQueryClient } from '@tanstack/react-query';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import NDist from '../../../namespace/NDist';

interface IDistMsgsPopupMenu {
   distributerItem: NDist.IDistMsgs;
   handleItemClick: (item: NDist.IDistMsgs, itemType: NDist.Carousel.ISlide2NameOptions) => void;
}

export default function DistMsgsPopupMenu(props: IDistMsgsPopupMenu): JSX.Element {
   const { distributerItem, handleItemClick } = props;
   const { isDarkTheme } = useThemeContext();

   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = NDist.API.useMutation.delCalcDist({
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

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer
            onClick={() => handleItemClick(distributerItem, 'distributer')}
            isDarkTheme={isDarkTheme}
         >
            <PMItemTitle>View Details</PMItemTitle>
            <ViewShow />
         </PMItemContainer>
         <PMItemContainer onClick={() => handleDelete()} isDarkTheme={isDarkTheme} dangerItem>
            <PMItemTitle>Delete This</PMItemTitle>
            <DocumentDelete />
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
