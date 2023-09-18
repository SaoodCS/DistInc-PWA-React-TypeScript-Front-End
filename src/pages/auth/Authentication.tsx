import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Logo from '../../global/components/app/logo/Logo';
import { StaticButton } from '../../global/components/lib/button/staticButton/Style';
import { DummyData } from '../../global/helpers/lib/dummyContent/dummyData';
import useThemeContext from '../../global/hooks/useThemeContext';
import Color from '../../global/styles/colors';
import InputComponent from '../../Input';
import {
   Centerer,
   Container,
   InputContainer,
   InputLabel,
   LogoContainer,
   ScrollNavigatorBtn,
   ScrollNavigatorContainer,
   Slide,
   StyledForm,
   TextInput,
} from './Style';

export default function Authentication(): JSX.Element {
   const containerRef = useRef<HTMLDivElement | null>(null);
   const [currentSlide, setCurrentSlide] = useState<number>(1);
   const { isDarkTheme } = useThemeContext();
   const [isActive, setIsActive] = useState(false);

   function handleFocus() {
      setIsActive(true);
   }

   function handleBlur() {
      setIsActive(false);
   }

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
      }
      containerRef.current?.addEventListener('scroll', handleScroll);
      return () => {
         containerRef.current?.removeEventListener('scroll', handleScroll);
      };
      
   }, []);

   return (
      <Centerer>
         <LogoContainer style = {{border:'1px solid black', borderRadius:'1em', boxShadow: Color.lightThm.boxShadow}}>
            <Logo size="8.5em" accentColor={Color.lightThm.accent} />
         </LogoContainer>
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
                  <StaticButton
                     isDarkTheme={isDarkTheme}
                     style={{ padding: '0.65em', textAlign: 'center', marginTop: '0.5em', }}
                  >
                     Sign Up
                  </StaticButton>
               </StyledForm>
            </Slide>
            <Slide height={'auto'}>
               <StyledForm style={{}}>
               <InputComponent placeholder="Email" />
               <InputComponent placeholder="Password" />
                  <StaticButton
                     isDarkTheme={isDarkTheme}
                     style={{ padding: '0.65em', textAlign: 'center', marginTop: '0.5em' }}
                  >
                     Sign Up
                  </StaticButton>
               </StyledForm>
            </Slide>
         </Container>
      </Centerer>
   );
}
