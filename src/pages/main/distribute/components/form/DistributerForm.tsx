/* eslint-disable @typescript-eslint/no-floating-promises */
import { Warning } from '@styled-icons/entypo/Warning';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StaticButton } from '../../../../../global/components/lib/button/staticButton/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { StyledForm } from '../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../global/components/lib/form/inputCombination/InputCombination';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import Color from '../../../../../global/css/colors';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useForm from '../../../../../global/hooks/useForm';
import IncomeClass from '../../../details/components/Income/class/Class';
import CurrentClass from '../../../details/components/accounts/current/class/Class';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import NDist from '../../namespace/NDist';
import CreditClass from '../../../details/components/accounts/credit/class/Class';

export default function DistributeForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: savingsAccount } = SavingsClass.useQuery.getSavingsAccounts();
   const { data: creditAccounts } = CreditClass.useQuery.getCreditAccounts();
   const { data: incomes } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const { data: calcDistData } = NDist.API.useQuery.getCalcDist();
   const [showOverwriteMsg, setShowOverwriteMsg] = useState(false);
   const currentAccAsArr = ObjectOfObjects.convertToArrayOfObj(
      currentAccounts ? currentAccounts : {},
   );
   const creditAccAsArr = ObjectOfObjects.convertToArrayOfObj(creditAccounts ? creditAccounts : {});
   const incomesAsArr = ObjectOfObjects.convertToArrayOfObj(incomes ? incomes : {});
   const dist = new NDist.FormBuilder(currentAccAsArr, creditAccAsArr, incomesAsArr);
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      dist.form.initialState,
      dist.form.initialErrors,
      dist.form.validate,
   );

   useEffect(() => {
      if (calcDistData) {
         const currentMonthIsDistributed = NDist.Data.hasCurrentMonth(calcDistData);
         setShowOverwriteMsg(currentMonthIsDistributed);
      }
   }, [calcDistData]);

   const queryClient = useQueryClient();
   const setCalcDistInFirestore = NDist.API.useMutation.setCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
      },
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      const distDate = new Date();
      const newCalculatedDist = NDist.Calc.run(
         distDate,
         savingsAccount || {},
         currentAccounts || {},
         creditAccounts || {},
         incomes || {},
         expenses || {},
         form,
      );
      await setCalcDistInFirestore.mutateAsync(newCalculatedDist);
      // NOTE: the new balance of each Savings Account after transfer is updated in the back-end microservice, in Data-Microservice/SetCalculations/endpoint/endpoint.ts //
   }

   return (
      <>
         <ConditionalRender condition={showOverwriteMsg}>
            <FlexRowWrapper
               padding="1.5em 1em 0em 1em"
               color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
            >
               <FlexColumnWrapper padding="0 0.5em 0 0">
                  <Warning
                     size={'1.5em'}
                     color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
                  />
               </FlexColumnWrapper>
               <TextColourizer
                  color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
                  fontSize="0.80em"
               >
                  Continuing overwrites current month because it has already been distributed.
               </TextColourizer>
            </FlexRowWrapper>
         </ConditionalRender>
         <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
            {currentAccounts &&
               dist.form.inputs.map((input) => (
                  <InputCombination
                     key={input.id}
                     placeholder={input.placeholder}
                     name={input.name}
                     isRequired={input.isRequired}
                     autoComplete={input.autoComplete}
                     handleChange={handleChange}
                     error={errors[input.name]}
                     id={input.id}
                     type={input.type}
                     value={form[input.name]}
                  />
               ))}
            <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
               Distribute
            </StaticButton>
         </StyledForm>
      </>
   );
}
