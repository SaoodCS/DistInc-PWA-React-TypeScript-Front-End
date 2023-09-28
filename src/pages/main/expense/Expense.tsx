import { useEffect } from 'react';
import useSetHeaderTitle from '../../../global/context/header/hooks/useSetHeaderTitle';

export default function Expense(): JSX.Element {
   useSetHeaderTitle('Expense');
   return (
      <div>
         <div>Expense</div>
      </div>
   );
}
