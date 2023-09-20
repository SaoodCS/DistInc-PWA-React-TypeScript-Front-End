import { useEffect, useRef } from 'react';

interface IUseScrollSaverReturned {
   containerRef: React.RefObject<HTMLDivElement>;
   handleOnScroll: () => void;
   scrollToTop: () => void;
   scrollSaverStyle: React.CSSProperties;
}

export default function useScrollSaver(storageId: string): IUseScrollSaverReturned {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (containerRef) {
         const scrollPos = sessionStorage.getItem(`${storageId}.scrollPos`);
         if (scrollPos && containerRef.current) {
            containerRef.current.scrollTop = parseInt(scrollPos);
         }
      }
   }, [containerRef.current]);

   function handleOnScroll(): void {
      if (containerRef.current) {
         const scrollPos = containerRef.current.scrollTop;
         sessionStorage.setItem(`${storageId}.scrollPos`, scrollPos.toString());
      }
   }

   function scrollToTop(): void {
      sessionStorage.setItem(`${storageId}.scrollPos`, '0');
      if (containerRef.current) {
         containerRef.current.scrollTop = 0;
      }
   }

   const scrollSaverStyle = {
      overflow: 'scroll',
   };

   return {
      containerRef,
      handleOnScroll,
      scrollToTop,
      scrollSaverStyle,
   };
}
