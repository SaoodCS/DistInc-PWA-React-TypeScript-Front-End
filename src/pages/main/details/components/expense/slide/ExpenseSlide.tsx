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
import FlatListPlaceholder from '../../../../../../global/components/lib/flatList/placeholder/FlatListPlaceholder';
import Loader from '../../../../../../global/components/lib/loader/Loader';
import PullToRefresh from '../../../../../../global/components/lib/pullToRefresh/PullToRefresh';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../../global/context/widget/modal/ModalContext';
import Color from '../../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import JSXHelper from '../../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../../global/hooks/useURLState';
import { NDetails } from '../../../namespace/NDetails';
import SavingsClass from '../../accounts/savings/class/Class';
import type { IExpenseFormInputs } from '../class/ExpensesClass';
import ExpensesClass from '../class/ExpensesClass';
import ExpenseForm from '../form/ExpenseForm';

export default function ExpenseSlide(): JSX.Element {
   const [sortExpenseBy] = useURLState({ key: NDetails.keys.searchParams.sort.expense });
   const [orderExpense] = useURLState({ key: NDetails.keys.searchParams.order.expense });
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader, handleCloseModal } =
      useContext(ModalContext);

   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(
      NDetails.keys.localStorage.expenseSlide,
   );
   const { handleCloseBottomPanel } = useContext(BottomPanelContext);
   const { isLoading, error, isPaused, refetch, data } = ExpensesClass.useQuery.getExpenses({
      onSettled: () => {
         isPortableDevice ? handleCloseBottomPanel() : handleCloseModal();
      },
   });

   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <FlatListWrapper>{JSXHelper.repeatJSX(<FlatListPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   function handleClick(item: IExpenseFormInputs): void {
      if (isPortableDevice) {
         setIsBottomPanelOpen(true);
         setBottomPanelHeading(item.expenseName);
         setBottomPanelContent(<ExpenseForm inputValues={item} />);
         setBottomPanelZIndex(100);
      } else {
         setModalHeader(item.expenseName);
         setModalContent(<ExpenseForm inputValues={item} />);
         setModalZIndex(100);
         setIsModalOpen(true);
      }
   }

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         expense: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         paused: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
         paymentType: isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
         amount: isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   function expenseTypeLabel(expenseType: string): string {
      if (!expenseType.includes('Savings')) return expenseType;
      const id = expenseType.split(':')[1];
      const savingsAccount = savingsAccounts?.[id];
      return `Transfer: ${savingsAccount?.accountName}` || 'Savings Transfer';
   }

   function sortData(fetchedData: typeof data): IExpenseFormInputs[] {
      if (!fetchedData) return [];
      const dataAsArr = ObjectOfObjects.convertToArrayOfObj(fetchedData);
      if (!sortExpenseBy) return dataAsArr;
      const desc = orderExpense?.includes('desc');
      const sortedData = ArrayOfObjects.sort(
         dataAsArr,
         sortExpenseBy as keyof (typeof dataAsArr)[0],
         desc,
      );
      return sortedData;
   }

   return (
      <PullToRefresh onRefresh={refetch} isDarkTheme={isDarkTheme}>
         <FlatListWrapper
            ref={containerRef}
            onScroll={handleOnScroll}
            style={{ ...scrollSaverStyle, height: '100%' }}
         >
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
                        <ConditionalRender condition={isPortableDevice}>
                           <ItemValue>{NumberHelper.asCurrencyStr(item.expenseValue)}</ItemValue>
                        </ConditionalRender>
                     </FirstRowWrapper>
                     <SecondRowTagsWrapper>
                        <Tag bgColor={tagColor('expense')}>Expense</Tag>
                        <ConditionalRender condition={!isPortableDevice}>
                           <Tag bgColor={tagColor('amount')}>
                              Amount: {NumberHelper.asCurrencyStr(item.expenseValue)}
                           </Tag>
                        </ConditionalRender>
                        <Tag bgColor={tagColor('type')}>{expenseTypeLabel(item.expenseType)}</Tag>
                        <Tag bgColor={tagColor('paymentType')}>{item.paymentType}</Tag>
                        <ConditionalRender condition={BoolHelper.strToBool(item.paused)}>
                           <Tag bgColor={tagColor('paused')}>Paused</Tag>
                        </ConditionalRender>
                     </SecondRowTagsWrapper>
                  </FlatListItem>
               ))}
         </FlatListWrapper>
      </PullToRefresh>
   );
}
