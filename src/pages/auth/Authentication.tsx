import { Github } from '@styled-icons/bootstrap/Github';
import { LinkedinWithCircle } from '@styled-icons/entypo-social/LinkedinWithCircle';
import { MailWithCircle } from '@styled-icons/entypo-social/MailWithCircle';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Logo from '../../global/components/app/logo/Logo';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import { CarouselContainer, CarouselSlide } from '../../global/components/lib/carousel/Carousel';
import useCarousel from '../../global/components/lib/carousel/hooks/useCarousel';
import { FlexCenterer } from '../../global/components/lib/positionModifiers/centerers/FlexCenterer';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import Color from '../../global/css/colors';
import { auth } from '../../global/firebase/config/config';
import { useCustomMutation } from '../../global/hooks/useCustomMutation';
import type { ILoginInputs } from './components/login/Class';
import LoginForm from './components/login/LoginForm';
import RegisterForm from './components/registration/RegisterForm';
import {
   Centerer,
   ContactFooterTitle,
   ContactFooterWrapper,
   ContactIconsWrapper,
   HeaderContainer,
   ScrollNavigatorBtn,
   ScrollNavigatorContainer,
} from './style/Style';

export default function Authentication(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { containerRef, currentSlide, scrollToSlide } = useCarousel(1);
   const bgColor = 'transparent';
   const cardColor = isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive;
   const detailsColor = isDarkTheme
      ? Color.setRgbOpacity(Color.lightThm.inactive, 0.8)
      : Color.darkThm.inactive;
   const loginUser = useCustomMutation(async (formData: ILoginInputs) => {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
   });

   async function handleLoginTestUser(
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ): Promise<void> {
      e.preventDefault();
      const email = import.meta.env.VITE_TEST_USER_EMAIL;
      const password = import.meta.env.VITE_TEST_USER_PASSWORD;
      if (!email || !password) {
         console.error('Test user credentials not found in .env file');
         return;
      }
      await loginUser.mutateAsync({
         email,
         password,
      });
   }

   function handleClick(to: 'github' | 'linkedin' | 'email'): void {
      window.open(
         to === 'github'
            ? 'https://github.com/SaoodCS'
            : to === 'linkedin'
            ? 'https://www.linkedin.com/in/saood-aslam/'
            : 'mailto:saood.aslam@hotmail.com',
      );
   }

   return (
      <Centerer>
         <HeaderContainer isDarkTheme={isDarkTheme}>
            <Logo
               size={'10em'}
               bgColor={bgColor}
               cardColor={cardColor}
               detailsColor={detailsColor}
            />
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
         <FlexCenterer height={'0em'} position="relative" width="20em">
            <TextBtn
               isDarkTheme={isDarkTheme}
               style={{ marginTop: '1%', fontSize: '0.8em' }}
               onClick={(e) => handleLoginTestUser(e)}
            >
               Login as Test User
            </TextBtn>
         </FlexCenterer>
         <ContactFooterWrapper>
            <ContactFooterTitle isDarkTheme={isDarkTheme}>Contact Me</ContactFooterTitle>
            <ContactIconsWrapper isDarkTheme={isDarkTheme}>
               <Github onClick={() => handleClick('github')} />
               <LinkedinWithCircle onClick={() => handleClick('linkedin')} />
               <MailWithCircle onClick={() => handleClick('email')} />
            </ContactIconsWrapper>
         </ContactFooterWrapper>
      </Centerer>
   );
}
