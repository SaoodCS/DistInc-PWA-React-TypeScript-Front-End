import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import ObjectOfObjects from '../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../global/helpers/react/form/FormHelper';
import { useCustomMutation } from '../../../../../../global/hooks/useCustomMutation';
import type { IIncomeFirebase } from '../../../../details/components/Income/class/Class';
import type {
   ICurrentAccountFirebase,
   ICurrentFormInputs,
} from '../../../../details/components/accounts/current/class/Class';
import type { IExpensesFirebase } from '../../../../details/components/expense/class/ExpensesClass';
import type { ICalcSchema } from '../../calculation/CalculateDist';

// TODO: Change all instances of "DistributerClass" in project to DistFormAPI
export default class DistFormAPI {
   // -- FORM -- //
   constructor(currentAccounts: ICurrentFormInputs[]) {
      this.currentAccounts = currentAccounts;
   }

   private currentAccounts: ICurrentFormInputs[];

   private inputs(): InputArray<{ [x: number]: number }> {
      const mappedCurrentAccounts = this.currentAccounts.map((currentAccount) => {
         return {
            name: currentAccount.id,
            id: `leftovers-${currentAccount.accountName}`,
            placeholder: `${currentAccount.accountName} Leftover (Before Monthly Wage)`,
            type: 'number',
            isRequired: true,
            validator: (value: number): string | true => {
               if (typeof value !== 'number') return 'Leftover amount is required';
               if (value < 0) return 'Leftover amount cannot be negative';
               return true;
            },
         };
      });
      return mappedCurrentAccounts;
   }

   private initialState(): { [x: number]: number } {
      const inputs = this.inputs();
      const initialState = FormHelper.createInitialState(
         inputs as InputArray<{ [x: number]: number }>,
      );
      return initialState;
   }

   private initialErrors(): Record<number, string> {
      const inputs = this.inputs();
      const initialErrors = FormHelper.createInitialErrors(
         inputs as InputArray<{ [x: number]: number }>,
      );
      return initialErrors;
   }

   private validate(formValues: { [x: number]: number }): Record<number, string> {
      const inputs = this.inputs();
      const formValidation = FormHelper.validation(
         formValues,
         inputs as InputArray<{ [x: number]: number }>,
      );
      return formValidation;
   }

   get form(): {
      inputs: InputArray<{ [x: number]: number }>;
      initialState: { [x: number]: number };
      initialErrors: Record<number, string>;
      validate: (formValues: { [x: number]: number }) => Record<number, string>;
   } {
      return {
         inputs: this.inputs(),
         initialState: this.initialState(),
         initialErrors: this.initialErrors(),
         validate: this.validate.bind(this),
      };
   }

   // -- API QUERIES / MUTATIONS -- //
   private static useCalcDistQuery(
      options: UseQueryOptions<ICalcSchema> = {},
   ): UseQueryResult<ICalcSchema, unknown> {
      return useQuery({
         queryKey: [microservices.getCalculations.name],
         queryFn: () =>
            APIHelper.gatewayCall<ICalcSchema>(
               undefined,
               'GET',
               microservices.getCalculations.name,
            ),
         ...options,
      });
   }

