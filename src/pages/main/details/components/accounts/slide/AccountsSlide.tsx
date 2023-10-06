import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import FetchError from '../../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import {
   PlaceholderCircle,
   PlaceholderLine,
   PlaceholderRect,
} from '../../../../../../global/components/lib/fetch/placeholders/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import {
   FirstRowWrapper,
   FlatListItem,
   FlatListWrapper,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../style/Style';
import { ISavingsFormInputs } from '../form/Savings/Class';
import SavingsForm from '../form/Savings/SavingsForm';

interface ISavingsAccountFirebase {
   [id: string]: ISavingsFormInputs;
}

export default function AccountsSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'dahsboardCarousel.accountsSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { isLoading, error, data, isPaused, isFetching } = useQuery(['getSavingsAccounts'], () =>
      APIHelper.gatewayCall<ISavingsAccountFirebase>(
         undefined,
         'GET',
         microservices.getSavingsAccount.name,
      ),
   );

   if (isLoading && !isPaused) {
      return (
         <>
            <PlaceholderCircle isDarkTheme={isDarkTheme} size="50px" />
            <PlaceholderRect isDarkTheme={isDarkTheme} height="50px" width="50px" />
            <PlaceholderLine isDarkTheme={isDarkTheme} />
         </>
      );
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   function handleClick(data: ISavingsFormInputs) {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(data.accountName);
      setBottomPanelContent(<SavingsForm inputValues={data} />);
      setBottomPanelZIndex(100);
   }

   return (
      <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <FlatListItem isDarkTheme={isDarkTheme}>
            <FirstRowWrapper>
               <ItemTitleWrapper>
                  <ItemTitle>Lloyds Salary & Expenses</ItemTitle>
               </ItemTitleWrapper>
            </FirstRowWrapper>
            <SecondRowTagsWrapper>
               <Tag bgColor={'orange'}>Account</Tag>
               <Tag bgColor={'blue'}>Salary & Expenses</Tag>
               <Tag bgColor={'red'}>Min Cushion: £300.00</Tag>
            </SecondRowTagsWrapper>
         </FlatListItem>
         {!!data &&
            Object.keys(data).map((id) => {
               return (
                  <FlatListItem
                     key={id}
                     isDarkTheme={isDarkTheme}
                     onClick={() => handleClick(data[id])}
                  >
                     <FirstRowWrapper>
                        <ItemTitleWrapper>
                           <ItemTitle>{data[id].accountName}</ItemTitle>
                        </ItemTitleWrapper>
                        <ItemValue>£{data[id].currentBalance}</ItemValue>
                     </FirstRowWrapper>
                     <SecondRowTagsWrapper>
                        <Tag bgColor={'orange'}>Account</Tag>
                        <Tag bgColor={'blue'}>Savings</Tag>
                        <Tag bgColor={'red'}>{`Target: £${data[id].targetToReach}`}</Tag>
                     </SecondRowTagsWrapper>
                  </FlatListItem>
               );
            })}
      </FlatListWrapper>
   );
}
