import { StyledCanvas, StyledCircle, StyledCross } from './Style';

interface ILogo {
   size: number;
}

export default function Logo(props: ILogo): JSX.Element {
   const { size } = props;
   return (
      <StyledCanvas sizePx={size}>
         <StyledCircle sizePx={size * (3 / 4)}>
            <StyledCircle sizePx={size * (2 / 4)}>
               <StyledCross sizepx={size / 6} />
            </StyledCircle>
         </StyledCircle>
      </StyledCanvas>
   );
}
