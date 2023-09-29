import { useEffect } from 'react';
import Asterisks from '../../../../../global/components/lib/asterisks/Asterisks';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   ItemContainer,
   ItemContentWrapper,
   MenuListWrapper,
} from '../../../../../global/components/lib/menuList/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme } = useThemeContext();
   const { containerRef, handleOnScroll, scrollToTop, scrollSaverStyle } = useScrollSaver(
      NSettings.key.accountSlide,
   );

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
   }, []);

   return (
      <>
         <MenuListWrapper
            isDarkTheme={isDarkTheme}
            style={scrollSaverStyle}
            ref={containerRef}
            onScroll={handleOnScroll}
         >
            <ItemContainer isDarkTheme={isDarkTheme} spaceRow>
               <ItemContentWrapper>
                  Email
                  <TextColourizer color={'lightgrey'} fontSize="0.75em">
                     saood.aslam@hotmail.com
                  </TextColourizer>
               </ItemContentWrapper>
               <HorizontalMenuDots />
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme} spaceRow>
               <ItemContentWrapper>
                  Password
                  <TextColourizer color={'lightgrey'} fontSize="0.75em">
                     <Asterisks size={'0.3em'} />
                  </TextColourizer>
               </ItemContentWrapper>
               <HorizontalMenuDots />
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme} spaceRow>
               <TextColourizer color="gold">Reset Account</TextColourizer>
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme}>
               <TextColourizer color="red">Delete Account</TextColourizer>
            </ItemContainer>
         </MenuListWrapper>
      </>
   );
}
