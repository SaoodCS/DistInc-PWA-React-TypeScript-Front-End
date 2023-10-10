import type { ReactNode, RefObject } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import { TransparentOverlay } from '../overlay/transparentOverlay/TransparentOverlay';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { ContextMenuWrapper } from './Style';

export type TButtonPos = 'top left' | 'top right' | 'bottom left' | 'bottom right';

interface IContextMenu {
   btnPosition: TButtonPos;
   children: ReactNode;
   isOpen: boolean;
   toggleClose: () => void;
   widthPx?: number;
}

interface IContextMenuPos {
   top?: number;
   bottom?: number;
   left?: number;
   right?: number;
}

const ContextMenu = forwardRef<HTMLButtonElement, IContextMenu>((props, ref) => {
   const { btnPosition, children, isOpen, toggleClose, widthPx } = props;
   const { isDarkTheme } = useContext(ThemeContext);
   const contextMenuWrapperRef = useRef<HTMLDivElement>(null);
   const [contextMenuPosition, setContextMenuPosition] = useState<IContextMenuPos>({});
   const [renderMenu, setRenderMenu] = useState(false);
   const [contextMenuHeight, setContextMenuHeight] = useState(0);

   useEffect(() => {
      if (contextMenuWrapperRef.current) {
         setContextMenuHeight(contextMenuWrapperRef.current.clientHeight);
      }
   }, [contextMenuWrapperRef.current?.clientHeight]);

   useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined = undefined;
      if (!isOpen) {
         timeoutId = setTimeout(() => {
            setRenderMenu(false);
         }, 250);
      } else {
         setRenderMenu(true);
      }
      return () => {
         clearTimeout(timeoutId);
      };
   }, [isOpen]);

   useEffect(() => {
      function handleClickOutside(event: MouseEvent): void {
         if (
            contextMenuWrapperRef.current &&
            !contextMenuWrapperRef.current.contains(event.target as Node)
         ) {
            toggleClose();
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [renderMenu]);

   useEffect(() => {
      if ((ref as RefObject<HTMLButtonElement>).current) {
         const btnRect = (ref as RefObject<HTMLButtonElement>).current!.getBoundingClientRect();
         const contextMenuRect = contextMenuWrapperRef.current?.getBoundingClientRect();
         if (contextMenuRect) {
            if (btnPosition === 'top left') {
               setContextMenuPosition({
                  top: btnRect.bottom,
                  left: btnRect.left,
               });
            } else if (btnPosition === 'top right') {
               setContextMenuPosition({
                  top: btnRect.bottom,
                  right: window.innerWidth - btnRect.right,
               });
            } else if (btnPosition === 'bottom left') {
               setContextMenuPosition({
                  top: btnRect.top - contextMenuHeight,
                  left: btnRect.left,
               });
            } else if (btnPosition === 'bottom right') {
               setContextMenuPosition({
                  top: btnRect.bottom - btnRect.height - contextMenuHeight,
                  right: window.innerWidth - btnRect.right,
               });
            }
         }
      }
   }, [renderMenu, contextMenuHeight, btnPosition, widthPx]);

   return (
      <ConditionalRender condition={renderMenu}>
         <ContextMenuWrapper
            ref={contextMenuWrapperRef}
            top={contextMenuPosition.top}
            left={contextMenuPosition.left}
            bottom={contextMenuPosition.bottom}
            right={contextMenuPosition.right}
            isDarkTheme={isDarkTheme}
            isOpen={isOpen}
            btnPosition={btnPosition}
            widthPx={widthPx || 50}
         >
            {children}
         </ContextMenuWrapper>
      </ConditionalRender>
   );
});

export default ContextMenu;

ContextMenu.defaultProps = {
   widthPx: 50,
};

ContextMenu.displayName = 'ContextMenu';
