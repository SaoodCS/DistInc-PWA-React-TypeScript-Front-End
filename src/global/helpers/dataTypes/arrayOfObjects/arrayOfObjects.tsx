export default class ArrayOfObjects {
   static sort<T>(arr: T[], key: keyof T, descending?: boolean): T[] {
      if (descending) {
         return arr.sort((a, b) => {
            if (a[key] > b[key]) {
               return -1;
            }
            if (a[key] < b[key]) {
               return 1;
            }
            return 0;
         });
      }

      return arr.sort((a, b) => {
         if (a[key] < b[key]) {
            return -1;
         }
         if (a[key] > b[key]) {
            return 1;
         }
         return 0;
      });
   }

   static getObjWithKeyValuePair<T>(arr: T[], key: keyof T, value: T[keyof T]): T {
      return arr.find((obj) => obj[key] === value) as T;
   }
}
