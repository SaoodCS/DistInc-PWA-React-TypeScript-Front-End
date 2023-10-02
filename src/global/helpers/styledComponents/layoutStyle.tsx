import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

export default class LayoutStyle {
   static paddingBorderBox = (paddingAmount: string): FlattenSimpleInterpolation => css`
      box-sizing: border-box;
      padding: ${paddingAmount};
   `;
}
