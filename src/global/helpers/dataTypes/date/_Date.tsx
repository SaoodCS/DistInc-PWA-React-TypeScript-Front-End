export namespace _Date {
   export namespace Obj {
      export function toDDMMYYYY(date: Date): string {
         let day: number | string = date.getDate();
         let month: number | string = date.getMonth() + 1;
         const year = date.getFullYear();
         if (day < 10) day = `0${day}`;
         if (month < 10) month = `0${month}`;
         return `${day}/${month}/${year}`;
      }
      export function formatAs(date: Date, formatType: 'dd/mm' | 'dd/mm/yyyy' | 'mm/yyyy'): string {
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
      export function getPrevMonthFirstDay(date: Date = new Date()): Date {
         const year = date.getFullYear();
         const month = date.getMonth();
         const previousMonthFirstDay = new Date(year, month - 1, 1);
         return previousMonthFirstDay;
      }
      export function getPrevMonthLastDay(date: Date = new Date()): Date {
         const year = date.getFullYear();
         const month = date.getMonth();
         const previousMonthLastDay = new Date(year, month, 0);
         return previousMonthLastDay;
      }

      export function getFirstOfNextMonth(): Date {
         return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
      }

      export function getCurrentMonthName(date: Date = new Date()): string {
         return date.toLocaleString('en-US', { month: 'short' });
      }
   }
   //
   export namespace DDMMYYYY {
      export function toDate(date: string): Date {
         const [day, month, year] = date.split('/');
         return new Date(Number(year), Number(month) - 1, Number(day));
      }

      export function toWord(date: string): string {
         const [day, month, year] = date.split('/');
         const monthAndYearConv = _Date.MMYYYY.toWord(`${month}/${year}`);
         return `${day} ${monthAndYearConv}`;
      }

      export function getMonthName(ddmmyyyy: string): string {
         const [day, month, year] = ddmmyyyy.split('/');
         const monthNumber = parseInt(month, 10);
         const dateConv = new Date(Number(year), monthNumber - 1, Number(day));
         const monthWord = dateConv.toLocaleString('default', { month: 'short' });
         return monthWord;
      }

      export function getPrevMonthName(ddmmyyyy: string): string {
         const [day, month, year] = ddmmyyyy.split('/');
         const monthNumber = parseInt(month, 10);
         const dateConv = new Date(Number(year), monthNumber - 2, Number(day));
         const monthWord = dateConv.toLocaleString('default', { month: 'short' });
         return monthWord;
      }

      export function getNextMonthName(ddmmyyyy: string): string {
         const [day, month, year] = ddmmyyyy.split('/');
         const monthNumber = parseInt(month, 10);
         const dateConv = new Date(Number(year), monthNumber, Number(day));
         const monthWord = dateConv.toLocaleString('default', { month: 'short' });
         return monthWord;
      }
   }
   //
   export namespace MMYYYY {
      export function toWord(date: string): string {
         const [month, year] = date.split('/');
         const monthNumber = parseInt(month, 10);
         const dateConv = new Date(Number(year), monthNumber - 1, 1);
         const monthWord = dateConv.toLocaleString('default', { month: 'short' });
         const yearWord = dateConv.toLocaleString('default', { year: 'numeric' });
         return `${monthWord} ${yearWord}`;
      }
   }
}

export default _Date;
