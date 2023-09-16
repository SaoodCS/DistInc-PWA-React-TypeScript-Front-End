import Color from '../../../styles/colors';
import { Card, CardStrip, LogoWrapper, RectContainer, RectOne, RectTwo } from './Style';

interface ILogo {
   size: string;
   accentColor?: string;
   cardColor?: string;
}

export default function Logo(props: ILogo): JSX.Element {
   const { size, accentColor, cardColor } = props;
   const defaultAccentColor = Color.darkThm.inactive;
   const defaultCardColor = Color.lightThm.inactive;
   return (
      <LogoWrapper size={size} accentColor={accentColor || defaultAccentColor}>
         <Card size={size} cardColor={cardColor || defaultCardColor}>
            <CardStrip size={size} accentColor={accentColor || defaultAccentColor} />
            <RectContainer size={size}>
               <RectOne size={size} accentColor={accentColor || defaultAccentColor} />
               <RectTwo size={size} accentColor={accentColor || defaultAccentColor} />
            </RectContainer>
         </Card>
      </LogoWrapper>
   );
}

// original bg color: 'rgb(91, 116, 129)'
// original card color: 'white'
