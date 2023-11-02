import { Error } from '@styled-icons/material-twotone/Error';
import styled from 'styled-components';
import Color from '../../../../css/colors';

export const ErrorMsg = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.9em;
   color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.txt, 0.5)
         : Color.setRgbOpacity(Color.lightThm.txt, 0.8)};
`;

export const FetchErrorWrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   width: 100%;
   box-sizing: border-box;
   & > * {
      margin-top: 1em;
   }
`;

export const ErrorIcon = styled(Error)<{ darktheme: string }>`
   height: 5em;
   color: ${({ darktheme }) =>
      darktheme === 'true'
         ? Color.setRgbOpacity(Color.darkThm.error, 0.6)
         : Color.setRgbOpacity(Color.lightThm.error, 0.7)};
`;
