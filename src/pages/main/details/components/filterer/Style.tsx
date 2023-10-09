import styled from 'styled-components';
import Color from '../../../../../global/theme/colors';

export const IconWrapper = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   right: 0;
   margin-right: 3em;
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent)};
`;
