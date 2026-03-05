import { CashStack as Dollar } from '@styled-icons/bootstrap/CashStack';
import { Receipt } from '@styled-icons/bootstrap/Receipt';
import Color from '../../../../global/css/colors';
import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { IIncomeFirebase } from '../../details/components/Income/class/Class';
import type { ICurrentAccountFirebase } from '../../details/components/accounts/current/class/Class';
import type { IExpensesFirebase } from '../../details/components/expense/class/ExpensesClass';
import CalculateDist from '../calculation/CalculateDist';
import DistFormAndAPI from '../components/form/class/DistFormAPI';
import type { ISavingsAccountFirebase } from '../../details/components/accounts/savings/class/Class';
import _Date from '../../../../global/helpers/dataTypes/date/_Date';

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
      totalDisposableIncome: number;
      incomeEarnings: {
         name: string;
         earned: number;
      }[];
      actualExpenses: number;
      totalMonthlyExpenses: number;
      timestamp: string;
   }

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
      export type IPreReqs = 'incomeExp' | 'spending' | 'income' | 'expense' | 'savings';
      export function checkPreReqsMet(
         currentAccounts: ICurrentAccountFirebase,
         savingsAccounts: ISavingsAccountFirebase,
         income: IIncomeFirebase,
         expenses: IExpensesFirebase,
      ): { name: IPreReqs; isValid: boolean }[] {
         const incomeExp = ObjectOfObjects.findObjFromUniqueVal(
            currentAccounts,
            'Income & Expenses',
         );
         const spendings = ObjectOfObjects.findObjFromUniqueVal(currentAccounts, 'Spending');
         const incomeExists = MiscHelper.isNotFalsyOrEmpty(income);
         const expensesExists = MiscHelper.isNotFalsyOrEmpty(expenses);
         const savingsExists = MiscHelper.isNotFalsyOrEmpty(savingsAccounts);
         return [
            { name: 'incomeExp', isValid: incomeExp ? true : false },
            { name: 'spending', isValid: spendings ? true : false },
            { name: 'savings', isValid: savingsExists },
            { name: 'income', isValid: incomeExists },
            { name: 'expense', isValid: expensesExists },
         ];
      }

      export function areAllPreReqMet(
         currentAccounts: ICurrentAccountFirebase,
         savingsAccounts: ISavingsAccountFirebase,
         income: IIncomeFirebase,
         expenses: IExpensesFirebase,
      ): boolean {
         const reqCheck = checkPreReqsMet(currentAccounts, savingsAccounts, income, expenses);
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
         const [, currentMonth, currentYear] = _Date.Obj.toDDMMYYYY(new Date()).split('/');
         const { analytics } = calcDistData;
         if (!MiscHelper.isNotFalsyOrEmpty(analytics)) return false;
         for (const analyticsObj of analytics) {
            const [, analyticsObjMonth, analyticsObjYear] = analyticsObj.timestamp.split('/');
            if (analyticsObjMonth === currentMonth && analyticsObjYear === currentYear) {
               return true;
            }
         }
         return false;
      }

      static hasToday(calcDistData: NDist.ISchema): boolean {
         if (ObjectOfObjects.isEmpty(calcDistData)) return false;
         const today = _Date.Obj.toDDMMYYYY(new Date());
         const { analytics } = calcDistData;
         if (!MiscHelper.isNotFalsyOrEmpty(analytics)) return false;
         for (const analyticsObj of analytics) {
            if (analyticsObj.timestamp === today) return true;
         }
         return false;
      }
   }

   export namespace Carousel {
      export type ISlide1Name = 'history';
      export type ISlide2NameOptions = keyof ISchema;
      export type ISlideNameOptions = ISlide1Name | ISlide2NameOptions;
      export type ISlide2DataOptions = ISchema[ISlide2NameOptions][0] | null;
      export type IAnalyticsDetails = {
         key: string;
         title: string;
         icon: JSX.Element;
         color: string;
         cardHeight: string;
         data: number;
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
                  title: 'Total Income (From Prev Month)',
                  icon: <Dollar height="90%" color={Color.lightThm.border} />,
                  color: isDarkTheme ? Color.lightThm.accent : Color.darkThm.accent,
                  data: analyticsItem.totalIncomes,
                  cardHeight: '6em',
               },
               {
                  key: 'actualExpenses',
                  title: 'Actual Expenses (From Prev Month)',
                  icon: <Receipt height="90%" color={Color.lightThm.border} />,
                  color: isDarkTheme ? Color.lightThm.warning : Color.darkThm.warning,
                  data: analyticsItem.actualExpenses,
                  cardHeight: '6em',
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
         return ArrayOfObjects.getObj(NDist.Carousel.slides, 'name', slideName)!.title;
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
