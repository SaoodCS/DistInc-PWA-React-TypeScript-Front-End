import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import Color from '../../../../css/colors';

export const DatePickerWrapper = styled.div<{ isDarkTheme: boolean; isActive: boolean }>`
   border-bottom: ${({ isDarkTheme, isActive }) => {
      const colorType = isActive ? 'accent' : 'border';
      const color = isDarkTheme ? Color.darkThm[colorType] : Color.lightThm[colorType];
      return `1px solid ${color}`;
   }};
   width: 100%;

   .react-datepicker__input-container input {
      background-color: transparent;
      color: unset;
      border: none;
      font-size: 1em;

      width: 100%;
      margin: 0;
      padding: 0;
   }

   .react-datepicker-popper {
      background-color: transparent;
   }

   .react-datepicker-wrapper {
      width: 100%;
   }

   .react-datepicker__input-container input:focus {
      outline: none;
      box-shadow: none;
   }

   .react-datepicker__input-container svg {
      width: 1em;
      height: 1em;
      fill: ${({ isDarkTheme, isActive }) => {
         const activeCol = isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent;
         const notActiveCol = Color.setRgbOpacity(
            isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
            0.6,
         );
         return isActive ? activeCol : notActiveCol;
      }};
      position: absolute;
      right: 0;
      bottom: -0.1em;
   }
`;
