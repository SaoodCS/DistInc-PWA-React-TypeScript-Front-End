import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import { DocumentTextClock } from '@styled-icons/fluentui-system-filled/DocumentTextClock';
import Color from '../../../../global/css/colors';
import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../../global/helpers/dataTypes/date/DateHelper';
import MiscHelper from '../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../details/components/Income/class/Class';
import type { ICurrentAccountFirebase } from '../../details/components/accounts/current/class/Class';
import type { IExpensesFirebase } from '../../details/components/expense/class/ExpensesClass';
import CalculateDist from '../calculation/CalculateDist';
import DistFormAndAPI from '../components/form/class/DistFormAPI';

// export interface IDistMsgs {
//    timestamp: string;
//    msgs: string[];
// }

export namespace NDist {
   export interface IDistSteps {
      timestamp: string;
      list: string[];
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

   // export interface ISchema {
   //    distributer: IDistSteps[];
   //    savingsAccHistory: ISavingsAccHist[];
   //    analytics: IAnalytics[];
   // }

   export interface ISchema {
      distSteps: IDistSteps[];
      savingsAccHistory: ISavingsAccHist[];
      analytics: IAnalytics[];
   }

   export interface ISchemaByMonth {
      monthYear: string;
      analytics?: NDist.IAnalytics[];
      distSteps?: NDist.IDistSteps[];
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
         const incomeExists = MiscHelper.isNotFalsyOrEmpty(income);
         const expensesExists = MiscHelper.isNotFalsyOrEmpty(expenses);
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

      export function areAllPreReqMet(
         currentAccounts: ICurrentAccountFirebase,
         income: IIncomeFirebase,
         expenses: IExpensesFirebase,
      ): boolean {
         const reqCheck = checkPreReqsMet(currentAccounts, income, expenses);
         return ArrayOfObjects.doAllObjectsHaveKeyValuePair(reqCheck, 'isValid', true);
      }

      export const run = CalculateDist.calculate;
   }

   export class Data {
      static groupByMonth(calcDistData: NDist.ISchema): NDist.ISchemaByMonth[] {
         const result: NDist.ISchemaByMonth[] = [];
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const months: { [key: string]: any } = {};
         ['analytics', 'distSteps', 'savingsAccHistory'].forEach((key) => {
            const data = calcDistData[key as keyof NDist.ISchema] || [];
            data.forEach((item: { timestamp: string }) => {
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
         if (!MiscHelper.isNotFalsyOrEmpty(analytics)) return false;
         for (const analyticsObj of analytics) {
            const analyticsObjMonth = analyticsObj.timestamp.split('/')[1];
            if (analyticsObjMonth === currentMonth) return true;
         }
         return false;
      }
   }

   export namespace Carousel {
      export type ISlide1Name = 'history';
      export type ISlide2NameOptions = keyof ISchema;
      export type ISlideNameOptions = ISlide1Name | ISlide2NameOptions;
      export type ISlide2DataOptions = ISchema[ISlide2NameOptions][0] | null;
      export type IPrevMonthData = {
         key: string;
         data: number;
         title: string;
      };
      export type IAnalyticsDetails = {
         key: string;
         title: string;
         icon: JSX.Element;
         color: string;
         cardHeight: string;
         data: number | IPrevMonthData[];
      };

      export type IMapArrFunc = (
         analyticsItem: NDist.IAnalytics,
         isDarkTheme: boolean,
      ) => IAnalyticsDetails[];

      export interface ISlides {
         name: ISlide1Name | ISlide2NameOptions;
         title: string;
         slideNo: number;
         mapArr?: IAnalyticsDetails[] | IMapArrFunc;
      }

      export const slides: ISlides[] = [
         {
            name: 'history',
            title: 'Distribution History',
            slideNo: 1,
         },
         {
            name: 'analytics',
            title: 'Analytics History',
            slideNo: 2,
            mapArr: (
               analyticsItem: NDist.IAnalytics,
               isDarkTheme: boolean,
            ): IAnalyticsDetails[] => [
               {
                  key: 'totalIncomes',
                  title: 'Total Income',
                  icon: <Dollar height="90%" color={Color.lightThm.border} />,
                  color: isDarkTheme ? Color.lightThm.accent : Color.darkThm.accent,
                  data: analyticsItem.totalIncomes,
                  cardHeight: '6em',
               },
               {
                  key: 'totalExpenses',
                  title: 'Total Expense',
                  icon: <Receipt height="90%" color={Color.lightThm.border} />,
                  color: isDarkTheme ? Color.lightThm.warning : Color.darkThm.warning,
                  data: analyticsItem.totalExpenses,
                  cardHeight: '6em',
               },
               {
                  key: 'prevMonth',
                  title: `Prev Month: ${DateHelper.getPrevMonthName(analyticsItem.timestamp)}`,
                  icon: <DocumentTextClock height="70%" color={Color.lightThm.border} />,
                  color: Color.lightThm.error,
                  cardHeight: '9em',
                  data: [
                     {
                        key: 'totalSpendings',
                        data: analyticsItem.prevMonth.totalSpendings,
                        title: 'Total Spent: ',
                     },
                     {
                        key: 'totalDisposableSpending',
                        data: analyticsItem.prevMonth.totalDisposableSpending,
                        title: 'Disposable Spent: ',
                     },
                     {
                        key: 'totalSavings',
                        data: analyticsItem.prevMonth.totalSavings,
                        title: 'Total Saved: ',
                     },
                  ],
               },
            ],
         },
         {
            name: 'distSteps',
            title: 'Distribution Steps History',
            slideNo: 2,
         },
         {
            name: 'savingsAccHistory',
            title: 'Savings Account History',
            slideNo: 2,
         },
      ];
      const storageKeyPrefix = 'distributerCarousel';
      export const key = {
         currentSlideNo: `${storageKeyPrefix}.currentSlideNo`,
         historySlideScrollSaver: `${storageKeyPrefix}.historySlide`,
         currentSlideName: `${storageKeyPrefix}.currentSlideName`,
         slide2Data: `${storageKeyPrefix}.slide2Data`,
         distStepsCompleted: `${storageKeyPrefix}.slide2DistStepsCompleted`,
      };

      export function getSlideTitle(slideName: ISlide1Name | ISlide2NameOptions): string {
         return ArrayOfObjects.getObjWithKeyValuePair(NDist.Carousel.slides, 'name', slideName)
            .title;
      }
   }

   export class Filterer {
      static key = 'filterOutHistory';
      static filterOptions = ArrayOfObjects.filterOut(Carousel.slides, 'name', 'history');
   }

   export const API = {
      useQuery: DistFormAndAPI.useQuery,
      useMutation: DistFormAndAPI.useMutation,
   };

   export const FormBuilder = DistFormAndAPI;
}

export default NDist;
