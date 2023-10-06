export default class NumberHelper {
   static minsToMs(mins: number): number {
      return mins * 60 * 1000;
   }
   static secsToMs(secs: number): number {
      return secs * 1000;
   }
   static hoursToMs(hours: number): number {
      return hours * 60 * 60 * 1000;
   }
}
