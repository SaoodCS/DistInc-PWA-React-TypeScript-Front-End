import styled from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';

export const CardHolder = styled.div`
   width: 25em;
   height: 25em;
   position: relative;
   max-width: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      width: 35em;
      height: 35em;
   }
`;

export const CardHolderRow = styled.div`
   display: flex;
   height: 50%;
   width: 100%;
   position: relative;
`;

export const SmallCardSquareHolder = styled.div`
   width: 50%;
   height: 100%;
   position: relative;
`;

export const ExtraSmallCardSquareHolder = styled.div`
   width: 100%;
   height: 50%;
   position: relative;
`;

export const CardContentWrapper = styled.div<{ isDarkTheme: boolean; height?: string }>`
   position: absolute;
   top: 0.5em;
   bottom: 0.5em;
   left: 0.5em;
   right: 0.5em;
   border-radius: 10px;
   overflow: hidden;
   background-color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.lightThm.bg : Color.darkThm.bg, 0.05)};
   font-size: 0.9em;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      height: ${({ height }) => height || 'auto'};
   }
`;
