/* eslint-disable @typescript-eslint/no-floating-promises */
import { ViewShow } from '@styled-icons/zondicons/ViewShow';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { StopCircle } from 'styled-icons/material';
import { RepoDeleted } from 'styled-icons/octicons';
import { DocumentDelete } from 'styled-icons/typicons';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';
import NDist from '../../../namespace/NDist';

interface ISavingsAccPopupMenu {
   savingsAccHistItem: NDist.ISavingsAccHist;
   handleItemClick: (
      item: NDist.ISavingsAccHist,
      itemType: NDist.Carousel.ISlide2NameOptions,
   ) => void;
}

export default function SavingsAccPopupMenu(props: ISavingsAccPopupMenu): JSX.Element {
   const { savingsAccHistItem, handleItemClick } = props;
   const { isDarkTheme } = useThemeContext();

   const { data: savingsAccData } = SavingsClass.useQuery.getSavingsAccounts();

   const queryClient = useQueryClient();

   const delCalcDistSavingsInFirestore = NDist.API.useMutation.delCalcDist({
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
            onClick={() => handleItemClick(savingsAccHistItem, 'savingsAccHistory')}
            isDarkTheme={isDarkTheme}
         >
            <PMItemTitle>View Details</PMItemTitle>
            <ViewShow />
         </PMItemContainer>
         <PMItemContainer
            onClick={() => handleDelete('savingsAccHistoryItem')}
            isDarkTheme={isDarkTheme}
            dangerItem
         >
            <PMItemTitle>Delete This</PMItemTitle>
            <DocumentDelete />
         </PMItemContainer>
         <PMItemContainer
            onClick={() => handleDelete('allSavingsAccIdHistory')}
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
            onClick={() => handleStopTracking()}
            isDarkTheme={isDarkTheme}
            warningItem
         >
            <PMItemTitle>Stop Tracking</PMItemTitle>
            <StopCircle />
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
