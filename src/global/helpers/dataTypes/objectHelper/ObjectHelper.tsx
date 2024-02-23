export default class ObjectHelper {
   static deepCopy<T>(obj: T): T {
      return JSON.parse(JSON.stringify(obj));
   }
}
