import Sheet from 'react-modal-sheet';
import styled, { css } from 'styled-components';
import Color from '../../../theme/colors';
import { ModalCloseButton } from '../modal/Style';

const commonHeaderStyles = css`
   background-color: ${({ darktheme }: { darktheme: boolean }) =>
      darktheme ? Color.darkThm.bg : Color.lightThm.bg};
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 1.1em;
   border-top-left-radius: 7px;
   border-top-right-radius: 7px;
`;

export const SheetContentWrapper = styled.div<{ height: string }>`
   height: ${({ height }) => height};
`;

export const CustomPanelHeader = styled.div<{ darktheme: boolean }>`
   ${commonHeaderStyles};
   padding-top: 1em;
   padding-bottom: 1em;
`;

export const CustomBottomPanelSheet = styled(Sheet)<{ darktheme: boolean }>`
   //border-radius: 10px;
   .react-modal-sheet-backdrop {
      backdrop-filter: blur(1px);
   }
   .react-modal-sheet-container {
   }
   .react-modal-sheet-header {
      ${commonHeaderStyles};
      padding-top: 0.5em;
      padding-bottom: 0.5em;
   }
   .react-modal-sheet-drag-indicator {
      /* custom styles */
   }
   .react-modal-sheet-content {
      background-color: ${({ darktheme }) =>
         darktheme
            ? Color.setRgbOpacity(Color.darkThm.bg, 0.9)
            : Color.setRgbOpacity(Color.lightThm.txt, 0.1)};
   }
`;

export const PanelCloseButton = styled(ModalCloseButton)`
   margin-left: 1em;
   font-size: 1.1em;
`;

export const HeaderColumnLeft = styled.div`
   min-width: 33%;
   max-width: 33%;
`;

export const HeaderColumnCenter = styled(HeaderColumnLeft)`
   display: flex;
   justify-content: center;
`;

export const HeaderColumnRight = styled(HeaderColumnLeft)`
   display: flex;
   justify-content: right;
`;