   private static useSetCalcDistMutation(
      options: UseMutationOptions<void, unknown, ICalcSchema>,
   ): UseMutationResult<void, unknown, ICalcSchema> {
      return useCustomMutation(
         async (calculatedData: ICalcSchema) => {
            const body = APIHelper.createBody(calculatedData);
            const method = 'POST';
            const microserviceName = microservices.setCalculations.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   private static useDelCalcDistMutation(
      options: UseMutationOptions<void, unknown, IDelCalcDist>,
   ): UseMutationResult<void, unknown, IDelCalcDist> {
      return useCustomMutation(
         async (delCalcDistBody: IDelCalcDist) => {
            const body = APIHelper.createBody(delCalcDistBody);
            const method = 'POST';
            const microserviceName = microservices.deleteCalculations.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

   static useQuery = {
      getCalcDist: this.useCalcDistQuery,
   };

   static useMutation = {
      setCalcDist: this.useSetCalcDistMutation,
      delCalcDist: this.useDelCalcDistMutation,
   };

   static existingData = {
      hasCurrentMonth: (calcDistData: ICalcSchema): boolean => {
         if (ObjectOfObjects.isEmpty(calcDistData)) return false;
         const currentMonth = DateHelper.toDDMMYYYY(new Date()).split('/')[1];
         const { analytics } = calcDistData;
         if (!analytics) return false;
         for (const analyticsObj of analytics) {
            const analyticsObjMonth = analyticsObj.timestamp.split('/')[1];
            if (analyticsObjMonth === currentMonth) return true;
         }
         return false;
      },
   };

   static checkCalcReq(
      currentAccounts: ICurrentAccountFirebase,
      income: IIncomeFirebase,
      expenses: IExpensesFirebase,
   ): IReqMet[] {
      const salaryExp = ObjectOfObjects.findObjFromUniqueVal(currentAccounts, 'Salary & Expenses');
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

   static groupByMonth(calcDistData: ICalcSchema): ICalcSchemaGroupByMonth[] {
      const result: ICalcSchemaGroupByMonth[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const months: { [key: string]: any } = {};
      ['analytics', 'distributer', 'savingsAccHistory'].forEach((key) => {
         calcDistData[key as keyof ICalcSchema].forEach((item: { timestamp: string }) => {
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

   private static storageKeyPrefix = 'distributerCarousel';
   static key = {
      currentSlide: `${this.storageKeyPrefix}.currentSlide`,
      slide2: `${this.storageKeyPrefix}.slide2`,
      detailsSlide: `${this.storageKeyPrefix}.detailsSlide`,
   };
}

// -- TYPES FOR GROUPBYMONTH -- //
export interface ICalcSchemaGroupByMonth {
   monthYear: string;
   analytics?: ICalcSchema['analytics'];
   distributer?: ICalcSchema['distributer'];
   savingsAccHistory?: ICalcSchema['savingsAccHistory'];
}

// -- TYPES FOR CHECKCALCREQ -- //

export type IReqNames = 'salaryExp' | 'spending' | 'income' | 'expense';

interface IReqMet {
   name: IReqNames;
   isValid: boolean;
}

// -- TYPES FOR DELCALCDIST MUTATION: -- //

interface IDelCalcDistItem {
   type: 'analyticsItem' | 'distributerItem' | 'savingsAccHistoryItem';
   data:
      | ICalcSchema['analytics'][0]
      | ICalcSchema['distributer'][0]
      | ICalcSchema['savingsAccHistory'][0];
}

interface IDelCalcDistMonth {
   type: 'month';
   monthYear: string;
}

interface IDelCalcDistAllSavingsAccIdHistory {
   type: 'allSavingsAccIdHistory';
   savingsAccId: number;
}

type IDelCalcDist = IDelCalcDistItem | IDelCalcDistMonth | IDelCalcDistAllSavingsAccIdHistory;

// -- TYPES FOR CAROUSEL -- //
export type ICarouselSlides = 'analytics' | 'distribute' | 'savingsAccHistory';

// -- EXTRA TYPES -- //
export type IAnalyticsObj = ICalcSchema['analytics'][0];
export type IDistMsgsObj = ICalcSchema['distributer'][0];
export type ISavingsAccHistoryObj = ICalcSchema['savingsAccHistory'][0];

// -------------------------------------------------------------------------------------------- //

export namespace NDist {

   //TODO: replace all instances of IAnalyticsObj in the proj with NDist.IAnalytics
   //TODO: replace all instances of IDistMsgsObj in the proj with NDist.IDistMsgs
   //TODO: replace all instances of ISavingsAccHistoryObj in the proj with NDist.ISavingsAccHist
   //TODO: replace all instances of ICalcSchema['analytics'][0] with NDist.IAnalytics
   //TODO: replace all instances of ICalcSchema['distributer'][0] with NDist.IDistMsgs
   //TODO: replace all instances of ICalcSchema['savingsAccHistory'][0] with NDist.ISavingsAccHist

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

   //TODO: replace all instances of ICalcShema in the project with NDist.ICalcSchema
   export interface ICalcSchema {
      distributer: IDistMsgs[];
      savingsAccHistory: ISavingsAccHist[];
      analytics: IAnalytics[];
   }
}
