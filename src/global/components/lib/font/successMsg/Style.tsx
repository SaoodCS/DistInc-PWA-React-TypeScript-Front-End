import styled from "styled-components";
import { CheckCircle } from 'styled-icons/material';
import Color from '../../../../theme/colors';

export const SuccessMsgText = styled.div`
   margin-left: 0.5em;
   font-size: 0.9em;
   width: 90%;
`;

export const SuccessIcon = styled(CheckCircle)<{ darktheme: boolean }>`
   width: 10%;
   color: ${({ darktheme }) => (darktheme ? Color.darkThm.success : Color.lightThm.success)};
`;

export const SuccessMsgHolder = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
`;