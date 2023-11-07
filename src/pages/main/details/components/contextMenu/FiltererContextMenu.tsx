import { Check } from '@styled-icons/boxicons-regular/Check';
import {
   CMItemContainer,
   CMItemTitle,
   CMItemsListWrapper,
   CMListHeader,
} from '../../../../../global/components/lib/contextMenu/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import useURLState from '../../../../../global/hooks/useURLState';
import NDetails from '../../namespace/NDetails';

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
         <CMItemsListWrapper isDarkTheme={isDarkTheme}>
            <CMListHeader isTopHeader isDarkTheme={isDarkTheme}>
               Sort By
            </CMListHeader>
            {filterOptions.map((option) => (
               <CMItemContainer
                  key={option.name}
                  onClick={() => changeSortBy(option.name)}
                  isDarkTheme={isDarkTheme}
               >
                  <CMItemTitle> {option.placeholder}</CMItemTitle>
                  <ConditionalRender condition={sortState === option.name}>
                     <Check height={'1em'} />
                  </ConditionalRender>
               </CMItemContainer>
            ))}
            <CMListHeader isDarkTheme={isDarkTheme}>Order</CMListHeader>
            <CMItemContainer onClick={() => changeOrder('asc')} isDarkTheme={isDarkTheme}>
               <CMItemTitle>Ascending</CMItemTitle>
               <ConditionalRender condition={orderState === 'asc'}>
                  <Check />
               </ConditionalRender>
            </CMItemContainer>
            <CMItemContainer onClick={() => changeOrder('desc')} isDarkTheme={isDarkTheme}>
               <CMItemTitle>Descending</CMItemTitle>
               <ConditionalRender condition={orderState === 'desc'}>
                  <Check />
               </ConditionalRender>
            </CMItemContainer>
         </CMItemsListWrapper>
      </>
   );
}
