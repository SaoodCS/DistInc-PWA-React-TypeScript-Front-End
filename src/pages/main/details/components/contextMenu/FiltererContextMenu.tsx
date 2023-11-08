import { Check } from '@styled-icons/boxicons-regular/Check';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import useURLState from '../../../../../global/hooks/useURLState';
import NDetails from '../../namespace/NDetails';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../global/components/lib/popupMenu/Style';

interface IFilterer {
   currentSlide: number;
}

export default function FiltererContextMenu(props: IFilterer): JSX.Element {
   const { currentSlide } = props;
   const { isDarkTheme } = useThemeContext();
   const filterOptions = ArrayOfObjects.getObjWithKeyValuePair(
      NDetails.slides,
      'slideNo',
      currentSlide,
   ).sortDataOptions;
   const [sortState, setSortState] = useURLState({ key: filterOptions[0].sortUrlKey });
   const [orderState, setOrderState] = useURLState({ key: filterOptions[0].orderUrlKey });

   const changeSortBy = (newSortBy: string): void => {
      setSortState(newSortBy);
   };

   const changeOrder = (newOrder: 'asc' | 'desc'): void => {
      setOrderState(newOrder);
   };

   return (
      <>
         <PMItemsListWrapper isDarkTheme={isDarkTheme}>
            <PMItemContainer isDarkTheme={isDarkTheme} isHeadingItem>
               <PMItemTitle>Sort By</PMItemTitle>
            </PMItemContainer>
            {filterOptions.map((option) => (
               <PMItemContainer
                  key={option.name}
                  onClick={() => changeSortBy(option.name)}
                  isDarkTheme={isDarkTheme}
               >
                  <PMItemTitle> {option.placeholder}</PMItemTitle>
                  <ConditionalRender condition={sortState === option.name}>
                     <Check />
                  </ConditionalRender>
               </PMItemContainer>
            ))}
            <PMItemContainer isDarkTheme={isDarkTheme} isHeadingItem>
               <PMItemTitle>Order</PMItemTitle>
            </PMItemContainer>
            <PMItemContainer onClick={() => changeOrder('asc')} isDarkTheme={isDarkTheme}>
               <PMItemTitle>Ascending</PMItemTitle>
               <ConditionalRender condition={orderState === 'asc'}>
                  <Check />
               </ConditionalRender>
            </PMItemContainer>
            <PMItemContainer onClick={() => changeOrder('desc')} isDarkTheme={isDarkTheme}>
               <PMItemTitle>Descending</PMItemTitle>
               <ConditionalRender condition={orderState === 'desc'}>
                  <Check />
               </ConditionalRender>
            </PMItemContainer>
         </PMItemsListWrapper>
      </>
   );
}
