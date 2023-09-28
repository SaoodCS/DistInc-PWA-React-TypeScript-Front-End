import { useEffect } from 'react';
import useHeaderContext from '../context/header/hook/useHeaderContext';

export default function Expense(): JSX.Element {
   const { setHeaderTitle, setShowBackBtn, setHandleBackBtnClick } = useHeaderContext();

   useEffect(() => {
      setHeaderTitle('Expense');
   }, []);
   return (
      <div>
         <div>Expense</div>
      </div>
   );
}
