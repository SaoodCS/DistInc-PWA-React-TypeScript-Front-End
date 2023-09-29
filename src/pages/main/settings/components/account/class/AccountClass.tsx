interface IMenuOptions {
   name: string;
   color?: string;
   withMenuDots?: boolean;
   detailsContent?: boolean;
}

export default class AccountClass {
   static menuOptions: IMenuOptions[] = [
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
         color: 'gold',
      },
      {
         name: 'Delete Account',
         color: 'red',
      },
   ];
}
