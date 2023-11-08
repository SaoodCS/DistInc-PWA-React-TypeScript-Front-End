/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../global/components/lib/popupMenu/Style';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import type { ICalcSchema } from '../calculation/CalculateDist';
import DistributerClass from '../distributerForm/class/DistributerClass';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';

interface IAnalyticsPopupMenu {
   type: 'analyticsItem';
   analyticsItem: ICalcSchema['analytics'][0];
}

export default function AnalyticsPopupMenu(props: IAnalyticsPopupMenu): JSX.Element {
   const { analyticsItem } = props;
   const { isDarkTheme } = useThemeContext();

   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = DistributerClass.useMutation.delCalcDist({
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

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer onClick={() => handleDelete()} isDarkTheme={isDarkTheme} dangerItem>
            <PMItemTitle>Delete This</PMItemTitle>
            <DocumentDelete />
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
