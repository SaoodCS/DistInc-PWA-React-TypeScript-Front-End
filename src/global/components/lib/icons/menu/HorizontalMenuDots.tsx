import { DotsHorizontalRounded } from '@styled-icons/boxicons-regular/DotsHorizontalRounded';
import styled from 'styled-components';
import Color from '../../../../css/colors';

export const HorizontalMenuDots = styled(DotsHorizontalRounded)<{ darktheme: string }>`
   background: none;
   border: none;
   user-select: none;
   text-decoration: none;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   -webkit-touch-callout: none;
   height: 1.25em;
   color: ${({ darktheme }) =>
      darktheme === 'true' ? Color.darkThm.accent : Color.lightThm.accent};
   border-radius: 50%;
   box-sizing: border-box;
   border: 1px solid
      ${({ darktheme }) => (darktheme === 'true' ? Color.darkThm.accent : Color.lightThm.accent)};
   cursor: pointer;
   &:hover {
      color: ${({ darktheme }) =>
         Color.setRgbOpacity(
            darktheme === 'true' ? Color.darkThm.accent : Color.lightThm.accent,
            0.5,
         )};
      border: 1px solid
         ${({ darktheme }) =>
            Color.setRgbOpacity(
               darktheme === 'true' ? Color.darkThm.accent : Color.lightThm.accent,
               0.5,
            )};
   }
   transition: all 0.3s ease-in-out;
`;
