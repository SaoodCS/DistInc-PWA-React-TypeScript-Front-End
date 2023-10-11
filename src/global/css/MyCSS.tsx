import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

export namespace MyCSS {
   export class PortableBp {
      static asNum = 850;
      static asPx = `${PortableBp.asNum}px`;
   }
   //TODO replace all instances of these classes with this namespace version -> then delete the files clickables, layouts and scrollbar .ts
   export class Clickables {
      static removeDefaultEffects = css`
         all: unset;
         background: none;
         border: none;
         user-select: none;
         text-decoration: none;
         -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
         -webkit-touch-callout: none;
      `;
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
}

export default MyCSS;
