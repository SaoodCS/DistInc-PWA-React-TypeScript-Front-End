import styled from 'styled-components';

export const TextColourizer = styled.span<{ color: string }>`
   color: ${({ color }) => color};
`;
