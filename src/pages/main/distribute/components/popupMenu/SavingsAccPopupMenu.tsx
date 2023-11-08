/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { StopCircle } from 'styled-icons/material';
import { RepoDeleted } from 'styled-icons/octicons';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../global/components/lib/popupMenu/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import type { ICalcSchema } from '../calculation/CalculateDist';
import DistributerClass from '../distributerForm/class/DistributerClass';

interface ISavingsAccPopupMenu {
   savingsAccHistItem: ICalcSchema['savingsAccHistory'][0];
}

export default function SavingsAccPopupMenu(props: ISavingsAccPopupMenu): JSX.Element {
   const { savingsAccHistItem } = props;
   const { isDarkTheme } = useThemeContext();

   const { data: savingsAccData } = SavingsClass.useQuery.getSavingsAccounts();

   const queryClient = useQueryClient();

   const delCalcDistSavingsInFirestore = DistributerClass.useMutation.delCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });

   const setSavingAccountInFirestore = SavingsClass.useMutation.setSavingsAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
      },
   });

   async function handleDelete(
      delType: 'savingsAccHistoryItem' | 'allSavingsAccIdHistory',
   ): Promise<void> {
      if (delType === 'savingsAccHistoryItem') {
         await delCalcDistSavingsInFirestore.mutateAsync({
            type: delType,
            data: savingsAccHistItem,
         });
      } else if (delType === 'allSavingsAccIdHistory') {
         await delCalcDistSavingsInFirestore.mutateAsync({
            type: delType,
            savingsAccId: savingsAccHistItem.id,
         });
      }
   }

   async function handleStopTracking(): Promise<void> {
      const savingsAccObj = ObjectOfObjects.findObjFromUniqueVal(
         savingsAccData || {},
         savingsAccHistItem.id,
      );
      if (!savingsAccObj) return;
      await setSavingAccountInFirestore.mutateAsync({
         ...savingsAccObj,
         isTracked: 'false',
      });
   }

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer
            onClick={() => {
               // TODO: API POST Mutation to delete history savingsAccHistory associated with savingsHistItem's date called here
               handleDelete('savingsAccHistoryItem');
            }}
            isDarkTheme={isDarkTheme}
            dangerItem
         >
            <PMItemTitle>Delete This</PMItemTitle>
            <DocumentDelete />
         </PMItemContainer>
         <PMItemContainer
            onClick={() => {
               //TODO: API POST Mutation to delete all history savingsAccHistory associated with savingsHistItem's savingsAccId called here
               handleDelete('allSavingsAccIdHistory');
            }}
            isDarkTheme={isDarkTheme}
            dangerItem
         >
            <PMItemTitle>
               {`Reset History For ${ObjectOfObjects.findObjFromUniqueVal(
                  savingsAccData || {},
                  savingsAccHistItem.id,
               )?.accountName} `}
            </PMItemTitle>
            <RepoDeleted />
         </PMItemContainer>
         <PMItemContainer
            onClick={() => {
               //TODO: API POST Mutation which calls the setSavingsAcc and updates (only) the isTracked field to false
               handleStopTracking();
            }}
            isDarkTheme={isDarkTheme}
            warningItem
         >
            <PMItemTitle>Stop Tracking</PMItemTitle>
            <StopCircle />
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
