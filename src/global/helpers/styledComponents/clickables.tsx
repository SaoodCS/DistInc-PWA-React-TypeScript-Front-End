import { css } from 'styled-components';

export default class Clickables {
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
