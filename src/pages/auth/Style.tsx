import styled, { keyframes } from 'styled-components';
import Color from '../../global/styles/colors';

export const ScrollNavigatorBtn = styled.div<{
   isDarkTheme: boolean;
   isActive: boolean;
   navTo: number;
}>`
   //width: 50%;
   cursor: pointer;
   background: none;
   border: none;
   user-select: none;
   text-decoration: none;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   //text-align: center;
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
   //border: 1px solid black;
   //border: 1px solid ${Color.lightThm.border};
   width: 100%;
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

export const InputContainer = styled.div`
   width: 100%;
   height: 3.5em;
`;

export const InputLabel = styled.div<{ focusedInput?: boolean }>`
   font-size: 0.75em;
   color: ${({ focusedInput }) => (focusedInput ? Color.lightThm.accent : 'grey')};
   // transform the label so it's 1em lower:
   transform: ${({ focusedInput }) => (focusedInput ? 'translateY(-0.5em)' : 'translateY(0.25em)')};
   // make it so that the user can still click on the input:
   pointer-events: none;
   transition: all 0.2s ease-in-out;
`;

export const TextInput = styled.input`
   all: unset;
   font-size: 1em;
   width: 100%;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   border-bottom: 1px solid ${Color.lightThm.border};
   &:focus,
   &:active {
      border-bottom: 1px solid ${Color.lightThm.accent};
   }
   font-weight: 100;
   z-index: 1;
`;

export const StyledForm = styled.form`
   padding: 1em;
   border-radius: 0.7em;
   display: flex;
   flex-direction: column;
   width: 100%;
   margin-top: 1em;
   border-radius: 0.7em;
   height: fit-content;
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
