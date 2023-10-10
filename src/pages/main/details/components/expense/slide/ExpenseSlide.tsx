import { useContext } from 'react';
import FetchError from '../../../../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import {
   FirstRowWrapper,
   FlatListItem,
   FlatListWrapper,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../../global/components/lib/flatList/Style';
import DetailsPlaceholder from '../../../../../../global/components/lib/flatList/placeholder/Placeholder';
import PullToRefresh from '../../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import JSXHelper from '../../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../../global/hooks/useURLState';
import Color from '../../../../../../global/theme/colors';
import { NDetails } from '../../../namespace/NDetails';
import SavingsClass from '../../accounts/savings/class/Class';
import ExpensesClass, { IExpenseFormInputs } from '../class/ExpensesClass';
import ExpenseForm from '../form/ExpenseForm';

export default function ExpenseSlide(): JSX.Element {
   const [sortBy, setSortBy] = useURLState({ key: 'sortBy' });
   const [order] = useURLState({ key: 'order' });
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(
      NDetails.key.expenseSlide,
   );
   const { handleCloseBottomPanel } = useContext(BottomPanelContext);
   const { isLoading, error, isPaused, refetch, data } = ExpensesClass.useQuery.getExpenses({
      onSettled: () => {
         handleCloseBottomPanel();
      },
   });

   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();

   if (isLoading && !isPaused) {
      return <FlatListWrapper>{JSXHelper.repeatJSX(<DetailsPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   function handleClick(item: IExpenseFormInputs) {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(item.expenseName);
      setBottomPanelContent(<ExpenseForm inputValues={item} />);
      setBottomPanelZIndex(100);
   }

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         expense: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         paused: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
         paymentType: isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   function expenseTypeLabel(expenseType: string) {
      if (!expenseType.includes('Savings')) return expenseType;
      const id = expenseType.split(':')[1];
      const savingsAccount = savingsAccounts?.[id];
      return `Transfer: ${savingsAccount?.accountName}` || 'Savings Transfer';
   }

   function sortData(fetchedData: typeof data) {
      if (!fetchedData) return [];
      const dataAsArr = ObjectOfObjects.convertToArrayOfObj(fetchedData);
      if (!sortBy?.includes('expense')) return dataAsArr;
      const extractKey = sortBy.split('-')[1] as keyof (typeof dataAsArr)[0];
      const desc = order?.includes('desc');
      const sortedData = ArrayOfObjects.sort(dataAsArr, extractKey, desc);
      return sortedData;
   }

   return (
      <>
         <PullToRefresh onRefresh={refetch} isDarkTheme={isDarkTheme}>
            <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
               {!!data &&
                  sortData(data).map((item) => (
                     <FlatListItem
                        isDarkTheme={isDarkTheme}
                        key={item.id}
                        onClick={() => handleClick(item)}
                     >
                        <FirstRowWrapper>
                           <ItemTitleWrapper>
                              <ItemTitle>{item.expenseName}</ItemTitle>
                           </ItemTitleWrapper>
                           <ItemValue>{NumberHelper.asCurrencyStr(item.expenseValue)}</ItemValue>
                        </FirstRowWrapper>
                        <SecondRowTagsWrapper>
                           <Tag bgColor={tagColor('expense')}>Expense</Tag>
                           <Tag bgColor={tagColor('type')}>
                              {expenseTypeLabel(item.expenseType)}
                           </Tag>
                           <Tag bgColor={tagColor('paymentType')}>{item.paymentType}</Tag>
                           <ConditionalRender condition={BoolHelper.convert(item.paused)}>
                              <Tag bgColor={tagColor('paused')}>Paused</Tag>
                           </ConditionalRender>
                        </SecondRowTagsWrapper>
                     </FlatListItem>
                  ))}
            </FlatListWrapper>
         </PullToRefresh>
      </>
   );
}
