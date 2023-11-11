import styled from 'styled-components';

export const FlexRowWrapper = styled.div<{
   justifyContent?: string;
   padding?: string;
   width?: string;
}>`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: ${({ justifyContent }): string =>
      justifyContent ? justifyContent : 'flex-start'};
   padding: ${({ padding }): string => (padding ? padding : '0')};
   width: ${({ width }): string => (width ? width : 'auto')};
`;
