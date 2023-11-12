import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const LargeScrnResponsiveFlexWrap = styled.div<{ childrenMargin?: string }>`
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      display: flex;
      flex-wrap: wrap;
      & > * {
         margin: ${({ childrenMargin }) => childrenMargin || '0em'};
      }
   }
`;
