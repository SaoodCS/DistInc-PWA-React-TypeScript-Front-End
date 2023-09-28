/* eslint-disable @typescript-eslint/ban-types */
export default class FunctionHelper {
   static isNullFunction(f: Function): boolean {
      const isCallableNull = typeof f === 'function' && f.toString() === '() => null';
      const isNull = f === null;
      return isCallableNull || isNull;
   }
}
