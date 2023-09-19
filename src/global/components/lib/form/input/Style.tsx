import styled from 'styled-components';
import Color from '../../../../styles/colors';

export const InputContainer = styled.div`
   width: 100%;
   height: 4em;
`;

export const InputLabel = styled.div<{ focusedInput?: boolean }>`
   font-size: 0.75em;
   color: ${({ focusedInput }) => (focusedInput ? Color.lightThm.accent : 'grey')};
   transform: ${({ focusedInput }) => (focusedInput ? 'translateY(-0.5em)' : 'translateY(0.25em)')};
   pointer-events: none;
   transition: all 0.2s ease-in-out;
`;

export const TextInput = styled.input`
   all: unset;
   font-size: 1em;
   width: 100%;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   border-bottom: 1px solid ${Color.lightThm.border};
   &:focus,
   &:active {
      border-bottom: 1px solid ${Color.lightThm.accent};
   }
   font-weight: 100;
   z-index: 1;
`;