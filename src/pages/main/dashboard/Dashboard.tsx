import {
   CardContentWrapper,
   CardHolder,
   CardHolderRow,
   ExtraSmallCardSquareHolder,
   SmallCardSquareHolder,
} from '../../../global/components/lib/dashboardCards/Style';
import Loader from '../../../global/components/lib/loader/Loader';
import { ScrnResponsiveFlexWrap } from '../../../global/components/lib/positionModifiers/responsiveFlexWrap/ScrnResponsiveFlexWrap';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import NDist from '../distribute/namespace/NDist';
import ExpenseByCategory from './components/expenseByCategory/ExpenseByCategory';
import SpendingsAnalytics from './components/spendingsAnalytics/SpendingsAnalytics';
import TargetSavings from './components/targetSavings/TargetSavings';
import TotalExpense from './components/totalExpense/TotalExpense';
import TotalIncome from './components/totalIncome/TotalIncome';
import TotalSavings from './components/totalSavings/TotalSavings';
import TrackedSavings from './components/trackedSavings/TrackedSavings';

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { isLoading, isPaused } = NDist.API.useQuery.getCalcDist();
   if (isLoading && !isPaused && !isPortableDevice) return <Loader isDisplayed />;

   return (
      <ScrnResponsiveFlexWrap padding={'0.25em'}>
         {/**/}
         <CardHolder>
            <CardHolderRow>
               <CardContentWrapper isDarkTheme={isDarkTheme}>
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
               <CardContentWrapper isDarkTheme={isDarkTheme}>
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
            <CardContentWrapper isDarkTheme={isDarkTheme} height={'fit-content'}>
               <TargetSavings />
            </CardContentWrapper>
         </CardHolder>
         {/**/}
      </ScrnResponsiveFlexWrap>
   );
}
