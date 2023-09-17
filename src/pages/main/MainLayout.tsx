import { Outlet } from 'react-router-dom';

export default function MainLayout(): JSX.Element {
   return (
      <>
         Rendered on every page in main (inc just &apos;/main&apos;) <Outlet />
      </>
   );
}
