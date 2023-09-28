import styled from 'styled-components';

export const Body = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 10%;
   @media (min-width: 850px) {
      left: 15%;
      width: 85dvw;
      bottom: 0;
   }
`;
