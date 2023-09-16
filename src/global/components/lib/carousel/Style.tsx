import styled from 'styled-components';
import Scrollbar from '../../../styles/scrollbars';

export const CarouselContainer = styled.div<{ height: string }>`
   height: ${({ height }) => height};
   display: flex;
   overflow-x: scroll;
   scroll-snap-type: x mandatory;
   overflow-y: hidden;
   scroll-behavior: smooth;
   ${Scrollbar.hide};
`;

export const Slide = styled.div<{ width: string }>`
   width: ${({ width }) => width};
   flex: none;
   scroll-snap-align: start;
   overflow-y: scroll;
   border: 1px solid black;
   ${Scrollbar.hide};
`;
