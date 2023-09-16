import { useEffect, useRef, useState } from 'react';

interface IUseCarouselReturned {
   carouselRef: React.RefObject<HTMLDivElement>;
   currentSlide: number;
   setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
   handleNext: () => void;
   handlePrev: () => void;
   handleGoToSlide: (slideNo: number) => void;
   numberOfSlides: number | undefined;
}

export default function useCarousel(initialSlide: number): IUseCarouselReturned {
   const carouselRef = useRef<HTMLDivElement>(null);
   const [currentSlide, setCurrentSlide] = useState(initialSlide);

   useEffect(() => {
      const handleScroll = (): void => {
         if (carouselRef.current) {
            const slideWidth = carouselRef.current.children[0].getBoundingClientRect().width;
            const currentSlide = Math.round(carouselRef.current.scrollLeft / slideWidth + 1);
            setCurrentSlide(currentSlide);
         }
      };
      if (carouselRef.current) {
         carouselRef.current.addEventListener('scroll', handleScroll);
      }
      return () => {
         if (carouselRef.current) {
            carouselRef.current.removeEventListener('scroll', handleScroll);
         }
      };
   }, []);

   const handleNext = (): void => {
      if (carouselRef.current) {
         carouselRef.current.scrollLeft += window.innerWidth;
      }
   };

   const handlePrev = (): void => {
      if (carouselRef.current) {
         carouselRef.current.scrollLeft -= window.innerWidth;
      }
   };

   const handleGoToSlide = (slideNo: number): void => {
      if (carouselRef.current) {
         carouselRef.current.scrollLeft = window.innerWidth * (slideNo - 1);
      }
   };

   return {
      carouselRef,
      currentSlide,
      setCurrentSlide,
      handleNext,
      handlePrev,
      handleGoToSlide,
      numberOfSlides: carouselRef.current?.children.length,
   };
}
