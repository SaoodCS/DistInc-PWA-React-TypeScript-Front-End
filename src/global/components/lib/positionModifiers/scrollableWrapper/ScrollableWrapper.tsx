import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const ScrollableWrapper = styled.div<{
   width?: string;
   position?: string;
   bottom?: string;
   top?: string;
   height?: string;
}>`
   ${MyCSS.Scrollbar.hide};
   overflow: scroll;
   position: ${({ position }) => position || 'static'};
   bottom: ${({ bottom }) => bottom || 'auto'};
   top: ${({ top }) => top || 'auto'};
   width: ${({ width }) => width || 'auto'};
   height: ${({ height }) => height || 'auto'};
`;
