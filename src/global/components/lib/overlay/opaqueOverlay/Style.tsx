import styled from 'styled-components';

export const OpaqueOverlay = styled.div<{ bgColor: string }>`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: ${({ bgColor }) => bgColor};
   z-index: 1;
   backdrop-filter: blur(5px);
`;
