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
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent)};
   font-size: 1.5em;
   padding-left: 1em;
   padding-right: 1em;
   position: relative;
   &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: ${({ navTo }) => (navTo === 1 ? 'translateX(-100%)' : 'translateX(-30%)')};
      width: 25%;
      height: 2px;
      background-color: ${({ isActive, isDarkTheme }) =>
         isActive ? (isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent) : null};
   }
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
   padding: 1em;
   padding-bottom: 2em;
`;

export const Centerer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 100dvh;
`;

export const InputLabel = styled.div`
   font-size: 0.75em;
   color: grey;
   margin-bottom: 0.5em;
`;

export const TextInput = styled.input`
   all: unset;
   font-size: 1em;
   margin-bottom: 1.5em;
   border-bottom: 1px solid ${Color.lightThm.border};
   &:focus,
   &:active {
      border-bottom: 1px solid ${Color.lightThm.accent};
   }
   font-weight: 100;
   
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
