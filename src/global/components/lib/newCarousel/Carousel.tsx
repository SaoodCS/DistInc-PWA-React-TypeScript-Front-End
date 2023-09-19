import { ReactNode } from "react";

interface ICarousel {
    children: ReactNode[];
    slideWidth: string;
    slideHeight: string;
}

export default function Carousel(props: ICarousel): JSX.Element {
    const { children, slideWidth, slideHeight } = props;

    

   return (
      <div>
         <div>Carousel</div>
      </div>
   );
}
