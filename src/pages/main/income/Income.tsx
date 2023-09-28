import { useEffect } from 'react';
import useSetHeaderTitle from '../../../global/context/header/hooks/useSetHeaderTitle';

export default function Income(): JSX.Element {
   useSetHeaderTitle('Income');

   return (
      <div>
         <div>Income</div>
      </div>
   );
}
