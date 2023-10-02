import styled from 'styled-components';
import LayoutStyle from '../../../../helpers/styledComponents/layoutStyle';
import Color from '../../../../theme/colors';

export const StyledForm = styled.form<{ apiError?: string; padding?: number }>`
   ${({ padding }) => LayoutStyle.paddingBorderBox(padding ? `${padding}em` : '0em')};
   border-radius: 0.7em;
   display: flex;
   flex-direction: column;
   width: 100%;
   margin-top: 1em;
   border-radius: 0.7em;
   height: fit-content;
   ${({ apiError }) =>
      apiError && {
         '&::before': {
            content: `'${apiError}'`,
            color: Color.darkThm.error,
            fontSize: '0.75em',
            position: 'absolute',
            top: 0,
            paddingTop: '0.25em',
            width: '90%',
         },
      }}
`;
