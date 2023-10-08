import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import PullToRefresh from '../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import APIHelper from '../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import JSXHelper from '../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import DetailsPlaceholder from '../../style/Placeholder';
import { FlatListWrapper } from '../style/Style';
import CurrentAccountList from './current/CurrentAccountList';
import { ICurrentFormInputs } from './current/class/Class';
import SavingsAccountList from './savings/SavingsAccountList';
import SavingsClass from './savings/class/Class';

interface ICurrentAccountFirebase {
   [id: string]: ICurrentFormInputs;
}

export function useCurrentAccounts(options: UseQueryOptions<ICurrentAccountFirebase> = {}) {
   return useQuery({
      queryKey: ['getCurrentAccounts'],
      queryFn: () =>
         APIHelper.gatewayCall<ICurrentAccountFirebase>(
            undefined,
            'GET',
            microservices.getCurrentAccount.name,
         ),
      ...options,
   });
}

export default function AccountsSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const identifier = 'dahsboardCarousel.accountsSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);
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
   } = useCurrentAccounts({
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
      refetchSavings();
      refetchCurrent();
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
