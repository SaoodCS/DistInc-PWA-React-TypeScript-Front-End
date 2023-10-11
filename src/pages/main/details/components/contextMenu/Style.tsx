import styled, { css } from 'styled-components';
import MyCSS from '../../../../../global/css/MyCSS';

const commonOpenerCSS = css`
   display: flex;
   position: fixed;
   align-items: center;
   right: 0px;
   top: 0px;
   height: 10%;
   & > *:first-child {
      margin: 0;
      padding: 0;
   }
`;

export const DetailsCMOpenerWrapper = styled.div`
   ${commonOpenerCSS};
   margin-right: 1em;
`;

export const FiltererCMOpenerWrapper = styled.div`
   ${commonOpenerCSS};
   margin-right: 3em;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      margin-right: 2.25em;
   }
`;
