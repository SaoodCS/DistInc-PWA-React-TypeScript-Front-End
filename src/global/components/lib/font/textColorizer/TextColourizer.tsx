import styled from 'styled-components';

export const TextColourizer = styled.span<{ color: string; fontSize?: string }>`
   font-size: ${({ fontSize }) => (fontSize ? fontSize : '1em')};
   color: ${({ color }) => color};
`;
