export default class NumberHelper {
   static minsToMilisecs(mins: number): number {
      return mins * 60 * 1000;
   }
   static secsToMilisecs(secs: number): number {
      return secs * 1000;
   }
   static hoursToMilisecs(hours: number): number {
      return hours * 60 * 60 * 1000;
   }
}
