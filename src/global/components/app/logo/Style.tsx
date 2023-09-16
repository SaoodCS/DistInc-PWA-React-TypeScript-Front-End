import styled from 'styled-components';
import { Cross } from 'styled-icons/boxicons-regular';

export const StyledCanvas = styled.div<{ sizePx: number }>`
   height: ${({ sizePx }) => `${sizePx}px`};
   width: ${({ sizePx }) => `${sizePx}px`};
   border-radius: 15%;
   //background: linear-gradient(145deg, #2b2b2b, #2b2b2b 50%, #1f1f1f);
   box-shadow:
      inset 5px 5px 10px #1a1a1a,
      inset -5px -5px 10px #1a1a1a;
   border: 1px solid #1a1a1a;
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const StyledCircle = styled.div<{ sizePx: number }>`
   height: ${({ sizePx }) => `${sizePx}px`};
   width: ${({ sizePx }) => `${sizePx}px`};
   border-radius: 50%;
   border: ${({ sizePx }) => `${sizePx / 10}px`} solid #daa520a3;
   // border: 10px solid #daa520a3;
   box-shadow:
      inset 5px 5px 10px #1a1a1a,
      inset -5px -5px 10px #1a1a1a;
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const StyledCross = styled(Cross)<{ sizepx: number }>`
   height: ${({ sizepx }) => `${sizepx}px`};
   width: ${({ sizepx }) => `${sizepx}px`};
   color: #daa520a3;
   transform: rotate(45deg);
   border: 1px solid #daa520a3;
   box-shadow:
      inset 2px 2px 10px #1a1a1a,
      inset -2px -2px 10px #1a1a1a;
   background: linear-gradient(145deg, #2b2b2b, #2b2b2b 10%, #1f1f1f);
   z-index: 0;
   background-color: transparent;
`;
