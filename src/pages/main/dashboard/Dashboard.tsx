import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import styled from 'styled-components';
import { LargeScrnResponsiveFlexWrap } from '../../../global/components/lib/positionModifiers/responsiveFlexWrap/LargeScrnResponsiveFlexWrap';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import MyCSS from '../../../global/css/MyCSS';
import Color from '../../../global/css/colors';
import SpendingsAnalytics from './spendingsAnalytics/SpendingsAnalytics';

const ExtraSmallCardSquareHolder = styled.div`
   width: 100%;
   height: 50%;
   position: relative;
`;

const CardContentWrapper = styled.div`
   border: 1px solid red;
   position: absolute;
   top: 0.5em;
   bottom: 0.5em;
   left: 0.5em;
   right: 0.5em;
   border-radius: 10px;
   overflow: hidden;
`;

const SmallCardSquareHolder = styled.div`
   width: 50%;
   height: 100%;
   position: relative;
`;

const CardHolderRow = styled.div`
   display: flex;
   height: 50%;
   width: 100%;
   position: relative;
`;

const CardHolder = styled.div`
   width: 25em;
   height: 25em;
   position: relative;
   max-width: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      width: 35em;
      height: 35em;
   }
`;

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');

   return (
      <ScrnResponsiveFlexWrap padding={'0.25em'}>
         {/**/}
         <CardHolder>
            <CardHolderRow>
               <CardContentWrapper>
                  <SpendingsAnalytics />
               </CardContentWrapper>
            </CardHolderRow>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <CardContentWrapper></CardContentWrapper>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
               </SmallCardSquareHolder>
            </CardHolderRow>
         </CardHolder>
         {/**/}
         <CardHolder>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
               </SmallCardSquareHolder>
            </CardHolderRow>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
                  <ExtraSmallCardSquareHolder>
                     <CardContentWrapper></CardContentWrapper>
                  </ExtraSmallCardSquareHolder>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <CardContentWrapper></CardContentWrapper>
               </SmallCardSquareHolder>
            </CardHolderRow>
         </CardHolder>

         {/**/}
         <CardHolder>
            <CardContentWrapper></CardContentWrapper>
         </CardHolder>
         {/**/}
         <CardHolder>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <CardContentWrapper></CardContentWrapper>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <CardContentWrapper></CardContentWrapper>
               </SmallCardSquareHolder>
            </CardHolderRow>
            <CardHolderRow>
               <SmallCardSquareHolder>
                  <CardContentWrapper></CardContentWrapper>
               </SmallCardSquareHolder>
               <SmallCardSquareHolder>
                  <CardContentWrapper></CardContentWrapper>
               </SmallCardSquareHolder>
            </CardHolderRow>
         </CardHolder>
      </ScrnResponsiveFlexWrap>
   );
}

// ----------------- STYLES -----------------

export const ScrnResponsiveFlexWrap = styled.div<{
   childrenMargin?: string;
   padding?: string;
}>`
   padding: ${({ padding }) => (padding ? padding : '0')};
   display: flex;
   flex-wrap: wrap;
   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      overflow: scroll;
      justify-content: center;
      align-items: center;
      height: 99%;
   }
`;
