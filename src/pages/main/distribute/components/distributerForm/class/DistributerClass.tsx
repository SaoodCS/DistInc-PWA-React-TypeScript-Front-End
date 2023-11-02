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
import type { ICurrentFormInputs } from '../../../../details/components/accounts/current/class/Class';
import type { ICalcSchema } from '../../calculation/CalculateDist';

export default class DistributerClass {
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

   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
   get form() {
      return {
         inputs: this.inputs(),
         initialState: this.initialState(),
         initialErrors: this.initialErrors(),
         validate: this.validate.bind(this),
      };
   }

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
      options: UseMutationOptions<void, unknown, ICalcSchema>,
   ): UseMutationResult<void, unknown, ICalcSchema> {
      return useCustomMutation(
         async (calculatedData: ICalcSchema) => {
            const timestamp = calculatedData.analytics[0].timestamp;
            const body = APIHelper.createBody({ timestamp });
            const method = 'POST';
            const microserviceName = microservices.deleteCalculations.name;
            await APIHelper.gatewayCall(body, method, microserviceName);
         },
         {
            ...options,
         },
      );
   }

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

   static useQuery = {
      getCalcDist: DistributerClass.useCalcDistQuery,
   };

   static useMutation = {
      setCalcDist: DistributerClass.useSetCalcDistMutation,
      delCalcDist: DistributerClass.useDelCalcDistMutation,
   };
}
