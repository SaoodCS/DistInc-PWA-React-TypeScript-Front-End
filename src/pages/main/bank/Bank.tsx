import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useSetHeaderTitle from '../../../global/context/header/hooks/useSetHeaderTitle';

export default function Bank(): JSX.Element {
   useSetHeaderTitle('Bank');
   return (
      <>
         <div>Rendered when visiting &apos;/main/bank&apos;</div>
         <Outlet />
      </>
   );
}
