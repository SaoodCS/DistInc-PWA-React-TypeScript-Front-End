import styled from 'styled-components';
import Color from '../../../theme/colors';
import type { THorizontalPos, TVerticalPos } from './Toast';

export const ToastContainer = styled.div<{
   width: string;
   verticalPos: TVerticalPos;
   horizontalPos: THorizontalPos;
   isDarkTheme: boolean;
}>`
   min-width: ${({ width }) => width};
   max-width: ${({ width }) => width};
   top: ${({ verticalPos }) => (verticalPos === 'top' ? '2em' : 'unset')};
   bottom: ${({ verticalPos }) => (verticalPos === 'bottom' ? '2em' : 'unset')};
   left: ${({ horizontalPos }) => (horizontalPos === 'left' ? '2em' : 'unset')};
   right: ${({ horizontalPos }) => (horizontalPos === 'right' ? '2em' : 'unset')};
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg)};
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.txt, 0.7)
         : Color.setRgbOpacity(Color.lightThm.txt, 0.7)};
   position: fixed;
   display: flex;
   justify-content: center;
   border-radius: 10px;
   padding: 1em;
   backdrop-filter: blur(5px);

   font-size: 0.9em;
`;
