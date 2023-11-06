import { useState } from 'react';
import PopupMenu from '../../../components/lib/popupMenu/PopupMenu';
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

   function onClose(): void {
      setPMIsOpen(false);
      setTimeout(() => {
         setPMContent(<></>);
         setPMOpenerPos({ x: 0, y: 0 });
         setPMWidthPx(0);
         setPMHeightPx(0);
      }, 250);
   }

   return (
      <>
         <PopupMenuContext.Provider
            value={{
               setPMOpenerPos,
               setPMIsOpen,
               setPMWidthPx,
               setPMHeightPx,
               setPMContent,
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
