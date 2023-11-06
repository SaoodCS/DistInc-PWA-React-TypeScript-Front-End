import { useEffect, useState } from 'react';
import PopupMenu from '../../../components/lib/popupMenu/PopupMenu';
import JSXHelper from '../../../helpers/dataTypes/jsx/jsxHelper';
import { PopupMenuContext } from './PopupMenuContext';

interface IPopupMenuContextProvider {
   children: React.ReactNode;
}

export default function PopupMenuContextProvider(props: IPopupMenuContextProvider): JSX.Element {
   const { children } = props;
   const [pmOpenerPos, setPMOpenerPos] = useState({ x: 0, y: 0 });
   const [pmIsOpen, setPMIsOpen] = useState(false);
   const [pmWidthPx, setPMWidthPx] = useState(0);
   const [pmHeightPx, setPMHeightPx] = useState(0);
   const [pmContent, setPMContent] = useState(<></>);
   const [clickEvent, setClickEvent] = useState(
      {} as React.MouseEvent<HTMLButtonElement | HTMLDivElement | SVGSVGElement, MouseEvent>,
   );

   useEffect(() => {
      if (pmIsOpen) {
         setPMOpenerPos(JSXHelper.getClickPos(clickEvent));
      }
   }, [clickEvent]);

   function onClose(): void {
      setPMIsOpen(false);
      setTimeout(() => {
         setPMContent(<></>);
         setPMOpenerPos({ x: 0, y: 0 });
         setPMWidthPx(0);
         setPMHeightPx(0);
         setClickEvent({} as React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>);
      }, 250);
   }

   return (
      <>
         <PopupMenuContext.Provider
            value={{
               setPMIsOpen,
               setPMWidthPx,
               setPMHeightPx,
               setPMContent,
               setClickEvent,
            }}
         >
            {children}
         </PopupMenuContext.Provider>

         <PopupMenu
            openerPosition={pmOpenerPos}
            isOpen={pmIsOpen}
            content={pmContent}
            heightPx={pmHeightPx}
            widthPx={pmWidthPx}
            onClose={onClose}
         />
      </>
   );
}
