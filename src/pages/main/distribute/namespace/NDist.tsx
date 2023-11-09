import DateHelper from '../../../../global/helpers/dataTypes/date/DateHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import { IIncomeFirebase } from '../../details/components/Income/class/Class';
import { ICurrentAccountFirebase } from '../../details/components/accounts/current/class/Class';
import { IExpensesFirebase } from '../../details/components/expense/class/ExpensesClass';
import CalculateDist from '../components/calculation/CalculateDist';

export namespace NDist {
   export interface IDistMsgs {
      timestamp: string;
      msgs: string[];
   }

   export interface ISavingsAccHist {
      id: number;
      balance: number;
      timestamp: string;
   }

   export interface IAnalytics {
      totalIncomes: number;
      totalExpenses: number;
      prevMonth: {
         totalSpendings: number;
         totalDisposableSpending: number;
         totalSavings: number;
      };
      timestamp: string;
   }

   export interface ISchema {
      distributer: IDistMsgs[];
      savingsAccHistory: ISavingsAccHist[];
      analytics: IAnalytics[];
   }

   export interface ISchemaByMonth {
      monthYear: string;
      analytics?: NDist.IAnalytics[];
      distributer?: NDist.IDistMsgs[];
      savingsAccHistory?: NDist.ISavingsAccHist[];
   }

   export namespace Calc {
      export type IPreReqs = 'salaryExp' | 'spending' | 'income' | 'expense';
      export function checkPreReqsMet(
         currentAccounts: ICurrentAccountFirebase,
         income: IIncomeFirebase,
         expenses: IExpensesFirebase,
      ): { name: IPreReqs; isValid: boolean }[] {
         const salaryExp = ObjectOfObjects.findObjFromUniqueVal(
            currentAccounts,
            'Salary & Expenses',
         );
         const spendings = ObjectOfObjects.findObjFromUniqueVal(currentAccounts, 'Spending');
         const incomeExists = !ObjectOfObjects.isEmpty(income);
         const expensesExists = !ObjectOfObjects.isEmpty(expenses);
         return [
            {
               name: 'salaryExp',
               isValid: salaryExp ? true : false,
            },
            {
               name: 'spending',
               isValid: spendings ? true : false,
            },
            {
               name: 'income',
               isValid: incomeExists,
            },
            {
               name: 'expense',
               isValid: expensesExists,
            },
         ];
      }

      export const run = CalculateDist.calculate;
   }

   export class Data {
      static groupByMonth(calcDistData: NDist.ISchema): NDist.ISchemaByMonth[] {
         const result: NDist.ISchemaByMonth[] = [];
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const months: { [key: string]: any } = {};
         ['analytics', 'distributer', 'savingsAccHistory'].forEach((key) => {
            calcDistData[key as keyof NDist.ISchema].forEach((item: { timestamp: string }) => {
               const monthYear = item.timestamp.slice(3);
               if (!months[monthYear]) {
                  months[monthYear] = { monthYear };
                  result.push(months[monthYear]);
               }
               if (!months[monthYear][key]) {
                  months[monthYear][key] = [];
               }
               months[monthYear][key].push(item);
            });
         });
         result.sort((a, b) => {
            const dateA = new Date(a.monthYear.split('/').reverse().join('/'));
            const dateB = new Date(b.monthYear.split('/').reverse().join('/'));
            return dateA.getTime() - dateB.getTime();
         });
         return result;
      }

      static hasCurrentMonth(calcDistData: NDist.ISchema): boolean {
         if (ObjectOfObjects.isEmpty(calcDistData)) return false;
         const currentMonth = DateHelper.toDDMMYYYY(new Date()).split('/')[1];
         const { analytics } = calcDistData;
         if (!analytics) return false;
         for (const analyticsObj of analytics) {
            const analyticsObjMonth = analyticsObj.timestamp.split('/')[1];
            if (analyticsObjMonth === currentMonth) return true;
         }
         return false;
      }
   }

   export namespace Carousel {
      export type ISlideName = keyof ISchema;

      const storageKeyPrefix = 'distributerCarousel';
      export const key = {
         currentSlide: `${storageKeyPrefix}.currentSlide`,
         slide2: `${storageKeyPrefix}.slide2`,
         detailsSlide: `${storageKeyPrefix}.detailsSlide`,
      };
   }

}

export default NDist;
