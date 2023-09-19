import { useEffect, useRef, useState } from 'react';
import { StaticButton } from '../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../global/components/lib/form/form/Style';
import InputComponent from '../../global/components/lib/form/input/Input';
import useThemeContext from '../../global/hooks/useThemeContext';
import {
   Centerer,
   Container,
   ScrollNavigatorBtn,
   ScrollNavigatorContainer,
   Slide,
} from './Style';

export default function Authentication(): JSX.Element {
   const containerRef = useRef<HTMLDivElement | null>(null);
   const [currentSlide, setCurrentSlide] = useState<number>(1);
   const { isDarkTheme } = useThemeContext();

   const scrollToSlide = (slideNumber: number) => {
      if (containerRef.current) {
         containerRef.current.scrollTo({
            left: (slideNumber - 1) * containerRef.current.offsetWidth,
            behavior: 'smooth',
         });
      }
   };

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

   return (
      <Centerer>
         <ScrollNavigatorContainer>
            <ScrollNavigatorBtn
               onClick={() => scrollToSlide(1)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 1}
               navTo={1}
            >
               Sign Up
            </ScrollNavigatorBtn>
            <ScrollNavigatorBtn
               onClick={() => scrollToSlide(2)}
               isDarkTheme={isDarkTheme}
               isActive={currentSlide === 2}
               navTo={2}
            >
               Login
            </ScrollNavigatorBtn>
         </ScrollNavigatorContainer>
         <Container ref={containerRef} style={{ width: '20em' }}>
            <Slide height={'auto'}>
               <StyledForm>
                  <InputComponent placeholder="Name" />
                  <InputComponent placeholder="Email" />
                  <InputComponent placeholder="Password" />
                  <InputComponent placeholder="Confirm Password" />
                  <StaticButton isDarkTheme={isDarkTheme}>Sign Up</StaticButton>
               </StyledForm>
            </Slide>
            <Slide height={'auto'}>
               <StyledForm style={{}}>
                  <InputComponent placeholder="Email" />
                  <InputComponent placeholder="Password" />
                  <StaticButton isDarkTheme={isDarkTheme}>Login</StaticButton>
               </StyledForm>
            </Slide>
         </Container>
      </Centerer>
   );
}
