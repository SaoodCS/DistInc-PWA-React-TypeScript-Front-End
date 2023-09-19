import { Github } from '@styled-icons/bootstrap/Github';
import { LinkedinWithCircle } from '@styled-icons/entypo-social/LinkedinWithCircle';
import { MailWithCircle } from '@styled-icons/entypo-social/MailWithCircle';
import Logo from '../../global/components/app/logo/Logo';
import { CarouselContainer, CarouselSlide } from '../../global/components/lib/newCarousel/Style';
import useCarousel from '../../global/components/lib/newCarousel/useCarousel';
import useThemeContext from '../../global/hooks/useThemeContext';
import LoginForm from './login/LoginForm';
import RegisterForm from './registration/RegisterForm';
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
   const { containerRef, currentSlide, scrollToSlide } = useCarousel(1);
   return (
      <Centerer>
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
                  <RegisterForm />
            </CarouselSlide>
            <CarouselSlide height={'auto'}>
               <LoginForm />
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
