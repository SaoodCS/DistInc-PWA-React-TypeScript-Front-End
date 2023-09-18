import styled, { keyframes } from 'styled-components';
import Color from '../../global/styles/colors';

export const ScrollNavigatorBtn = styled.div<{ isDarkTheme: boolean; isActive: boolean }>`
   width: 50%;
   cursor: pointer;
   background: none;
   border: none;
   user-select: none;
   text-decoration: none;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   text-align: center;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
   border: ${({ isActive, isDarkTheme }) =>
      isActive
         ? isDarkTheme
            ? `2px solid ${Color.darkThm.accent}`
            : `2px solid ${Color.lightThm.accent}`
         : null};
   border-radius: 0.7em;
`;

export const ScrollNavigatorContainer = styled.div`
   //border: 1px solid black;
   border: 1px solid ${Color.lightThm.border};
   width: 20em;
   height: 3em;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 0.7em;
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
   height:100dvh;
`;

export const InputLabel = styled.div`
   font-size: 1em;
   padding-bottom: 0.5em;
`;

export const TextInput = styled.input`
   all: unset;
   border: 1px solid black;
   font-size: 1em;
   padding: 0.5em;
   margin-bottom: 1em;
   border-radius: 0.7em;
   border: 1px solid ${Color.lightThm.border};
   &:focus,
   &:active {
      border: 2px solid ${Color.lightThm.accent};
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
