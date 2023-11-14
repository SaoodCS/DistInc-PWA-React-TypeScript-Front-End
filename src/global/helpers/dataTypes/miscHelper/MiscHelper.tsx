export default class MiscHelper {
   static isNotFalsyOrEmpty<T>(value: unknown): value is T {
      if (Array.isArray(value)) return value.length !== 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length !== 0;
      if (typeof value === 'string') return value !== '';
      return value !== null || value !== undefined;
   }
}
