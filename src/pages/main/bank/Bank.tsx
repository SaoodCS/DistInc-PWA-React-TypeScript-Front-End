import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useHeaderContext from '../context/header/hook/useHeaderContext';

export default function Bank(): JSX.Element {
   const { setHeaderTitle, setShowBackBtn, setHandleBackBtnClick } = useHeaderContext();

   useEffect(() => {
      setHeaderTitle('Bank');
   }, []);
   return (
      <>
         <div>Rendered when visiting &apos;/main/bank&apos;</div>
         <Outlet />
      </>
   );
}
