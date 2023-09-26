import { User } from '@styled-icons/boxicons-solid/User';
import { Settings } from '@styled-icons/fluentui-system-filled/Settings';
import { Receipt } from '@styled-icons/material-sharp/Receipt';
import { AttachMoney } from '@styled-icons/material/AttachMoney';
import { BuildingBank } from 'styled-icons/fluentui-system-filled';

export const navItems = [
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
 