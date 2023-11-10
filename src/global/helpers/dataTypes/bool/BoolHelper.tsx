export namespace BoolHelper {
   export type IAsString = 'true' | 'false';

   export function convert(value: 'true' | 'false'): boolean {
      return value === 'true';
   }

   export function toString(value: boolean): IAsString {
      return value.toString() as IAsString;
   }
}

export default BoolHelper;
