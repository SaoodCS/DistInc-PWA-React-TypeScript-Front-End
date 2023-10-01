import { PersonDelete } from '@styled-icons/fluentui-system-filled/PersonDelete';
import { Restart } from '@styled-icons/remix-fill/Restart';
import { MailEdit } from 'styled-icons/fluentui-system-filled';
import { LockPassword } from 'styled-icons/remix-fill';
import { StyledIcon } from 'styled-icons/types';
import ChangeEmailForm from '../changeEmailForm/ChangeEmailForm';
import ChangePasswordForm from '../changePwdForm/ChangePwdForm';
import DeleteAccount from '../deleteAccount/DeleteAccount';
import ResetAccount from '../resetAccount/ResetAccount';

export interface IAccountMenuOptions {
   name: string;
   withMenuDots?: boolean;
   detailsContent?: boolean;
   warningItem?: boolean;
   dangerItem?: boolean;
   icon: StyledIcon;
   content: JSX.Element;
   heading: string;
}

export default class AccountClass {
   static menuOptions: IAccountMenuOptions[] = [
      {
         name: 'Email',
         withMenuDots: true,
         detailsContent: true,
         icon: MailEdit,
         content: <ChangeEmailForm />,
         heading: 'New Email',
      },
      {
         name: 'Password',
         withMenuDots: true,
         detailsContent: true,
         icon: LockPassword,
         content: <ChangePasswordForm />,
         heading: 'New Password',
      },
      {
         name: 'Reset Account',
         warningItem: true,
         icon: Restart,
         content: <ResetAccount />,
         heading: 'Reset Account',
      },
      {
         name: 'Delete Account',
         dangerItem: true,
         icon: PersonDelete,
         content: <DeleteAccount />,
         heading: 'Delete Account',
      },
   ];
}
