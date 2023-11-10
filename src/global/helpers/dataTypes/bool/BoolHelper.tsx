export namespace BoolHelper {
   export type asString = 'true' | 'false';

   export function convert(value: 'true' | 'false'): boolean {
      return value === 'true';
   }

   export function toString(value: boolean): asString {
      return value.toString() as asString;
   }
}

export default BoolHelper;