import { useContext, useEffect, useState } from 'react';
import Asterisks from '../../../../../global/components/lib/asterisks/Asterisks';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   IconAndNameWrapper,
   ItemContainer,
   ItemContentWrapper,
   ItemDetails,
   MenuListWrapper,
} from '../../../../../global/components/lib/menuList/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { auth } from '../../../../../global/firebase/config/config';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';
import AccountClass, { IAccountMenuOptions } from './class/AccountClass';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { containerRef, handleOnScroll, scrollToTop, scrollSaverStyle } = useScrollSaver(
      NSettings.key.accountSlide,
   );
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelHeightDvh,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
   }, []);

   function handleClick(item: IAccountMenuOptions): void {
      setBottomPanelHeading(item.heading);
      setBottomPanelContent(item.content);
      //setBottomPanelHeightDvh(40);
      setBottomPanelZIndex(0);
      setIsBottomPanelOpen(true);
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
                     <IconAndNameWrapper isPortableDevice={isPortableDevice}>
                        <item.icon  />
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
                     <HorizontalMenuDots />
                  </ConditionalRender>
               </ItemContainer>
            ))}
         </MenuListWrapper>
      </>
   );
}
