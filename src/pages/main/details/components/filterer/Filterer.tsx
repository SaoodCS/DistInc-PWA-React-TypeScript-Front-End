import { Filter } from '@styled-icons/fluentui-system-filled/Filter';
import { useState } from 'react';
import BottomPanel from '../../../../../global/components/lib/bottomPanel/BottomPanel';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useURLState from '../../../../../global/hooks/useURLState';
import NDetails from '../../namespace/NDetails';
import { IconWrapper } from './Style';



export default function Filterer(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);

   const [sortBy, setSortBy] = useURLState({ key: 'sortBy' });
   const [order, setOrder] = useURLState({ key: 'order' });

   // const options = NDetails.slides
   //    .filter((slide) => slide.slideNo === currentSlide)
   //    .map((slide) => slide.inputNamesAndPlaceholders)[0];

   function handleClick() {
      //setSortBy('oldest');
      setIsBottomPanelOpen(true);
   }

   return (
      <>
         <IconWrapper isDarkTheme={isDarkTheme} onClick={() => handleClick()}>
            <Filter height={'1.5em'} />
         </IconWrapper>
         <BottomPanel
            isOpen={isBottomPanelOpen}
            onClose={() => setIsBottomPanelOpen(false)}
            heading={'Sort & Filter'}
            height={50}
            zIndex={3}
         >
            
         </BottomPanel>
      </>
   );
}

{
   /* <div style = {{position:'fixed', border:'1px solid red', height:'85dvh',bottom:0, width:'100dvw', backgroundColor:'white'}}>

</div> */
}
