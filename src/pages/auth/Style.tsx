import styled from 'styled-components';
import Color from '../../global/styles/colors';

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
            ? Color.darkThm.accent
            : Color.lightThm.accent
         : Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.25)};
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
               ? Color.darkThm.accent
               : Color.lightThm.accent
            : Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.25)};
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
   justify-content: center;
   height: 100dvh;
`;


export const Container = styled.div`
   overflow: hidden;
   position: relative;
   display: flex;
   scroll-snap-type: x mandatory;
   scrollbar-width: none;
   -ms-overflow-style: none;
   overflow-x: scroll;

   &::-webkit-scrollbar {
      display: none;
   }
`;

export const Slide = styled.div<{ height: string }>`
   min-width: 100%;
   flex: 1;
   scroll-snap-align: start;
   display: flex;
   justify-content: center;
   overflow: hidden;
   overflow-y: scroll;
   height: ${({ height }) => height};
   ::-webkit-scrollbar {
      display: none;
   }
`;
