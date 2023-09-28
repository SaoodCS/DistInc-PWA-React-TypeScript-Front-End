import { useEffect } from 'react';
import useHeaderContext from '../context/header/hooks/useHeaderContext';
import useSetHeaderTitle from '../context/header/hooks/useSetHeaderTitle';

export default function Income(): JSX.Element {
   useSetHeaderTitle('Income');

   return (
      <div>
         <div>Income</div>
      </div>
   );
}
