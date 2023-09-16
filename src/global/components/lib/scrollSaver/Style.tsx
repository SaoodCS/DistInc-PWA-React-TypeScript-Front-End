import styled from 'styled-components';
import Scrollbar from '../../../styles/scrollbars';

export const ContentDiv = styled.div`
   height: auto;
`;

export const ParentDiv = styled.div`
   //border: 1px solid red;
   max-height: 100%;
   overflow: scroll;
   ${Scrollbar.hide};
`;
