import { useContext, useEffect } from 'react';
import Asterisks from '../../../../../global/components/lib/asterisks/Asterisks';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   ItemContainer,
   ItemContentWrapper,
   MenuListWrapper,
} from '../../../../../global/components/lib/menuList/Style';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { auth } from '../../../../../global/firebase/config/config';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';
import ChangeEmailForm from './changeEmailForm/ChangeEmailForm';
import ChangePwdForm from './changePwdForm/ChangePwdForm';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme } = useThemeContext();
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

   function handleClick(name: string) {
      setBottomPanelHeading(`Change ${name}`);
      setBottomPanelHeightDvh(80);
      setBottomPanelContent(name === 'Email' ? <ChangeEmailForm /> : <ChangePwdForm />);
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
            <ItemContainer isDarkTheme={isDarkTheme} spaceRow onClick={() => handleClick('Email')}>
               <ItemContentWrapper>
                  Email
                  <TextColourizer color={'lightgrey'} fontSize="0.75em">
                     {auth.currentUser?.email}
                  </TextColourizer>
               </ItemContentWrapper>
               <HorizontalMenuDots />
            </ItemContainer>
            <ItemContainer
               isDarkTheme={isDarkTheme}
               spaceRow
               onClick={() => handleClick('Password')}
            >
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
