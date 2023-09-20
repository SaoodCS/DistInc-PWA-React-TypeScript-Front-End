import { useEffect, useRef } from 'react';

export default function useScrollSaver(storageId: string) {

   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (containerRef) {
         const scrollPos = sessionStorage.getItem(`${storageId}.scrollPos`);
         if (scrollPos && containerRef.current) {
            containerRef.current.scrollTop = parseInt(scrollPos);
         }
      }
   }, [containerRef.current]);

   function handleOnScroll() {
      if (containerRef.current) {
         const scrollPos = containerRef.current.scrollTop;
         sessionStorage.setItem(`${storageId}.scrollPos`, scrollPos.toString());
      }
   }

   function scrollToTop() {
      sessionStorage.setItem(`${storageId}.scrollPos`, "0");
      if (containerRef.current) {
         containerRef.current.scrollTop = 0; 
      }
   }

   const scrollSaverStyle = {
      overflow: 'scroll',
   }

   return {
      containerRef,
      handleOnScroll,
      scrollToTop,
      scrollSaverStyle,
   }
}
