import { Fragment, useContext } from 'react';
import FetchError from '../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import {
   FirstRowWrapper,
   FlatListItem,
   FlatListWrapper,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../global/components/lib/flatList/Style';
import DetailsPlaceholder from '../../../../../global/components/lib/flatList/placeholder/Placeholder';
import PullToRefresh from '../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import JSXHelper from '../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../global/hooks/useURLState';
import Color from '../../../../../global/theme/colors';
import { NDetails } from '../../namespace/NDetails';
import CurrentClass, { ICurrentFormInputs } from './current/class/Class';
import CurrentForm from './current/form/CurrentForm';
import SavingsClass, { ISavingsFormInputs } from './savings/class/Class';
import SavingsForm from './savings/form/SavingsForm';

export default function AccountsSlide(): JSX.Element {
   const [sortBy] = useURLState({ key: 'sortBy' });
   const [order] = useURLState({ key: 'order' });
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
      data: savingsData,
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
      data: currentData,
   } = CurrentClass.useQuery.getCurrentAccounts({
      onSettled: () => {
         handleCloseBottomPanel();
      },
   });

   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   if ((isLoadingSavings && !isPausedSavings) || (isLoadingCurrent && !isPausedCurrent)) {
      return <FlatListWrapper>{JSXHelper.repeatJSX(<DetailsPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPausedSavings || isPausedCurrent) return <OfflineFetch />;
   if (errorSavings || errorCurrent) return <FetchError />;

   async function handleOnRefresh() {
      await Promise.all([refetchSavings(), refetchCurrent()]);
   }

   function sortData() {
      if (!savingsData || !currentData) return [];
      const savingsWithFilterProps = ObjectOfObjects.addPropsToAll(savingsData, {
         accountType: 'Savings',
         category: 'Savings',
      });
      const currentWithFilterProps = ObjectOfObjects.addPropsToAll(currentData, {
         category: 'Current',
      });
      const savingsAndCurrentConcat = { ...savingsWithFilterProps, ...currentWithFilterProps };
      const dataAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAndCurrentConcat);
      if (!sortBy?.includes('account')) return dataAsArr;
      const extractKey = sortBy.split('-')[1] as keyof (typeof dataAsArr)[0];
      const desc = order?.includes('desc');
      const sortedData = ArrayOfObjects.sort(dataAsArr, extractKey, desc);
      return sortedData;
   }

   function tagColor(tag: string) {
      const mapper: { [key: string]: string } = {
         account: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         cushion: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
         transfer: isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
         target: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   function leftoversTag(transferLeftoversId: string) {
      const savingsAccount = savingsData?.[transferLeftoversId];
      if (!savingsAccount) return;
      return savingsAccount.accountName;
   }

   function handleClick(item: ISavingsFormInputs | ICurrentFormInputs) {
      const isSavings = SavingsClass.isType.savingsItem(item);
      setBottomPanelHeading(item.accountName);
      setBottomPanelContent(
         isSavings ? <SavingsForm inputValues={item} /> : <CurrentForm inputValues={item} />,
      );
      setBottomPanelZIndex(100);
      setIsBottomPanelOpen(true);
   }

   return (
      <>
         <PullToRefresh onRefresh={handleOnRefresh} isDarkTheme={isDarkTheme}>
            <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
               {sortData().map((item) => (
                  <Fragment key={item.id}>
                     {CurrentClass.isType.currentItem(item) && (
                        <FlatListItem
                           key={item.id}
                           isDarkTheme={isDarkTheme}
                           onClick={() => handleClick(item)}
                        >
                           <FirstRowWrapper>
                              <ItemTitleWrapper>
                                 <ItemTitle>{item.accountName}</ItemTitle>
                              </ItemTitleWrapper>
                           </FirstRowWrapper>
                           <SecondRowTagsWrapper>
                              <Tag bgColor={tagColor('account')}>Account</Tag>
                              <Tag bgColor={tagColor('type')}>{item.accountType}</Tag>
                              <Tag
                                 bgColor={tagColor('cushion')}
                              >{`Cushion: £${item.minCushion}`}</Tag>
                              <Tag bgColor={tagColor('transfer')}>
                                 {`Leftovers → ${leftoversTag(item.transferLeftoversTo)}`}
                              </Tag>
                           </SecondRowTagsWrapper>
                        </FlatListItem>
                     )}
                     {SavingsClass.isType.savingsItem(item) && (
                        <FlatListItem
                           key={item.id}
                           isDarkTheme={isDarkTheme}
                           onClick={() => handleClick(item)}
                        >
                           <FirstRowWrapper>
                              <ItemTitleWrapper>
                                 <ItemTitle>{item.accountName}</ItemTitle>
                              </ItemTitleWrapper>
                              <ItemValue>
                                 {!!item.currentBalance &&
                                    NumberHelper.asCurrencyStr(item.currentBalance as number)}
                              </ItemValue>
                           </FirstRowWrapper>
                           <SecondRowTagsWrapper>
                              <Tag bgColor={tagColor('account')}>Account</Tag>
                              <Tag bgColor={tagColor('type')}>Savings</Tag>
                              <ConditionalRender condition={!!item.targetToReach}>
                                 <Tag bgColor={tagColor('target')}>
                                    {`Target: £${item.targetToReach}`}
                                 </Tag>
                              </ConditionalRender>
                           </SecondRowTagsWrapper>
                        </FlatListItem>
                     )}
                  </Fragment>
               ))}
            </FlatListWrapper>
         </PullToRefresh>
      </>
   );
}
