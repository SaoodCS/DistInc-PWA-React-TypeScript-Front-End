/* eslint-disable no-plusplus */
export default class ObjectOfObjects {
   // When using this function, pass through the type/interface of the object you expect to be returned in the angular brackets
   public static findObjFromUniqueVal<T>(
      obj: { [key: string]: T | Record<string, unknown> },
      uniqueVal: unknown,
   ): T | undefined {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
         const key = keys[i];
         const value = obj[key];

         if (typeof value === 'object' && value !== null) {
            if (Object.values(value).includes(uniqueVal)) {
               return value as T;
            }
            const nestedResult = this.findObjFromUniqueVal(
               value as { [key: string]: T | Record<string, unknown> },
               uniqueVal,
            );
            if (nestedResult !== undefined) {
               return nestedResult as T;
            }
         }
      }
      return undefined;
   }

   static convertToArrayOfObj<T extends Record<string, T[keyof T]>>(obj: T): T[keyof T][] {
      return Object.keys(obj).map((key) => obj[key]);
   }
}
