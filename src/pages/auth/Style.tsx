import styled, { keyframes } from "styled-components";
import Color from "../../global/styles/colors";

export const StyledForm = styled.form`
   width: 20em;
   display: flex;
   justify-content: center;
   flex-direction: column;
   padding: 1em;
   border: 1px solid ${Color.lightThm.border};
   border-radius: 0.7em;
   margin-top:1em;
`;

export const SlideWrapper = styled.div`
   width: 100%;
   display: flex;
   justify-content: center;
`;

export const ScrollNavigatorWrapper = styled.div`
   display: flex;
   justify-content: center;
`;

export const ScrollNavigatorBtn = styled.div`
   width: 50%;
   text-align: center;
   border-right: 1px solid black;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const ScrollNavigatorContainer = styled.div`
   border: 1px solid black;
   width: 20em;
   height: 3em;
   display: flex;
   align-items: center;
   justify-content: center;
`;

export const LogoContainer = styled.div`
   padding: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const StyledTextInput = styled.input`
   all: unset;
   padding: 0.8em;
   margin-bottom: 1.25em;
   border-radius: 0.7em;
   border: 1px solid ${Color.lightThm.border};
   &:focus,
   &:active {
      border: 2px solid ${Color.lightThm.accent};
   }
   font-weight: 100;
`;

export const InputLabel = styled.div`
   padding-bottom: 6px;
`;