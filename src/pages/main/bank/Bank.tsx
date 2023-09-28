import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useHeaderContext from '../context/header/hooks/useHeaderContext';
import useSetHeaderTitle from '../context/header/hooks/useSetHeaderTitle';

export default function Bank(): JSX.Element {
   useSetHeaderTitle('Bank');
   return (
      <>
         <div>Rendered when visiting &apos;/main/bank&apos;</div>
         <Outlet />
      </>
   );
}
