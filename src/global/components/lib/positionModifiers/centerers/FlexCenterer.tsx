import styled from 'styled-components';

export const FlexCenterer = styled.div<{ height?: string; width?: string }>`
   display: flex;
   justify-content: center;
   align-items: center;
   height: ${({ height }) => height || 'auto'};
   width: ${({ width }) => width || 'auto'};
`;
