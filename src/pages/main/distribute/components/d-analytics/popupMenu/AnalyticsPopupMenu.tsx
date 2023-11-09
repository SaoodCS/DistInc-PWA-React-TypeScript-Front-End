/* eslint-disable @typescript-eslint/no-floating-promises */
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

interface IAnalyticsPopupMenu {
   type: 'analyticsItem';
   analyticsItem: NDist.IAnalytics;
}

export default function AnalyticsPopupMenu(props: IAnalyticsPopupMenu): JSX.Element {
   const { analyticsItem } = props;
   const { isDarkTheme } = useThemeContext();

   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = NDist.API.useMutation.delCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });
   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'analyticsItem',
         data: analyticsItem,
      });
   }
   function handleView(): void {
      // TODO: handleView slide navigation here
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
