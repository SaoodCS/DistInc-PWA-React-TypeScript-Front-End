import { DataFunnel } from '@styled-icons/fluentui-system-filled/DataFunnel';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { SignOut } from '@styled-icons/fluentui-system-filled/SignOut';
import { Dashboard } from '@styled-icons/material-rounded/Dashboard';
import { ChatHistory } from '@styled-icons/remix-fill/ChatHistory';

export namespace NavItems {
   export type IFooterNames = 'dashboard' | 'details' | 'distribute' | 'settings';
   interface IFooter {
      name: IFooterNames;
      icon: JSX.Element;
   }

   export const footer: IFooter[] = [
      {
         name: 'dashboard',
         icon: <Dashboard />,
      },
      {
         name: 'details',
         icon: <DataFunnel />,
      },
      {
         name: 'distribute',
         icon: <ChatHistory />,
      },
      {
         name: 'settings',
         icon: <Settings />,
      },
   ];

   export const sidebar = [
      ...NavItems.footer,
      {
         name: 'signout',
         icon: <SignOut />,
      },
   ];
}

export default NavItems;
