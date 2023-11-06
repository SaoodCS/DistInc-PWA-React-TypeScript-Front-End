import { useContext } from 'react';
import { PopupMenuContext } from '../../../context/widget/popupMenu/PopupMenuContext';

export default function PopupMenuExample(): JSX.Element {
   const { setPMContent, setPMHeightPx, setPMIsOpen, setPMWidthPx, setClickEvent } =
      useContext(PopupMenuContext);

   function handleOpen(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      setPMIsOpen(true);
      setClickEvent(e);
      setPMWidthPx(100);
      setPMHeightPx(100);
      setPMContent(
         <div>
            <button onClick={() => setPMIsOpen(false)}>Close</button>
            <div>hello</div>
            <div>hello</div>
            <div>hello</div>
         </div>,
      );
   }
   return (
      <>
         <button
            onClick={(e) => handleOpen(e)}
            style={{ position: 'fixed', right: 100, bottom: 0 }}
         >
            Open
         </button>
      </>
   );
}