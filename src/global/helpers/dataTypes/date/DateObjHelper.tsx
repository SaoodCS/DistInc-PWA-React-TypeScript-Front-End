export default class DateObjHelper {
   static getPrevMonthFirstDay(date: Date = new Date()): Date {
      const year = date.getFullYear();
      const month = date.getMonth();
      const previousMonthFirstDay = new Date(year, month - 1, 1);
      return previousMonthFirstDay;
   }

   static getPrevMonthLastDay(date: Date = new Date()): Date {
      const year = date.getFullYear();
      const month = date.getMonth();
      const previousMonthLastDay = new Date(year, month, 0);
      return previousMonthLastDay;
   }

   static formatAs(date: Date, formatType: 'dd/mm' | 'dd/mm/yyyy' | 'mm/yyyy'): string {
      const d = date.getDate().toString().padStart(2, '0');
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const y = date.getFullYear().toString();
      const formats: Record<typeof formatType, string> = {
         'dd/mm': `${d}/${m}`,
         'dd/mm/yyyy': `${d}/${m}/${y}`,
         'mm/yyyy': `${m}/${y}`,
      };
      return formats[formatType];
   }

   static getCurrentMonthName(date: Date = new Date()): string {
      return date.toLocaleString('en-US', { month: 'short' });
   }
}
