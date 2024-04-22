import styled from 'styled-components';

export const SplashToAppTransitioner = styled.div<{ isSplashScreenDisplayed: boolean }>`
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   box-sizing: border-box;
   opacity: ${({ isSplashScreenDisplayed }) => (isSplashScreenDisplayed ? 0 : 1)};
   transition: opacity 2000ms ease-in-out;
`;
