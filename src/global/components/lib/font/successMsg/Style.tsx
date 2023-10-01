import styled from "styled-components";
import { CheckCircle } from 'styled-icons/material';
import Color from '../../../../theme/colors';

export const SuccessMsgText = styled.div`
   margin-left: 0.5em;
   font-size: 0.9em;
`;

export const SuccessIcon = styled(CheckCircle)<{ darktheme: boolean }>`
   height: 6em;
   color: ${({ darktheme }) => (darktheme ? Color.darkThm.success : Color.lightThm.success)};
`;

export const SuccessMsgHolder = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
`;