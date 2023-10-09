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
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../../global/hooks/useURLState';
import Color from '../../../../../../global/theme/colors';
import { NDetails } from '../../../namespace/NDetails';
import IncomeClass, { IIncomeFormInputs } from '../class/Class';
import IncomeForm from '../form/IncomeForm';

export default function IncomeSlide(): JSX.Element {
   const [sortBy] = useURLState('sortBy');
   const { isDarkTheme } = useThemeContext();
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(
      NDetails.key.incomeSlide,
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

   function handleClick(data: IIncomeFormInputs) {
      setIsBottomPanelOpen(true);
      setBottomPanelHeading(data.incomeName);
      setBottomPanelContent(<IncomeForm inputValues={data} />);
      setBottomPanelZIndex(100);
   }

   function tagColor(): string {
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.4);
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
                           <ItemTitle>{data[id].incomeName}</ItemTitle>
                        </ItemTitleWrapper>
                        <ItemValue>{NumberHelper.asCurrencyStr(data[id].incomeValue)}</ItemValue>
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
