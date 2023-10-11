import { Check } from '@styled-icons/boxicons-regular/Check';
import { Filter } from '@styled-icons/fluentui-system-filled/Filter';
import { TextBtn } from '../../../../../global/components/lib/button/textBtn/Style';
import ContextMenu from '../../../../../global/components/lib/contextMenu/ContextMenu';
import {
   CMItemContainer,
   CMItemTitle,
   CMItemsListWrapper,
   CMListHeader,
} from '../../../../../global/components/lib/contextMenu/Style';
import useContextMenu from '../../../../../global/components/lib/contextMenu/hooks/useContextMenu';
import { TransparentOverlay } from '../../../../../global/components/lib/overlay/transparentOverlay/TransparentOverlay';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useURLState from '../../../../../global/hooks/useURLState';
import NDetails from '../../namespace/NDetails';
import { FiltererCMOpenerWrapper } from './Style';

interface IFilterer {
   currentSlide: number;
}

export default function FiltererContextMenu(props: IFilterer): JSX.Element {
   const { currentSlide } = props;
   const { showMenu, toggleMenu, buttonRef } = useContextMenu();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const filterOptions = NDetails.slides
      .filter((slide) => slide.slideNo === currentSlide)
      .map((slide) => slide.sortDataOptions)[0];

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
         <FiltererCMOpenerWrapper>
            <TextBtn
               onClick={() => toggleMenu()}
               isDarkTheme={isDarkTheme}
               ref={buttonRef}
               isDisabled={showMenu}
            >
               <Filter height={isPortableDevice ? '1.5em' : '1em'} />
            </TextBtn>
         </FiltererCMOpenerWrapper>
         <ConditionalRender condition={showMenu}>
            <TransparentOverlay />
         </ConditionalRender>
         <ContextMenu
            ref={buttonRef}
            isOpen={showMenu}
            toggleClose={() => toggleMenu()}
            btnPosition="top right"
            widthPx={200}
         >
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
                     <Check/>
                  </ConditionalRender>
               </CMItemContainer>
            </CMItemsListWrapper>
         </ContextMenu>
      </>
   );
}
