import Color from '../../../css/colors';
import { Card, CardStrip, LogoWrapper, RectContainer, RectOne, RectTwo } from './Style';

interface ILogo {
   size: string;
   bgColor?: string;
   cardColor?: string;
   detailsColor?: string;
}

export default function Logo(props: ILogo): JSX.Element {
   const { size, bgColor, cardColor, detailsColor } = props;
   const defaultBgColor = Color.darkThm.inactive;
   const defaultCardColor = Color.lightThm.inactive;
   return (
      <LogoWrapper size={size} accentColor={bgColor || defaultBgColor}>
         <Card size={size} cardColor={cardColor || defaultCardColor}>
            <CardStrip size={size} accentColor={detailsColor || defaultBgColor} />
            <RectContainer size={size}>
               <RectOne size={size} accentColor={detailsColor || defaultBgColor} />
               <RectTwo size={size} accentColor={detailsColor || defaultBgColor} />
            </RectContainer>
         </Card>
      </LogoWrapper>
   );
}

// original bg color: 'rgb(91, 116, 129)'
// original card color: 'white'
