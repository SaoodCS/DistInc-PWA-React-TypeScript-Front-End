import styled from 'styled-components';

export const ListItem = styled.li<{ color?: string }>`
   color: ${({ color }) => (color ? color : 'inherit')};
`;

export const BulletList = styled.ul`
   margin-left: -1em;
   & > * {
      margin-bottom: 0.5em;
      margin-left: 0;
      padding-left: 0;
   }
`;
