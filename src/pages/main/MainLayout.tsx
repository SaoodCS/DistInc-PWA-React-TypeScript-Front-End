import { Outlet } from 'react-router-dom';
import { auth } from '../../global/firebase/config/config';

export default function MainLayout(): JSX.Element {
   async function handleSignOut(): Promise<void> {
      await auth.signOut();
   }

   return (
      <>
         Rendered on every page in main (inc just &apos;/main&apos;) <Outlet />
         <button onClick={handleSignOut}>Sign Out</button>
      </>
   );
}
