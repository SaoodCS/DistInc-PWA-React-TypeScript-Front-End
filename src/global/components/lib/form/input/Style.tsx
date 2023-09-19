import styled from 'styled-components';
import Color from '../../../../styles/colors';

interface IInput {
   isRequired: boolean;
}

interface ITextInput extends IInput {
   hasError: boolean;
}

interface IInputLabel extends IInput {
   focusedInput: boolean;
   inputHasValue: boolean;
}

export const InputContainer = styled.div`
   width: 100%;
   height: 4em;
`;

export const LabelWrapper = styled.label``;

export const InputLabel = styled.div<IInputLabel>`
   font-size: 0.75em;
   color: ${({ focusedInput }) => (focusedInput ? Color.lightThm.accent : 'grey')};
   transform: ${({ focusedInput, inputHasValue }) => (focusedInput || inputHasValue ? 'translateY(-0.5em)' : 'translateY(0.5em)')};
   font-size: ${({ focusedInput, inputHasValue }) => (focusedInput || inputHasValue ? '0.8em' : '0.8em')};
   pointer-events: none;
   transition: all 0.2s ease-in-out;
   &:after {
      content: ${({ isRequired }) => (isRequired ? "'*'" : "''")};
      color: red;
      padding: 2px;
   }
`;

export const TextInput = styled.input.attrs<IInput>(({ isRequired }) => ({
   isRequired: isRequired,
}))<ITextInput>`
   all: unset;
   font-size: 1em;
   width: 100%;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   border-bottom: ${({ hasError }) =>
      hasError ? `2px solid red` : `1px solid ${Color.lightThm.border}`};
   &:focus,
   &:active {
      border-bottom: ${({ hasError }) => (hasError ? `2px solid red` : `1px solid ${Color.lightThm.accent}`)};
   }
   font-weight: 100;
   z-index: 1;
  
`;

export const ErrorLabel = styled.div`
   font-size: 0.75em;
   color: ${Color.darkThm.error};
`;
