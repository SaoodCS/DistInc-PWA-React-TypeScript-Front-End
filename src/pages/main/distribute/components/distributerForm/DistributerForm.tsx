/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../global/components/lib/button/staticButton/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { StyledForm } from '../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../global/components/lib/form/inputCombination/InputCombination';
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
import CalculateDist from '../calculation/CalculateDist';
import DistributerClass from './class/DistributerClass';

export default function DistributeForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: savingsAccount } = SavingsClass.useQuery.getSavingsAccounts();
   const { data: incomes } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const { data: calcDistData } = DistributerClass.useQuery.getCalcDist();

   const currentAccAsArr = ObjectOfObjects.convertToArrayOfObj(
      currentAccounts ? currentAccounts : {},
   );
   const dist = new DistributerClass(currentAccAsArr);
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      dist.form.initialState,
      dist.form.initialErrors,
      dist.form.validate,
   );

   const queryClient = useQueryClient();
   const setCalcDistInFirestore = DistributerClass.useMutation.setCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
      },
   });

   function showOverwriteMsg(): boolean {
      if (!calcDistData) return false;
      if (DistributerClass.existingData.hasCurrentMonth(calcDistData)) return true;
      return false;
   }

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      const newCalculatedDist = CalculateDist.calculate(
         savingsAccount || {},
         currentAccounts || {},
         incomes || {},
         expenses || {},
         form,
      );
      await setCalcDistInFirestore.mutateAsync(newCalculatedDist);
   }

   return (
      <>
         <ConditionalRender condition={showOverwriteMsg()}>
            <TextColourizer
               color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
               fontSize="0.85em"
            >
               Continuing will overwrite the current month as it has already been distributed.
            </TextColourizer>
         </ConditionalRender>
         <StyledForm onSubmit={handleSubmit} apiError={apiError}>
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
