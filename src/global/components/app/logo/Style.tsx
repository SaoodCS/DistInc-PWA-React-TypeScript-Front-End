import styled from 'styled-components';

export const LogoWrapper = styled.div<{ size: string; accentColor: string }>`
   height: ${({ size }) => size};
   width: ${({ size }) => size};
   border-radius: ${({ size }) => `calc(${size} * 0.1)`};
   background-color: ${({ accentColor }) => accentColor};
   display: flex;
   align-items: center;
   justify-content: center;
`;

export const Card = styled.div<{ size: string; cardColor: string }>`
   width: 75%;
   height: 42.5%;
   border-radius: ${({ size }) => `calc(${size} * 0.05)`};
   background-color: ${({ cardColor }) => cardColor};
   display: flex;
   flex-direction: column;
   justify-content: space-between;
`;

export const CardStrip = styled.div<{ size: string; accentColor: string }>`
   margin-top: ${({ size }) => `calc(${size} * 0.1)`};
   height: 17%;
   margin-left: ${({ size }) => `calc(${size} * 0.02)`};
   margin-right: ${({ size }) => `calc(${size} * 0.02)`};
   background-color: ${({ accentColor }) => accentColor};
`;

export const RectContainer = styled.div<{ size: string }>`
   margin-bottom: ${({ size }) => `calc(${size} * 0.08)`};
   display: flex;
   flex-direction: row;
   justify-content: end;
   height: 7%;
`;

export const RectOne = styled.div<{ size: string; accentColor: string }>`
   margin-right: ${({ size }) => `calc(${size} * 0.025)`};
   height: 100%;
   width: ${({ size }) => `calc(${size} * 0.06)`};
   background-color: ${({ accentColor }) => accentColor};
`;

export const RectTwo = styled.div<{ size: string; accentColor: string }>`
   margin-right: ${({ size }) => `calc(${size} * 0.1)`};
   height: 100%;
   width: ${({ size }) => `calc(${size} * 0.06)`};
   background-color: ${({ accentColor }) => accentColor};
`;
