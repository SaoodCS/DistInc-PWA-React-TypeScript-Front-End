import styled from 'styled-components';
import Color from '../../../../css/colors';

export const CurrencyOnCardTxt = styled.span<{ isDarkTheme: boolean }>`
   display: inline-block;
   transform: scale(1.05, 0.95);
   -webkit-transform: scale(1.05, 0.95);
   letter-spacing: 0.02em;
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
   text-shadow: ${({ isDarkTheme }) =>
      `1px 1px 1px ${Color.setRgbOpacity(
         isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         1,
      )}`};
   font-size: 1.5em;
`;
