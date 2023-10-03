import styled from "styled-components";
import Color from "../../../../../global/theme/colors";

export const CMItemTitle = styled.div`
   font-size: 0.9em;
`;

export const CMItemContainer = styled.div<{isDarkTheme: boolean}>`
   padding: 0.5em;
   display: flex;
   justify-content: space-between;
   align-items: center;
   & > *:nth-child(2) {
      height: 1em;
   }
   &:hover:active {
      background-color: ${({ isDarkTheme }) =>
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.1)};
   }

`;

export const CMItemsListWrapper = styled.div<{ isDarkTheme: boolean }>`
   & > *:not(:last-child) {
      border-bottom: 1px solid
         ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   }
`;

export const DetailsCMOpenerWrapper = styled.div`
   display: flex;
   position: fixed;
   align-items: center;
   right: 0px;
   top: 0px;
   height: 10%;
   margin-right: 1em;
   & > *:first-child {
      margin: 0;
      padding: 0;
   }
`;