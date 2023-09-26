import { Outlet } from 'react-router-dom';

export default function Bank(): JSX.Element {
   return (
      <>
         <div>Rendered when visiting &apos;/main/bank&apos;</div>
         <Outlet />
      </>
   );
}
