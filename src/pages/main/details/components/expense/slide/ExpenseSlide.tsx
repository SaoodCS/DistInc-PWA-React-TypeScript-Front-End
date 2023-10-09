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
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import JSXHelper from '../../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import Color from '../../../../../../global/theme/colors';
import ExpensesClass, { IExpenseFormInputs } from '../class/ExpensesClass';
import ExpenseForm from '../form/ExpenseForm';

export default function ExpenseSlide(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);
   const identifier = 'dahsboardCarousel.expensesSlide';
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(identifier);
   const { handleCloseBottomPanel } = useContext(BottomPanelContext);
   const { isLoading, error, isPaused, refetch, data } = ExpensesClass.useQuery.getExpenses({
      onSettled: () => {
         handleCloseBottomPanel();
      },
   });
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

   return (
      <PullToRefresh onRefresh={refetch} isDarkTheme={isDarkTheme}>
         <FlatListWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
            {!!data &&
               Object.keys(data).map((id) => (
                  <FlatListItem
                     isDarkTheme={isDarkTheme}
                     key={id}
                     onClick={() => handleClick(data[id])}
                  >
                     <FirstRowWrapper>
                        <ItemTitleWrapper>
                           <ItemTitle>{data[id].expenseName}</ItemTitle>
                        </ItemTitleWrapper>
                        <ItemValue>£{data[id].expenseValue}</ItemValue>
                     </FirstRowWrapper>
                     <SecondRowTagsWrapper>
                        <Tag bgColor={tagColor('expense')}>Expense</Tag>
                        <Tag bgColor={tagColor('type')}>{data[id].expenseType}</Tag>
                        <Tag bgColor={tagColor('paused')}>{data[id].paused}</Tag>
                        <Tag bgColor={tagColor('paymentType')}>{data[id].paymentType}</Tag>
                     </SecondRowTagsWrapper>
                  </FlatListItem>
               ))}
         </FlatListWrapper>
      </PullToRefresh>
   );
}
