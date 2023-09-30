interface IAccountMenuOptions {
   name: string;
   withMenuDots?: boolean;
   detailsContent?: boolean;
   warningItem?: boolean;
   dangerItem?: boolean;
}

export default class AccountClass {
   static menuOptions: IAccountMenuOptions[] = [
      {
         name: 'Email',
         withMenuDots: true,
         detailsContent: true,
      },
      {
         name: 'Password',
         withMenuDots: true,
         detailsContent: true,
      },
      {
         name: 'Reset Account',
         warningItem: true,
      },
      {
         name: 'Delete Account',
         dangerItem: true,
      },
   ];
}
