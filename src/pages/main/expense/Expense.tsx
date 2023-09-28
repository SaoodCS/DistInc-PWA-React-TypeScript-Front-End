import { useEffect } from 'react';
import useHeaderContext from '../context/header/hook/useHeaderContext';
import useSetHeaderTitle from '../context/header/hook/useSetHeaderTitle';

export default function Expense(): JSX.Element {
   useSetHeaderTitle('Expense');
   return (
      <div>
         <div>Expense</div>
      </div>
   );
}
