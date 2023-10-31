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

   static sumKeyValues<T>(arr: T[], key: keyof T): number {
      return arr.reduce((acc, curr) => acc + Number(curr[key]), 0);
   }

   static deleteDuplicates<T>(arr: T[], key: keyof T): T[] {
      return arr.filter((obj, index, self) => self.findIndex((o) => o[key] === obj[key]) === index);
   }

   static filterOut<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] !== value);
   }

   static filterIn<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] === value);
   }
}
