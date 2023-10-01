// Note: This component's functionality will work on desktop if you turn on animation in windows 11 settings (accessibility settings)
import { useEffect, useState, type ReactNode } from 'react';
import Sheet from 'react-modal-sheet';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import {
   CustomBottomPanelSheet,
   CustomPanelHeader,
   HeaderColumnCenter,
   HeaderColumnLeft,
   HeaderColumnRight,
   PanelCloseButton,
   SheetContentWrapper,
} from './Style';

interface IBottomPanel {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   height?: number;
   heading?: string;
   heightFitContent?: boolean;
   zIndex?: number;
}

export default function BottomPanel(props: IBottomPanel): JSX.Element {
   const { isOpen, onClose, children, height, heading, heightFitContent, zIndex } = props;
   const { isDarkTheme } = useThemeContext();
   const isKeyboardOpen = useDetectKeyboardOpen();

   function handleHeight(): number {
      if (!height) return 50;
      if (isKeyboardOpen && height) return height * 2;
      return height;
   }

   return (
      <>
         <CustomBottomPanelSheet
            isOpen={isOpen}
            onClose={() => onClose()}
            tweenConfig={{ ease: 'easeOut', duration: 0.2 }}
            darktheme={isDarkTheme}
            detent={'content-height'}
            prefersReducedMotion={false}
            style={{ zIndex: zIndex || undefined }}
         >
            <Sheet.Container>
               <ConditionalRender condition={heading !== undefined}>
                  <Sheet.Header>
                     <CustomPanelHeader darktheme={isDarkTheme}>
                        <HeaderColumnLeft>
                           <PanelCloseButton onClick={() => onClose()} />
                        </HeaderColumnLeft>
                        <HeaderColumnCenter>{heading}</HeaderColumnCenter>
                        <HeaderColumnRight />
                     </CustomPanelHeader>
                  </Sheet.Header>
               </ConditionalRender>
               <ConditionalRender condition={heading === undefined}>
                  <Sheet.Header />
               </ConditionalRender>
               <Sheet.Content>
                  <Sheet.Scroller>
                     <ConditionalRender condition={heightFitContent !== true}>
                        <SheetContentWrapper heightDvh={handleHeight()}>
                           {children}
                        </SheetContentWrapper>
                     </ConditionalRender>
                     <ConditionalRender condition={heightFitContent === true}>
                        {children}
                     </ConditionalRender>
                  </Sheet.Scroller>
               </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => onClose()} />
         </CustomBottomPanelSheet>
      </>
   );
}

BottomPanel.defaultProps = {
   height: undefined,
   heading: undefined,
   heightFitContent: false,
};
