import styled from 'styled-components';
import Clickables from '../../../../global/helpers/styledComponents/clickables';
import Color from '../../../../global/theme/colors';

export const ItemContainer = styled.div<{ withToggle?: boolean; logoutItem?: boolean, isDarkTheme: boolean }>`
   ${Clickables.removeDefaultEffects};
   height: 3em;
   display: flex;
   align-items: center;
   padding-left: 1em;
   cursor: pointer;
   justify-content: ${({ withToggle }) => withToggle && 'space-between'};
   padding-right: ${({ withToggle }) => withToggle && '1em'};

   // color: isDarkTheme ? Color.darkThm.error : Color.lightThm.error

   color: ${({ logoutItem, isDarkTheme }) =>
      logoutItem && (isDarkTheme ? Color.darkThm.error : Color.lightThm.error)};
`;

export const SettingsWrapper = styled.div<{ isDarkTheme: boolean }>`
   height: fit-content;
   margin: 1em;
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.setRgbOpacity(Color.darkThm.txt, 0.1) : `rgba(0, 0, 0, 0.1)`};
   border-radius: 1em;
   overflow: hidden;
   width: 100%;
   border: ${({ isDarkTheme }) =>
      isDarkTheme
         ? `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)}`
         : `1px solid ${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
   & > * {
      @media (max-width: 800px) {
         &:hover:active {
            background-color: ${({ isDarkTheme }) =>
               isDarkTheme
                  ? Color.setRgbOpacity(Color.darkThm.txt, 0.1)
                  : `${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
         }
      }
      @media (min-width: 800px) {
         &:hover {
            background-color: ${({ isDarkTheme }) =>
               isDarkTheme
                  ? Color.setRgbOpacity(Color.darkThm.txt, 0.1)
                  : `${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
         }
      }
   }
   & > *:not(:last-child) {
      border-bottom: ${({ isDarkTheme }) =>
         isDarkTheme
            ? `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)}`
            : `1px solid ${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
   }
`;

export const IconAndLabelWrapper = styled.div``;
