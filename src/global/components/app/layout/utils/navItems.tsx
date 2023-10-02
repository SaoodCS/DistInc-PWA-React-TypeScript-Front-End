import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { SignOut } from '@styled-icons/fluentui-system-filled/SignOut';
import { DataFunnel } from '@styled-icons/fluentui-system-filled/DataFunnel';
import { Dashboard } from '@styled-icons/material-rounded/Dashboard';
import { ChatHistory } from '@styled-icons/remix-fill/ChatHistory';

export default class NavItems {
   static footer = [
      {
         name: 'dashboard',
         icon: <Dashboard />,
      },
      {
         name: 'details',
         icon: <DataFunnel />,
      },
      {
         name: 'history',
         icon: <ChatHistory />,
      },
      {
         name: 'settings',
         icon: <Settings />,
      },
   ];

   static sidebar = [
      ...NavItems.footer,
      {
         name: 'signout',
         icon: <SignOut />,
      },
   ];
}
