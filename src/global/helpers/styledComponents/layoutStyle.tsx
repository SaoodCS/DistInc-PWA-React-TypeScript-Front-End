import { css } from 'styled-components';

export default class LayoutStyle {
   static paddingBorderBox = (paddingAmount: string) => css`
      box-sizing: border-box;
      padding: ${paddingAmount};
   `;
}
