import styled from 'styled-components';
import Color from '../../../css/colors';

export const SearchBar = styled.input`
   width: 100%;
   padding: 0.5em;
   box-sizing: border-box;
   background-color: rgba(128, 128, 128, 0.1);
   color: grey;
   border-width: 1px;
   border-top: none;
   border-left: none;
   border-right: none;
   border-color: ${Color.darkThm.accent};
   outline: none;
   border-bottom-left-radius: 5px;
   border-bottom-right-radius: 5px;
`;
