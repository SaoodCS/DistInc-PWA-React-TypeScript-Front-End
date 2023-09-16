import styled, { css } from 'styled-components';

export const CenterWrapper = styled.div<{
   centerOfScreen?: boolean | true;
}>`
   position: fixed;
   z-index: 99999;
   ${({ centerOfScreen }) =>
      centerOfScreen
         ? css`
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: flex;
              justify-content: center;
              align-items: center;
           `
         : css`
              top: unset;
              left: unset;
              transform: unset;
              display: unset;
              justify-content: unset;
              align-items: unset;
           `}
`;
