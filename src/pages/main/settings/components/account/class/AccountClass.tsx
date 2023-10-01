import { PersonDelete } from '@styled-icons/fluentui-system-filled/PersonDelete';
import { Restart } from '@styled-icons/remix-fill/Restart';
import { MailEdit } from 'styled-icons/fluentui-system-filled';
import { LockPassword } from 'styled-icons/remix-fill';
import { StyledIcon } from 'styled-icons/types';

interface IAccountMenuOptions {
   name: string;
   withMenuDots?: boolean;
   detailsContent?: boolean;
   warningItem?: boolean;
   dangerItem?: boolean;
   icon: StyledIcon;
}

export default class AccountClass {
   static menuOptions: IAccountMenuOptions[] = [
      {
         name: 'Email',
         withMenuDots: true,
         detailsContent: true,
         icon: MailEdit,
      },
      {
         name: 'Password',
         withMenuDots: true,
         detailsContent: true,
         icon: LockPassword,
      },
      {
         name: 'Reset Account',
         warningItem: true,
         icon: Restart,
      },
      {
         name: 'Delete Account',
         dangerItem: true,
         icon: PersonDelete,
      },
   ];
}
