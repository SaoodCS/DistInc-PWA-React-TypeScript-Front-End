import Logo from '../../global/components/app/logo/Logo';
import { StaticButton } from '../../global/components/lib/button/staticButton/Style';
import Carousel from '../../global/components/lib/carousel/Carousel';
import useCarousel from '../../global/hooks/useCarousel';
import useThemeContext from '../../global/hooks/useThemeContext';
import {
   InputLabel,
   LogoContainer,
   ScrollNavigatorBtn,
   ScrollNavigatorContainer,
   ScrollNavigatorWrapper,
   SlideWrapper,
   StyledForm,
   StyledTextInput,
} from './Style';

export default function Authentication(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
   }
   const { carouselRef, handleGoToSlide, handleNext, handlePrev, setCurrentSlide, currentSlide } =
      useCarousel(1);

   return (
      <>
         <LogoContainer>
            <Logo size="8.5em" />
         </LogoContainer>
         <ScrollNavigatorWrapper>
            <ScrollNavigatorContainer>
               <ScrollNavigatorBtn onClick={() => handleGoToSlide(1)}>Sign Up</ScrollNavigatorBtn>
               <ScrollNavigatorBtn onClick={() => handleGoToSlide(2)}>Login</ScrollNavigatorBtn>
            </ScrollNavigatorContainer>
         </ScrollNavigatorWrapper>
         <Carousel ref={carouselRef} width={'100%'} height={'auto'}>
            <SlideWrapper>
               <StyledForm>
                  <InputLabel>Name</InputLabel>
                  <StyledTextInput />
                  <InputLabel>Email</InputLabel>
                  <StyledTextInput />
                  <InputLabel>Password</InputLabel>
                  <StyledTextInput />
                  <InputLabel>Confirm Password</InputLabel>
                  <StyledTextInput />
                  <StaticButton isDarkTheme={isDarkTheme}>Sign Up</StaticButton>
               </StyledForm>
            </SlideWrapper>

            <SlideWrapper>
               <StyledForm>
                  <InputLabel>Email</InputLabel>
                  <StyledTextInput />
                  <InputLabel>Password</InputLabel>
                  <StyledTextInput />
                  <StaticButton isDarkTheme={isDarkTheme}>Sign Up</StaticButton>
               </StyledForm>
            </SlideWrapper>
         </Carousel>
         {/* </ScreenCenterer> */}
      </>
   );
}
