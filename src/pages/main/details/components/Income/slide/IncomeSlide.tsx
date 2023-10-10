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
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import JSXHelper from '../../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../../global/hooks/useURLState';
import Color from '../../../../../../global/theme/colors';
import { NDetails } from '../../../namespace/NDetails';
import type { IIncomeFormInputs } from '../class/Class';
import IncomeClass from '../class/Class';
import IncomeForm from '../form/IncomeForm';

export default function IncomeSlide(): JSX.Element {
   const [sortIncomeBy] = useURLState({ key: NDetails.keys.searchParams.sort.income });
   const [orderIncome] = useURLState({ key: NDetails.keys.searchParams.order.income });
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(
      NDetails.keys.localStorage.incomeSlide,
   );
   const { handleCloseBottomPanel } = useContext(BottomPanelContext);
   const { isLoading, error, isPaused, refetch, data } = IncomeClass.useQuery.getIncomes({
      onSettled: () => {
         handleCloseBottomPanel();
      },
   });
   if (isLoading && !isPaused) {
      return <FlatListWrapper>{JSXHelper.repeatJSX(<DetailsPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   function handleClick(data: IIncomeFormInputs): void {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(data.incomeName);
      setBottomPanelContent(<IncomeForm inputValues={data} />);
      setBottomPanelZIndex(100);
   }

   function tagColor(): string {
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.4);
   }

   function sortData(fetchedData: typeof data): IIncomeFormInputs[] {
      if (!fetchedData) return [];
      const dataAsArr = ObjectOfObjects.convertToArrayOfObj(fetchedData);
      if (!sortIncomeBy?.includes('income')) return dataAsArr;
      const desc = orderIncome?.includes('desc');
      const sortedData = ArrayOfObjects.sort(
         dataAsArr,
         sortIncomeBy as keyof IIncomeFormInputs,
         desc,
      );
      return sortedData;
   }

   return (
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
                           <ItemTitle>{item.incomeName}</ItemTitle>
                        </ItemTitleWrapper>
                        <ItemValue>{NumberHelper.asCurrencyStr(item.incomeValue)}</ItemValue>
                     </FirstRowWrapper>
                     <SecondRowTagsWrapper>
                        <Tag bgColor={tagColor()}>Income</Tag>
                     </SecondRowTagsWrapper>
                  </FlatListItem>
               ))}
         </FlatListWrapper>
      </PullToRefresh>
   );
}
