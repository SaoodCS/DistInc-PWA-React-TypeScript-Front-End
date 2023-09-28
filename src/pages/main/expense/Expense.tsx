import { useEffect } from 'react';
import useHeaderContext from '../context/header/hooks/useHeaderContext';
import useSetHeaderTitle from '../context/header/hooks/useSetHeaderTitle';

export default function Expense(): JSX.Element {
   useSetHeaderTitle('Expense');
   return (
      <div>
         <div>Expense</div>
      </div>
   );
}
