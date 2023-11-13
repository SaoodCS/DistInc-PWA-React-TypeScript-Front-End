import { useContext, useEffect } from 'react';
import Asterisks from '../../../../../global/components/lib/asterisks/Asterisks';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   IconAndNameWrapper,
   ItemContainer,
   ItemContentWrapper,
   ItemDetails,
   ItemSubElement,
   MenuListWrapper,
} from '../../../../../global/components/lib/menuList/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../global/context/widget/modal/ModalContext';
import { auth } from '../../../../../global/firebase/config/config';
import BoolHelper from '../../../../../global/helpers/dataTypes/bool/BoolHelper';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';
import type { IAccountMenuOptions } from './class/AccountClass';
import AccountClass from './class/AccountClass';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { containerRef, handleOnScroll, scrollToTop, scrollSaverStyle } = useScrollSaver(
      NSettings.key.accountSlide,
   );
   const { toggleBottomPanel, setBottomPanelContent, setBottomPanelHeading, setBottomPanelZIndex } =
      useContext(BottomPanelContext);

   const { toggleModal, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
      return () => {
         toggleBottomPanel(false);
         toggleModal(false);
      };
   }, []);

   function handleClick(item: IAccountMenuOptions): void {
      if (isPortableDevice) {
         toggleBottomPanel(true);
         setBottomPanelHeading(item.heading);
         setBottomPanelContent(item.content);
         setBottomPanelZIndex(1);
      } else {
         toggleModal(true);
         setModalHeader(item.heading);
         setModalContent(item.content);
         setModalZIndex(0);
      }
   }

   return (
      <>
         <MenuListWrapper
            isDarkTheme={isDarkTheme}
            style={scrollSaverStyle}
            ref={containerRef}
            onScroll={handleOnScroll}
         >
            {AccountClass.menuOptions.map((item, index) => (
               <ItemContainer
                  key={index}
                  isDarkTheme={isDarkTheme}
                  spaceRow={item.withMenuDots}
                  onClick={() => handleClick(item)}
                  dangerItem={item.dangerItem}
                  warningItem={item.warningItem}
               >
                  <ItemContentWrapper>
                     <IconAndNameWrapper>
                        <item.icon />
                        {item.name}
                     </IconAndNameWrapper>
                     <ConditionalRender condition={!!item.detailsContent}>
                        <ItemDetails isDarkTheme={isDarkTheme}>
                           {item.name === 'Password' && <Asterisks size={'0.4em'} amount={15} />}
                           {item.name === 'Email' && auth.currentUser?.email}
                        </ItemDetails>
                     </ConditionalRender>
                  </ItemContentWrapper>
                  <ConditionalRender condition={!!item.withMenuDots && isPortableDevice}>
                     <ItemSubElement>
                        <HorizontalMenuDots darktheme={BoolHelper.boolToStr(isDarkTheme)} />
                     </ItemSubElement>
                  </ConditionalRender>
               </ItemContainer>
            ))}
         </MenuListWrapper>
      </>
   );
}
