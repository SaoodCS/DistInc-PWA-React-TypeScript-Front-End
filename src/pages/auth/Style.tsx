import styled from 'styled-components';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import Color from '../../global/styles/colors';

export const HeaderContainer = styled.div`
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
   background-color: ${Color.darkThm.inactive};
`;

export const ScrollNavigatorBtn = styled.div<{
   isDarkTheme: boolean;
   isActive: boolean;
   navTo: number;
}>`
   cursor: pointer;
   background: none;
   border: none;
   user-select: none;
   text-decoration: none;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   color: ${({ isDarkTheme, isActive }) =>
      isActive
         ? isDarkTheme
            ? Color.lightThm.inactive
            : Color.lightThm.inactive
         : Color.setRgbOpacity(
              isDarkTheme ? Color.lightThm.inactive : Color.lightThm.inactive,
              0.25,
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
               ? 'white'
               : 'white'
            : Color.setRgbOpacity(
                 isDarkTheme ? Color.lightThm.inactive : Color.lightThm.inactive,
                 0.25,
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
   padding-top: 2.5em;
   display: flex;
   flex-direction: column;
   text-align: center;
`;


export const ContactFooterTitle = styled.div`
   padding-bottom: 1em;
   color: grey;
   font-size: 0.75em;
`;

export const ContactIconsWrapper = styled.div``;

export const contactIconStyle = {
   height: '2em',
   padding: '0.25em',
   color: Color.darkThm.inactive,
}