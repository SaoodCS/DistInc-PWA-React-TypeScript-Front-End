import { Outlet } from 'react-router-dom';

export default function AccountsLayout(): JSX.Element {
   return (
      <>
         <div>Rendered when visiting &apos;/main/accounts&apos;</div>
         <Outlet />
      </>
   );
}
