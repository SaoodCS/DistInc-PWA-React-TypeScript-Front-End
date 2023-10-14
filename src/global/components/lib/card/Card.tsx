import styled from 'styled-components';
import Color from '../../../css/colors';

export const Card = styled.div<{ isDarkTheme: boolean }>`
   border: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   margin: 1em;
   border-radius: 10px;
`;
