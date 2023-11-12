import styled from 'styled-components';

export const FlexColumnWrapper = styled.div<{
   justifyContent?: string;
   padding?: string;
   height?: string;
   width?: string;
}>`
   display: flex;
   flex-direction: column;
   justify-content: ${({ justifyContent }): string =>
      justifyContent ? justifyContent : 'flex-start'};
   padding: ${({ padding }): string => (padding ? padding : '0')};
   height: ${({ height }) => height};
`;