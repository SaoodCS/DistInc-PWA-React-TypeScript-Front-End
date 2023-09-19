import { Github } from '@styled-icons/bootstrap/Github';
import { LinkedinWithCircle } from '@styled-icons/entypo-social/LinkedinWithCircle';
import { MailWithCircle } from '@styled-icons/entypo-social/MailWithCircle';
import Logo from '../../global/components/app/logo/Logo';
import { StaticButton } from '../../global/components/lib/button/staticButton/Style';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import { StyledForm } from '../../global/components/lib/form/form/Style';
import InputComponent from '../../global/components/lib/form/input/Input';
import { CarouselContainer, CarouselSlide } from '../../global/components/lib/newCarousel/Style';
import useCarousel from '../../global/components/lib/newCarousel/useCarousel';
import useThemeContext from '../../global/hooks/useThemeContext';
import {
   Centerer,
   ContactFooterTitle,
   ContactFooterWrapper,
   contactIconStyle,
   ContactIconsWrapper,
   HeaderContainer,
   ScrollNavigatorBtn,
   ScrollNavigatorContainer,
} from './Style';

export default function Authentication(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { containerRef, currentSlide, setCurrentSlide, scrollToSlide } = useCarousel(1);

   return (
      <Centerer style={{}}>
         <HeaderContainer>
            <Logo size={'10em'} />
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
         </HeaderContainer>

         <CarouselContainer ref={containerRef} style={{ width: '20em' }}>
            <CarouselSlide height={'auto'}>
               <StyledForm>
                  <InputComponent placeholder="Email" />
                  <InputComponent placeholder="Password" />
                  <InputComponent placeholder="Confirm Password" />
                  <StaticButton isDarkTheme={isDarkTheme}>Sign Up</StaticButton>
               </StyledForm>
            </CarouselSlide>
            <CarouselSlide height={'auto'}>
               <StyledForm style={{ width: '100%' }}>
                  <InputComponent placeholder="Email" />
                  <InputComponent placeholder="Password" />
                  <StaticButton isDarkTheme={isDarkTheme}>Login</StaticButton>
                  <TextBtn
                     isDarkTheme={isDarkTheme}
                     style={{ display: 'flex', justifyContent: 'center', paddingTop: '2.25em' }}
                  >
                     Forgot Password?
                  </TextBtn>
               </StyledForm>
            </CarouselSlide>
         </CarouselContainer>
         <ContactFooterWrapper>
            <ContactFooterTitle>Contact Me</ContactFooterTitle>
            <ContactIconsWrapper>
               <Github style={contactIconStyle} />
               <LinkedinWithCircle style={contactIconStyle} />
               <MailWithCircle style={contactIconStyle} />
            </ContactIconsWrapper>
         </ContactFooterWrapper>
      </Centerer>
   );
}
