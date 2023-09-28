import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';

export default function Bank(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Bank');
   return (
      <>
         <div>Rendered when visiting &apos;/main/bank&apos;</div>
         <Outlet />
      </>
   );
}
