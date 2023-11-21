import { Fragment, useContext } from 'react';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { FlatListWrapper } from '../../../../../global/components/lib/flatList/Style';
import FlatListPlaceholder from '../../../../../global/components/lib/flatList/placeholder/FlatListPlaceholder';
import Loader from '../../../../../global/components/lib/loader/Loader';
import PullToRefresh from '../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import JSXHelper from '../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../global/hooks/useURLState';
import { NDetails } from '../../namespace/NDetails';
import type { ICurrentAccountFirebase, ICurrentFormInputs } from './current/class/Class';
import CurrentClass from './current/class/Class';
import CurrentAccountListItem from './current/listItem/CurrentAccountListItem';
import type { ISavingsAccountFirebase, ISavingsFormInputs } from './savings/class/Class';
import SavingsClass from './savings/class/Class';
import SavingsAccountListItem from './savings/listItem/SavingsAccountListItem';

export default function AccountsSlide(): JSX.Element {
   const [sortAccountBy] = useURLState({ key: NDetails.keys.searchParams.sort.accounts });
   const [orderAccount] = useURLState({ key: NDetails.keys.searchParams.order.accounts });
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(
      NDetails.keys.localStorage.accountsSlide,
   );
   const { toggleBottomPanel } = useContext(BottomPanelContext);
   const { toggleModal } = useContext(ModalContext);
   const {
      isLoading: isLoadingSavings,
      error: errorSavings,
      isPaused: isPausedSavings,
      refetch: refetchSavings,
      data: savingsData,
   } = SavingsClass.useQuery.getSavingsAccounts({
      onSettled: () => {
         toggleBottomPanel(false);
      },
   });

   const {
      isLoading: isLoadingCurrent,
      error: errorCurrent,
      isPaused: isPausedCurrent,
      refetch: refetchCurrent,
      data: currentData,
   } = CurrentClass.useQuery.getCurrentAccounts({
      onSettled: () => {
         isPortableDevice ? toggleBottomPanel(false) : toggleModal(false);
      },
   });

   if ((isLoadingSavings && !isPausedSavings) || (isLoadingCurrent && !isPausedCurrent)) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <FlatListWrapper>{JSXHelper.repeatJSX(<FlatListPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPausedSavings || isPausedCurrent) return <OfflineFetch />;
   if (errorSavings || errorCurrent) return <FetchError />;

   async function handleOnRefresh(): Promise<void> {
      await Promise.all([refetchSavings(), refetchCurrent()]);
   }

   function sortData(): (ISavingsFormInputs | ICurrentFormInputs)[] {
      let savingsWithFilterProps: ISavingsAccountFirebase = {};
      let currentWithFilterProps: ICurrentAccountFirebase = {};
      let savingsAndCurrentConcat: {
         [x: string]: ICurrentFormInputs | ISavingsFormInputs;
      } = {};
      if (MiscHelper.isNotFalsyOrEmpty(savingsData)) {
         savingsWithFilterProps = ObjectOfObjects.addPropsToAll(savingsData, {
            accountType: 'Savings',
            category: 'Savings',
         });
      }
      if (MiscHelper.isNotFalsyOrEmpty(currentData)) {
         currentWithFilterProps = ObjectOfObjects.addPropsToAll(currentData, {
            category: 'Current',
         });
      }
      if (MiscHelper.isNotFalsyOrEmpty(savingsWithFilterProps)) {
         savingsAndCurrentConcat = { ...savingsWithFilterProps };
      }
      if (MiscHelper.isNotFalsyOrEmpty(currentWithFilterProps)) {
         savingsAndCurrentConcat = { ...savingsAndCurrentConcat, ...currentWithFilterProps };
      }
      const dataAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAndCurrentConcat);
      if (!sortAccountBy) return dataAsArr;
      const desc = orderAccount?.includes('desc');
      const sortedData = ArrayOfObjects.sort(
         dataAsArr,
         sortAccountBy as keyof (typeof dataAsArr)[0],
         desc,
      );
      return sortedData;
   }

   return (
      <PullToRefresh onRefresh={handleOnRefresh} isDarkTheme={isDarkTheme}>
         <FlatListWrapper
            ref={containerRef}
            onScroll={handleOnScroll}
            style={{ ...scrollSaverStyle, height: '100%' }}
         >
            {sortData().map((item) => (
               <Fragment key={item.id}>
                  {CurrentClass.isType.currentItem(item) && <CurrentAccountListItem item={item} />}
                  {SavingsClass.isType.savingsItem(item) && <SavingsAccountListItem item={item} />}
               </Fragment>
            ))}
         </FlatListWrapper>
      </PullToRefresh>
   );
}
