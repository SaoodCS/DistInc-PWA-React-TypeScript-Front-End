import { Pencil } from '@styled-icons/bootstrap/Pencil';
import { DotsHorizontalRounded } from '@styled-icons/boxicons-regular/DotsHorizontalRounded';
import { AddAPhoto } from '@styled-icons/material-outlined/AddAPhoto';
import { useEffect } from 'react';
import styled from 'styled-components';
import { AccountCircle } from 'styled-icons/material';
import { PlaceholderCircle } from '../../../../../global/components/lib/fetch/placeholders/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import Color from '../../../../../global/theme/colors';
import NSettings from '../../namespace/NSettings';
import { ItemContainer, SettingsWrapper } from '../../style/Style';

const UserDetails = styled.div`
   font-size: 0.75em;
   color: #b6b6b6;
`;

const Label = styled.div`
   padding-bottom: 0.2em;
   padding-top: 0.2em;
`;

const LabelAndDetailsWrapper = styled.div`
   display: flex;
   flex-direction: column;
   height: 90%;
   justify-content: center;
   align-items: space-between;
`;

const ProfilePicContainer = styled.div`
   //border: 1px solid red;
   height: 35%;
   margin-bottom: 1em;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 1em;
   background-color: ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)};
   position: relative;
`;

const AccountWrapper = styled.div`
   width: 100%;
   overflow-x: hidden;
   padding: 1em;
`;

const HorizontalDots = styled(DotsHorizontalRounded)`
   height: 1em;
   padding-right: 1em;
   font-size: 1.25em;
`;

const ProfilePhotoPlaceholder = styled(AddAPhoto)`
   height: 70%;
   color: ${Color.setRgbOpacity(Color.darkThm.bg, 0.7)};
   padding: 1em;
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
      <AccountWrapper ref={containerRef} onScroll={handleOnScroll} style={scrollSaverStyle}>
         <ProfilePicContainer>
            <ProfilePhotoPlaceholder />
         </ProfilePicContainer>
         <SettingsWrapper isDarkTheme={isDarkTheme} style={{ margin: 0 }}>
            <ItemContainer isDarkTheme={isDarkTheme} style={{ justifyContent: 'space-between' }}>
               <LabelAndDetailsWrapper>
                  <Label>Email</Label>
                  <UserDetails>saood.aslam@hotmail.com</UserDetails>
               </LabelAndDetailsWrapper>
               <HorizontalDots />
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme} style={{ justifyContent: 'space-between' }}>
               <LabelAndDetailsWrapper>
                  <Label>Password</Label>
                  <UserDetails>***************</UserDetails>
               </LabelAndDetailsWrapper>
               <HorizontalDots />
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme} style={{ justifyContent: 'space-between' }}>
               <TextColourizer color="gold">Reset Account</TextColourizer>
            </ItemContainer>
            <ItemContainer isDarkTheme={isDarkTheme}>
               <TextColourizer color="red">Delete Account</TextColourizer>
            </ItemContainer>
         </SettingsWrapper>
      </AccountWrapper>
   );
}
