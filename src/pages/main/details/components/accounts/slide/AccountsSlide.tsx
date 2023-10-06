import { useQuery } from '@tanstack/react-query';
import FetchError from '../../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import {
   PlaceholderCircle,
   PlaceholderLine,
   PlaceholderRect,
} from '../../../../../../global/components/lib/fetch/placeholders/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
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

interface ISavingsAccountFirebase {
   [id: string]: {
      targetToReach: number;
      accountName: string;
      currentBalance: number;
      id: string | number;
   };
}

export default function AccountsSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'dahsboardCarousel.accountsSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);

   const { isLoading, error, data, isPaused, refetch } = useQuery(['getSavingsAccounts'], () =>
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
         {data &&
            Object.keys(data).map((id) => {
               return (
                  <FlatListItem key={id} isDarkTheme={isDarkTheme}>
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
