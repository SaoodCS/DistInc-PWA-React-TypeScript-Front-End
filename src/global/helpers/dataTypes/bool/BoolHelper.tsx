export default class BoolHelper {
   static convert(value: 'true' | 'false'): boolean {
      return value === 'true';
   }
}
