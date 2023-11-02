import styled from 'styled-components';

export const TextColourizer = styled.span<{
   color?: string;
   fontSize?: string;
   bold?: boolean;
   padding?: string;
}>`
   font-size: ${({ fontSize }) => (fontSize ? fontSize : '1em')};
   color: ${({ color }) => color};
   font-weight: ${({ bold }) => (bold ? '600' : '400')};
   padding: ${({ padding }) => padding};
`;
