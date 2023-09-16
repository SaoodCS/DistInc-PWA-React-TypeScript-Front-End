import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import ConditionalRender from '../conditionalRender/ConditionalRender';
import { VerticalSeperator } from '../verticalSeperator/VerticalSeperator';
import { BannerBackground, BannerContainer, BannerContent } from './Style';

interface IBanner {
   message: string;
   handleClick?: () => void;
   isVisible: boolean;
   Icon?: ReactNode;
   onClose: () => void;
   heightEm?: number;
}

function Banner(props: IBanner): JSX.Element {
   const backgroundId = 'bannerBackground';
   const containerId = 'bannerContainer';
   const { message, handleClick, isVisible, Icon, onClose, heightEm } = props;
   const { isDarkTheme } = useContext(ThemeContext);
   const [renderBanner, setRenderBanner] = useState(isVisible);
   const [mouseDown, setMouseDown] = useState(false);
   let timeout1: NodeJS.Timeout;
   let timeout2: NodeJS.Timeout;

   useEffect(() => {
      if (isVisible && !mouseDown) {
         setRenderBanner(true);
         timeout1 = setTimeout(() => {
            setRenderBanner(false);
            timeout2 = setTimeout(() => {
               onClose();
            }, 300);
         }, 2000);
      }
      return () => {
         clearTimeout(timeout1);
         clearTimeout(timeout2);
      };
   }, [isVisible, mouseDown]);

   const handleMouseDown = (): void => {
      setMouseDown(true);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
   };

   const handleMouseUp = (): void => {
      setMouseDown(false);
      const currentScrollPos = document.getElementById(backgroundId)?.scrollTop || 0;
      if (currentScrollPos > 0) {
         document.getElementById(backgroundId)!.style.top = `-${(heightEm || 5) * 1.3}em`;
         timeout1 = setTimeout(() => {
            document.getElementById(backgroundId)!.style.display = `none`;
         }, 300);
      }
   };

   return (
      <ConditionalRender condition={isVisible}>
         <BannerBackground renderBanner={renderBanner} id={backgroundId} heightEm={heightEm || 5}>
            <BannerContainer
               onClick={handleClick && handleClick}
               renderBanner={renderBanner}
               id={containerId}
               heightEm={heightEm || 5}
               isDarkTheme={isDarkTheme}
               onMouseDown={handleMouseDown}
               onMouseUp={handleMouseUp}
               onTouchStart={handleMouseDown}
               onTouchEnd={handleMouseUp}
            >
               <BannerContent hasIcon={Icon !== undefined}>
                  <ConditionalRender condition={Icon !== undefined}>{Icon}</ConditionalRender>
                  {message}
               </BannerContent>
            </BannerContainer>
            <VerticalSeperator margTopEm={6} margBottomEm={0} />
         </BannerBackground>
      </ConditionalRender>
   );
}

export default Banner;

Banner.defaultProps = {
   Icon: undefined,
   handleClick: undefined,
   heightEm: 5,
};
