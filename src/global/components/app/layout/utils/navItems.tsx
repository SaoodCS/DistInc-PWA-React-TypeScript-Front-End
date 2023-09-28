import { User } from '@styled-icons/boxicons-solid/User';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { SignOut } from '@styled-icons/fluentui-system-filled/SignOut';
import { Receipt } from '@styled-icons/material-sharp/Receipt';
import { AttachMoney } from '@styled-icons/material/AttachMoney';
import { BuildingBank } from 'styled-icons/fluentui-system-filled';

export default class NavItems {
   static footer = [
      {
         name: 'profile',
         icon: <User />,
      },
      {
         name: 'bank',
         icon: <BuildingBank />,
      },
      {
         name: 'income',
         icon: <AttachMoney />,
      },
      {
         name: 'expense',
         icon: <Receipt />,
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
