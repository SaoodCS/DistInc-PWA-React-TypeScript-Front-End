import styled from 'styled-components';
import CardListPlaceholder from '../../../global/components/lib/cardList/placeholder/CardListPlaceholder';
import {
   CardContentWrapper,
   CardHolder,
   CardHolderRow,
   ExtraSmallCardSquareHolder,
   SmallCardSquareHolder,
} from '../../../global/components/lib/dashboardCards/Style';
import FetchError from '../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import Loader from '../../../global/components/lib/loader/Loader';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import MyCSS from '../../../global/css/MyCSS';
import NDist from '../distribute/namespace/NDist';
import ExpenseByCategory from './components/expenseByCategory/ExpenseByCategory';
import SpendingsAnalytics from './components/spendingsAnalytics/SpendingsAnalytics';
import TotalExpense from './components/totalExpense/TotalExpense';
import TotalIncome from './components/totalIncome/TotalIncome';
import TotalSavings from './components/totalSavings/TotalSavings';
import TrackedSavings from './components/trackedSavings/TrackedSavings';

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { data: calcDistData, isLoading, isPaused, error } = NDist.API.useQuery.getCalcDist();

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <CardListPlaceholder repeatItemCount={7} />;
   }
   if (isPaused) return <OfflineFetch />;
   if (error || !calcDistData) return <FetchError />;

   return (
      <ScrnResponsiveFlexWrap padding={'0.25em'}>
         {/**/}
         <CardHolder>
            <CardHolderRow>
               <CardContentWrapper isDarkTheme>
                  <SpendingsAnalytics />
               </CardContentWrapper>
            </CardHolderRow>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <CardContentWrapper isDarkTheme={isDarkTheme}>
                     <TotalSavings />
                  </CardContentWrapper>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper isDarkTheme={isDarkTheme}>
                        <TotalIncome />
                     </CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper isDarkTheme={isDarkTheme}>
                        <TotalExpense />
                     </CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
               </SmallCardSquareHolder>
            </CardHolderRow>
         </CardHolder>
         {/**/}
         <CardHolder>
            <CardHolderRow>
               <CardContentWrapper isDarkTheme>
                  <ExpenseByCategory />
               </CardContentWrapper>
            </CardHolderRow>
            <CardHolderRow>
               <CardContentWrapper isDarkTheme={isDarkTheme}>
                  <TrackedSavings />
               </CardContentWrapper>
            </CardHolderRow>
         </CardHolder>

         {/**/}
         <CardHolder>
            <CardContentWrapper isDarkTheme={isDarkTheme}></CardContentWrapper>
         </CardHolder>
         {/**/}
         <CardHolder>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <CardContentWrapper isDarkTheme={isDarkTheme}></CardContentWrapper>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <CardContentWrapper isDarkTheme={isDarkTheme}></CardContentWrapper>
               </SmallCardSquareHolder>
            </CardHolderRow>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <CardContentWrapper isDarkTheme={isDarkTheme}></CardContentWrapper>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <CardContentWrapper isDarkTheme={isDarkTheme}></CardContentWrapper>
               </SmallCardSquareHolder>
            </CardHolderRow>
         </CardHolder>
      </ScrnResponsiveFlexWrap>
   );
}

// ----------------- STYLES -----------------

export const ScrnResponsiveFlexWrap = styled.div<{
   childrenMargin?: string;
   padding?: string;
}>`
   padding: ${({ padding }) => (padding ? padding : '0')};
   display: flex;
   flex-wrap: wrap;
   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      overflow: scroll;
      justify-content: center;
      align-items: center;
      height: 99%;
   }
`;
