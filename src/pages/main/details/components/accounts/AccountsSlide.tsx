import { useContext } from 'react';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { FlatListWrapper } from '../../../../../global/components/lib/flatList/Style';
import DetailsPlaceholder from '../../../../../global/components/lib/flatList/placeholder/Placeholder';
import PullToRefresh from '../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import JSXHelper from '../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import { NDetails } from '../../namespace/NDetails';
import CurrentClass from './current/class/Class';
import CurrentAccountList from './current/flatList/CurrentAccountList';
import SavingsClass from './savings/class/Class';
import SavingsAccountList from './savings/flatList/SavingsAccountList';

export default function AccountsSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(
      NDetails.key.accountsSlide,
   );
   const { handleCloseBottomPanel } = useContext(BottomPanelContext);
   const {
      isLoading: isLoadingSavings,
      error: errorSavings,
      isPaused: isPausedSavings,
      refetch: refetchSavings,
   } = SavingsClass.useQuery.getSavingsAccounts({
      onSettled: () => {
         handleCloseBottomPanel();
      },
   });

   const {
      isLoading: isLoadingCurrent,
      error: errorCurrent,
      isPaused: isPausedCurrent,
      refetch: refetchCurrent,
   } = CurrentClass.useQuery.getCurrentAccounts({
      onSettled: () => {
         handleCloseBottomPanel();
      },
   });

   if ((isLoadingSavings && !isPausedSavings) || (isLoadingCurrent && !isPausedCurrent)) {
      return <FlatListWrapper>{JSXHelper.repeatJSX(<DetailsPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPausedSavings || isPausedCurrent) return <OfflineFetch />;
   if (errorSavings || errorCurrent) return <FetchError />;

   async function handleOnRefresh() {
      await Promise.all([refetchSavings(), refetchCurrent()]);
   }

   return (
      <>
         <PullToRefresh onRefresh={handleOnRefresh} isDarkTheme={isDarkTheme}>
            <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
               <SavingsAccountList />
               <CurrentAccountList />
            </FlatListWrapper>
         </PullToRefresh>
      </>
   );
}
