import { useContext } from 'react';
import {
   CardContentWrapper,
   CardHolder,
   CardHolderRow,
   ExtraSmallCardSquareHolder,
   SmallCardSquareHolder,
} from '../../../global/components/lib/dashboardCards/Style';
import Loader from '../../../global/components/lib/loader/fullScreen/Loader';
import { ScrnResponsiveFlexWrap } from '../../../global/components/lib/positionModifiers/responsiveFlexWrap/ScrnResponsiveFlexWrap';
import PullToRefresh from '../../../global/components/lib/pullToRefresh/PullToRefresh';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import Device from '../../../global/helpers/pwa/deviceHelper';
import IncomeClass from '../details/components/Income/class/Class';
import SavingsClass from '../details/components/accounts/savings/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
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
   const {
      setHorizontalPos,
      setToastMessage,
      setToastZIndex,
      setVerticalPos,
      setWidth,
      toggleToast,
   } = useContext(ToastContext);

   const {
      isLoading: calcDistLoading,
      isPaused: calcDistPaused,
      refetch: refetchCalcDist,
   } = NDist.API.useQuery.getCalcDist();

   const {
      isLoading: expenseLoading,
      isPaused: expensePaused,
      refetch: refetchExpense,
   } = ExpensesClass.useQuery.getExpenses();

   const {
      isLoading: savingsLoading,
      isPaused: savingsPaused,
      refetch: refetchSavings,
   } = SavingsClass.useQuery.getSavingsAccounts();

   const {
      isLoading: incomeLoading,
      isPaused: incomePaused,
      refetch: refetchIncome,
   } = IncomeClass.useQuery.getIncomes();

   const areLoading = calcDistLoading || expenseLoading || savingsLoading || incomeLoading;
   const arePaused = calcDistPaused || expensePaused || savingsPaused || incomePaused;

   if (areLoading && !arePaused && !isPortableDevice) return <Loader isDisplayed />;

   async function handleOnRefresh(): Promise<void> {
      if (!Device.isOnline()) {
         setToastMessage('No network connection.');
         setWidth('auto');
         setVerticalPos('bottom');
         setHorizontalPos('center');
         setToastZIndex(1);
         toggleToast();
         return;
      }
      await Promise.all([refetchCalcDist(), refetchExpense(), refetchSavings(), refetchIncome()]);
   }

   return (
      <PullToRefresh onRefresh={handleOnRefresh} isDarkTheme={isDarkTheme}>
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
               <CardContentWrapper
                  isDarkTheme={isDarkTheme}
                  height={'fit-content'}
                  minHeight="10em"
               >
                  <TargetSavings />
               </CardContentWrapper>
            </CardHolder>
            {/**/}
         </ScrnResponsiveFlexWrap>
      </PullToRefresh>
   );
}
