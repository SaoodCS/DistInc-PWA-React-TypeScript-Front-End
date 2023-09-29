import { DotsHorizontalRounded } from '@styled-icons/boxicons-regular/DotsHorizontalRounded';
import { useEffect } from 'react';
import styled from 'styled-components';
import Asterisks from '../../../../../global/components/lib/asterisks/Asterisks';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';
import { ItemContainer, SettingsWrapper } from '../../style/Style';

const UserDetails = styled.div`
   font-size: 0.75em;
   color: #9f9f9f;
`;

export const LabelAndDetailsWrapper = styled.div<{ row?: boolean }>`
   display: flex;
   justify-content: center;
   flex-direction: ${({ row }) => (row ? 'row' : 'column')};
   align-items: ${({ row }) => row && 'center'};
`;

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
         <SettingsWrapper
            isDarkTheme={isDarkTheme}
            style={scrollSaverStyle}
            ref={containerRef}
            onScroll={handleOnScroll}
         >
            <ItemContainer isDarkTheme={isDarkTheme} spaceRow>
               <LabelAndDetailsWrapper>
                  Email
                  <UserDetails>saood.aslam@hotmail.com</UserDetails>
               </LabelAndDetailsWrapper>
               <HorizontalMenuDots />
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme} spaceRow>
               <LabelAndDetailsWrapper>
                  Password
                  <UserDetails>
                     <Asterisks size={'0.3em'} />
                  </UserDetails>
               </LabelAndDetailsWrapper>
               <HorizontalMenuDots />
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme} spaceRow>
               <TextColourizer color="gold">Reset Account</TextColourizer>
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme}>
               <TextColourizer color="red">Delete Account</TextColourizer>
            </ItemContainer>
         </SettingsWrapper>
      </>
   );
}
