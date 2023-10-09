import { Filter } from '@styled-icons/fluentui-system-filled/Filter';
import { useContext } from 'react';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import useURLState from '../../../../../global/hooks/useURLState';
import NDetails from '../../namespace/NDetails';
import { IconWrapper } from './Style';

interface IFilterer {
   currentSlide: number;
}

export default function Filterer(props: IFilterer): JSX.Element {
   const { currentSlide } = props;
   const { isDarkTheme } = useThemeContext();
   const [sortBy, setSortBy] = useURLState('sortBy');
   const options = NDetails.slides
      .filter((slide) => slide.slideNo === currentSlide)
      .map((slide) => slide.inputNamesAndPlaceholders)[0];

   function handleSortByOptionClick(option: string) {
      setSortBy(option);
      setIsBottomPanelOpen(false);
   }

   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   function handleClick() {
      setIsBottomPanelOpen(true);
      setBottomPanelZIndex(1);
      setBottomPanelHeading('Sort By');
      setBottomPanelContent(
         <div>
            {options.map((option) => (
               <div
                  onClick={() => handleSortByOptionClick(`${option.prefix}-${option.name}`)}
                  style={{ padding: '1em' }}
               >
                  {option.placeholder}
               </div>
            ))}
         </div>,
      );
   }

   return (
      <IconWrapper isDarkTheme={isDarkTheme} onClick={() => handleClick()}>
         <Filter height={'1.5em'} />
      </IconWrapper>
   );
}
