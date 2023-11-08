/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { AutoDelete } from 'styled-icons/material';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../global/components/lib/popupMenu/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import DistributerClass from '../distributerForm/class/DistributerClass';

interface IMonthPopupMenu {
   monthYear: string;
}

export default function MonthPopupMenu(props: IMonthPopupMenu): JSX.Element {
   const { monthYear } = props;
   const { isDarkTheme } = useThemeContext();
   const queryClient = useQueryClient();
   const delCalcDistMonthInFirestore = DistributerClass.useMutation.delCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });

   async function handleDelete(): Promise<void> {
      await delCalcDistMonthInFirestore.mutateAsync({
         type: 'month',
         monthYear, // i.e. mm/yyyy
      });
   }

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer onClick={() => handleDelete()} isDarkTheme={isDarkTheme} dangerItem>
            <PMItemTitle>{`Delete All History for Month`}</PMItemTitle>
            <AutoDelete />
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
