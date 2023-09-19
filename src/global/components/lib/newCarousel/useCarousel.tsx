import { useEffect, useRef, useState } from 'react';

interface IUseCarouselReturned {
   containerRef: React.RefObject<HTMLDivElement>;
   currentSlide: number;
   setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
   scrollToSlide: (slideNumber: number) => void;
   numberOfSlides: number | undefined;
}

export default function useCarousel(initialSlide: number): IUseCarouselReturned {
   const containerRef = useRef<HTMLDivElement>(null);
   const [currentSlide, setCurrentSlide] = useState(initialSlide);

   useEffect(() => {
      const handleScroll = () => {
         if (containerRef.current) {
            const currentSlide = Math.round(
               containerRef.current.scrollLeft / containerRef.current.offsetWidth,
            );
            setCurrentSlide(currentSlide + 1);
         }
      };
      containerRef.current?.addEventListener('scroll', handleScroll);
      return () => {
         containerRef.current?.removeEventListener('scroll', handleScroll);
      };
   }, []);

   const scrollToSlide = (slideNumber: number) => {
      if (containerRef.current) {
         containerRef.current.scrollTo({
            left: (slideNumber - 1) * containerRef.current.offsetWidth,
            behavior: 'smooth',
         });
      }
   };

   return {
      containerRef,
      currentSlide,
      setCurrentSlide,
      scrollToSlide,
      numberOfSlides: containerRef.current?.children.length,
   };
}
