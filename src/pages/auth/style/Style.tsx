import type { CSSProperties } from 'styled-components';
import styled from 'styled-components';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import Clickables from '../../../global/helpers/styledComponents/clickables';
import Color from '../../../global/theme/colors';

export const HeaderContainer = styled.div<{ isDarkTheme: boolean }>`
   width: 100%;
   height: 40%;
   display: flex;
   flex-direction: column;
   justify-content: end;
   align-items: center;
   border-bottom-left-radius: 20px;
   border-bottom-right-radius: 20px;
   margin-bottom: 1em;
   box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.setRgbOpacity(Color.lightThm.inactive, 0.8) : Color.darkThm.inactive};
   backdrop-filter: blur(5px);
`;

export const ScrollNavigatorBtn = styled.div<{
   isDarkTheme: boolean;
   isActive: boolean;
   navTo: number;
}>`
   ${Clickables.removeDefaultEffects};
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   color: ${({ isDarkTheme, isActive }) =>
      isActive
         ? isDarkTheme
            ? Color.darkThm.inactive
            : Color.lightThm.inactive
         : Color.setRgbOpacity(
              isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive,
              0.3,
           )};
   font-size: 1.5em;
   padding-left: 1em;
   padding-right: 1em;
   position: relative;
   &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: ${({ navTo }) => (navTo === 1 ? 'translateX(-100%)' : 'translateX(-10%)')};
      width: 25%;
      height: 2px;
      background-color: ${({ isDarkTheme, isActive }) =>
         isActive
            ? isDarkTheme
               ? Color.darkThm.inactive
               : Color.lightThm.inactive
            : Color.setRgbOpacity(
                 isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive,
                 0.3,
              )};
   }
   transition: all 0.1s ease-in-out;
`;

export const ScrollNavigatorContainer = styled.div`
   width: 22em;
   padding-bottom: 1em;
   height: 3em;
   display: flex;
   align-items: center;
   justify-content: space-between;
`;

export const LogoContainer = styled.div`
   margin: 1em;
   margin-bottom: 2em;
`;

export const Centerer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   height: 100dvh;
`;

export const ForgottenPwdBtn = styled(TextBtn)`
   display: flex;
   justify-content: center;
   padding-top: 2.25em;
`;

export const ContactFooterWrapper = styled.div`
   padding-top: 1em;
   display: flex;
   flex-direction: column;
   text-align: center;
   @media (min-height: 750px) {
      padding-top: 2.5em;
   }
`;

export const ContactFooterTitle = styled.div<{ isDarkTheme: boolean }>`
   padding-bottom: 1em;
   color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.75)};
   font-size: 0.75em;
`;

export const ContactIconsWrapper = styled.div``;

export function contactIconStyle(isDarkTheme: boolean): CSSProperties {
   return {
      height: '2em',
      padding: '0.25em',
      color: Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.9),
      cursor: 'pointer',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      background: 'none',
      border: 'none',
      userSelect: 'none',
      textDecoration: 'none',
   };
}
