import styled from 'styled-components';
import Clickables from '../../../../global/helpers/styledComponents/clickables';
import Color from '../../../../global/theme/colors';

export const HeadingsAndCarouselContainer = styled.div`
   height: 100%;
   display: flex;
   flex-direction: column;
   & > :nth-child(2) {
      flex: 1;
   }
`;

export const Heading = styled.button<{ isActive: boolean; isDarkTheme: boolean }>`
   ${Clickables.removeDefaultEffects};
   border-bottom: ${({ isActive, isDarkTheme }) =>
      isActive
         ? isDarkTheme
            ? `1.5px solid ${Color.darkThm.accent}`
            : `1.5px solid ${Color.lightThm.accent}`
         : 'none'};
   transition: border-bottom 0.2s ease-in-out;
   box-sizing: border-box;
   cursor: pointer;
`;

export const SlideHeadings = styled.div<{ isDarkTheme: boolean }>`
   width: 100%;
   height: 2.5em;
   z-index: 100;
   display: flex;
   justify-content: space-around;
   align-items: center;
   box-sizing: border-box;
   border-bottom: 1px solid
      ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   border-bottom-left-radius: 10px;
   border-bottom-right-radius: 10px;
`;
