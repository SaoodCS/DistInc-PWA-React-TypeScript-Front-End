import styled from 'styled-components';

export const FlexRowWrapper = styled.div<{ justifyContent?: string; padding?: string }>`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: ${({ justifyContent }): string =>
      justifyContent ? justifyContent : 'flex-start'};
   padding: ${({ padding }): string => (padding ? padding : '0')};
`;
