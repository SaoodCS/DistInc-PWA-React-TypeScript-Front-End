import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

export namespace MyCSS {
   export class PortableBp {
      static asNum = 850;
      static asPx = `${PortableBp.asNum}px`;
   }

   export namespace Clickables {
      export const removeDefaultEffects = css`
         background: none;
         border: none;
         user-select: none;
         text-decoration: none;
         -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
         -webkit-touch-callout: none;
      `;
      export const portable = {
         changeColorOnClick: (
            changeToColor: string,
            propertyToChange: 'background-color' | 'color' | 'border',
            postClick: 'revert' | 'persist',
         ) => {
            return css`
               @media (max-width: ${MyCSS.PortableBp.asPx}) {
                  transition: ${propertyToChange} 0.2s;
                  ${postClick === 'persist'
                     ? `&:hover {
                        ${
                           propertyToChange === 'background-color'
                              ? `background-color: ${changeToColor};`
                              : propertyToChange === 'color'
                              ? `color: ${changeToColor};`
                              : `border: 1px solid ${changeToColor};`
                        }
                     }`
                     : `&:active {
                        ${
                           propertyToChange === 'background-color'
                              ? `background-color: ${changeToColor};`
                              : propertyToChange === 'color'
                              ? `color: ${changeToColor};`
                              : `border: 1px solid ${changeToColor};`
                        }
                     }`}
               }
            `;
         },
      };

      export const desktop = {
         changeColorOnClick: (
            changeToColor: string,
            propertyToChange: 'background-color' | 'color' | 'border',
            postClick: 'revert' | 'persist',
         ) => {
            return css`
               @media (min-width: ${MyCSS.PortableBp.asPx}) {
                  cursor: pointer;
                  transition: ${propertyToChange} 0.2s;
                  ${postClick === 'revert'
                     ? `&:active {
                        ${
                           propertyToChange === 'background-color'
                              ? `background-color: ${changeToColor};`
                              : propertyToChange === 'color'
                              ? `color: ${changeToColor};`
                              : `border: 1px solid ${changeToColor};`
                        }
                     }`
                     : // this else part doesn't work
                       `&:active, &:focus {
                        ${
                           propertyToChange === 'background-color'
                              ? `background-color: ${changeToColor};`
                              : propertyToChange === 'color'
                              ? `color: ${changeToColor};`
                              : `border: 1px solid ${changeToColor};`
                        }
                     }`}
               }
            `;
         },
         changeColorOnHover: (
            changeToColor: string,
            propertyToChange: 'background-color' | 'color' | 'border',
         ) => {
            return css`
               cursor: pointer;
               transition: ${propertyToChange} 0.2s;
               @media (min-width: ${MyCSS.PortableBp.asPx}) {
                  &:hover {
                     ${propertyToChange === 'background-color'
                        ? `background-color: ${changeToColor};`
                        : propertyToChange === 'color'
                        ? `color: ${changeToColor};`
                        : `border: 1px solid ${changeToColor};`}
                  }
               }
            `;
         },
      };
   }

   export class LayoutStyle {
      static paddingBorderBox = (paddingAmount: string): FlattenSimpleInterpolation => css`
         box-sizing: border-box;
         padding: ${paddingAmount};
      `;
   }

   export class Scrollbar {
      static hide = css`
         scrollbar-width: none;
         ::-webkit-scrollbar {
            display: none;
         }
      `;

      static gradientStyle = css`
         ::-webkit-scrollbar {
            width: 0.25em;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 10em;
            border: none;
         }
         ::-webkit-scrollbar-thumb {
            background-image: -webkit-gradient(
               linear,
               left bottom,
               left top,
               color-stop(0.44, rgba(255, 255, 255, 0.586)),
               color-stop(0.72, rgba(152, 152, 152, 0.695)),
               color-stop(0.86, rgb(71, 71, 71)),
               color-stop(1, rgb(7, 7, 7))
            );
            border-radius: 8px;
         }
         ::-webkit-scrollbar-thumb:hover {
            background-color: #ffffff;
         }
      `;
   }

   export class Helper {
      static concatStyles = (
         ...styles: FlattenSimpleInterpolation[]
      ): FlattenSimpleInterpolation => css`
         ${styles.reduce(
            (acc, cur) => css`
               ${acc}
               ${cur}
            `,
         )}
      `;
   }
}

export default MyCSS;
