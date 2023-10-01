import styled, { css } from 'styled-components';
import Clickables from '../../../helpers/styledComponents/clickables';
import Color from '../../../theme/colors';

class MenuWrapperStyles {
   static largeScrn = css`
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
   `;

   static smallScrn = (isDarkTheme: boolean) => css`
      margin: 1em;
      background-color: ${isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.txt, 0.1)
         : `rgba(0, 0, 0, 0.1)`};
      border-radius: 1em;
      width: 100%;
      border: ${isDarkTheme
         ? `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)}`
         : `1px solid ${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
      & > *:not(:last-child) {
         border-bottom: ${isDarkTheme
            ? `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)}`
            : `1px solid ${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
      }
   `;
}

export const MenuListWrapper = styled.div<{ isDarkTheme: boolean }>`
   ::-webkit-scrollbar {
      display: none;
   }
   height: fit-content;
   @media (max-width: 850px) {
      ${({ isDarkTheme }) => MenuWrapperStyles.smallScrn(isDarkTheme)};
   }

   @media (min-width: 850px) {
      ${MenuWrapperStyles.largeScrn};
   }
`;

// ---- //

class ItemContainerStyles {
   static largeScrn = (isDarkTheme: boolean) => css`
      border: ${isDarkTheme
         ? `1px solid ${Color.darkThm.border}`
         : `1px solid ${Color.lightThm.border}`};
      height: 12.5em;
      width: 12.5em;
      margin: 1.5em;
      border-radius: 1em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:hover {
         background-color: ${Color.setRgbOpacity(
            isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
            0.1,
         )};
      }
   `;

   static smallSrn = (spaceRow: boolean) => css`
      height: 3em;
      display: flex;
      align-items: center;
      padding-left: 1em;
      justify-content: ${spaceRow && 'space-between'};
      padding-right: ${spaceRow && '1em'};
   `;
}

export const ItemContainer = styled.div<{
   spaceRow?: boolean;
   dangerItem?: boolean;
   warningItem?: boolean;
   isDarkTheme: boolean;
}>`
   ${Clickables.removeDefaultEffects};
   cursor: pointer;
   color: ${({ dangerItem, warningItem, isDarkTheme }) =>
      dangerItem
         ? isDarkTheme
            ? Color.darkThm.error
            : Color.lightThm.error
         : warningItem
         ? isDarkTheme
            ? Color.darkThm.warning
            : Color.lightThm.warning
         : undefined};
   &:hover:active {
      background-color: ${({ isDarkTheme }) =>
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.1)};
   }
   @media (max-width: 850px) {
      ${({ spaceRow }) => ItemContainerStyles.smallSrn(!!spaceRow)};
   }
   @media (min-width: 850px) {
      ${({ isDarkTheme }) => ItemContainerStyles.largeScrn(isDarkTheme)};
   }
`;

export const IconAndNameWrapper = styled.div<{ row?: boolean }>`
   display: flex;
   justify-content: center;
   flex-direction: ${({ row }) => (row ? 'row' : 'column')};
   align-items: center;
   padding-bottom: ${({ row }) => !row && '0.5em'};
`;

export const ItemContentWrapper = styled.div`
   display: flex;
   flex-direction: column;
   @media (max-width: 850px) {
      align-items: start;
   }
   @media (min-width: 850px) {
      align-items: center;
   }
`;

export function iconStyles(isPortableDevice: boolean) {
   return isPortableDevice
      ? { height: '1.5em', paddingRight: '0.5em' }
      : { height: '6.5em', paddingBottom: '0.5em' };
}

export const ItemDetails = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.75em;
   color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.5)};
`;
