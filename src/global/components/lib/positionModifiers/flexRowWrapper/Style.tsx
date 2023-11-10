import styled from "styled-components";

export const FlexRowWrapper = styled.div<{justifyContent?: string}>`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: ${({justifyContent}): string => justifyContent ? justifyContent : 'flex-start'};
`;