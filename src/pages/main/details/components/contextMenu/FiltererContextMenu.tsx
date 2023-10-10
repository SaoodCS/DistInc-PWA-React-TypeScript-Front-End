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
   const { isDarkTheme } = useThemeContext();
   const [sortBy, setSortBy] = useURLState({ key: 'sortBy' });
   const [order, setOrder] = useURLState({ key: 'order' });

   const options = NDetails.slides
      .filter((slide) => slide.slideNo === currentSlide)
      .map((slide) => slide.inputNamesAndPlaceholders)[0];

   function changeSortBy(name: string): void {
      setSortBy(name);
   }

   function changeOrder(newOrder: 'asc' | 'desc'): void {
      setOrder(newOrder);
   }

   return (
      <>
         <FiltererCMOpenerWrapper>
            <TextBtn
               onClick={() => toggleMenu()}
               isDarkTheme={isDarkTheme}
               ref={buttonRef}
               isDisabled={showMenu}
            >
               <Filter height={'1.5em'} />
            </TextBtn>
         </FiltererCMOpenerWrapper>
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
               {options.map((option) => (
                  <CMItemContainer
                     key={option.name}
                     onClick={() => changeSortBy(`${option.prefix}-${option.name}`)}
                     isDarkTheme={isDarkTheme}
                  >
                     <CMItemTitle> {option.placeholder}</CMItemTitle>
                     <ConditionalRender condition={sortBy === `${option.prefix}-${option.name}`}>
                        <Check height={'1em'} />
                     </ConditionalRender>
                  </CMItemContainer>
               ))}
               <CMListHeader isDarkTheme={isDarkTheme}>Order</CMListHeader>
               <CMItemContainer onClick={() => changeOrder('asc')} isDarkTheme={isDarkTheme}>
                  <CMItemTitle>Ascending</CMItemTitle>
                  <ConditionalRender condition={order === 'asc'}>
                     <Check height={'1em'} />
                  </ConditionalRender>
               </CMItemContainer>
               <CMItemContainer onClick={() => changeOrder('desc')} isDarkTheme={isDarkTheme}>
                  <CMItemTitle>Descending</CMItemTitle>
                  <ConditionalRender condition={order === 'desc'}>
                     <Check height={'1em'} />
                  </ConditionalRender>
               </CMItemContainer>
            </CMItemsListWrapper>
         </ContextMenu>
      </>
   );
}
