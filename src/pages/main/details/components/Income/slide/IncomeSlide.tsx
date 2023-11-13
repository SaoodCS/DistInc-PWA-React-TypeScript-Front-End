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
import JSXHelper from '../../../../../../global/helpers/dataTypes/jsx/jsxHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useScrollSaver from '../../../../../../global/hooks/useScrollSaver';
import useURLState from '../../../../../../global/hooks/useURLState';
import { NDetails } from '../../../namespace/NDetails';
import type { IIncomeFormInputs } from '../class/Class';
import IncomeClass from '../class/Class';
import IncomeForm from '../form/IncomeForm';

export default function IncomeSlide(): JSX.Element {
   const [sortIncomeBy] = useURLState({ key: NDetails.keys.searchParams.sort.income });
   const [orderIncome] = useURLState({ key: NDetails.keys.searchParams.order.income });
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { toggleBottomPanel, setBottomPanelContent, setBottomPanelHeading, setBottomPanelZIndex } =
      useContext(BottomPanelContext);
   const { containerRef, handleOnScroll, scrollSaverStyle } = useScrollSaver(
      NDetails.keys.localStorage.incomeSlide,
   );
   const { toggleModal, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);
   const { isLoading, error, isPaused, refetch, data } = IncomeClass.useQuery.getIncomes({
      onSettled: () => {
         isPortableDevice ? toggleBottomPanel(false) : toggleModal(false);
      },
   });
   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <FlatListWrapper>{JSXHelper.repeatJSX(<FlatListPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   function handleClick(data: IIncomeFormInputs): void {
      if (isPortableDevice) {
         toggleBottomPanel(true);
         setBottomPanelHeading(data.incomeName);
         setBottomPanelContent(<IncomeForm inputValues={data} />);
         setBottomPanelZIndex(100);
      } else {
         toggleModal(true);
         setModalHeader(data.incomeName);
         setModalContent(<IncomeForm inputValues={data} />);
         setModalZIndex(100);
      }
   }

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         income: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         amount: isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   function sortData(fetchedData: typeof data): IIncomeFormInputs[] {
      if (!fetchedData) return [];
      const dataAsArr = ObjectOfObjects.convertToArrayOfObj(fetchedData);
      if (!sortIncomeBy) return dataAsArr;
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
                           <ItemTitle>{item.incomeName}</ItemTitle>
                        </ItemTitleWrapper>
                        <ConditionalRender condition={isPortableDevice}>
                           <ItemValue>{NumberHelper.asCurrencyStr(item.incomeValue)}</ItemValue>
                        </ConditionalRender>
                     </FirstRowWrapper>
                     <SecondRowTagsWrapper>
                        <Tag bgColor={tagColor('income')}>Income</Tag>
                        <ConditionalRender condition={!isPortableDevice}>
                           <Tag bgColor={tagColor('amount')}>
                              Amount: {NumberHelper.asCurrencyStr(item.incomeValue)}
                           </Tag>
                        </ConditionalRender>
                     </SecondRowTagsWrapper>
                  </FlatListItem>
               ))}
         </FlatListWrapper>
      </PullToRefresh>
   );
}
