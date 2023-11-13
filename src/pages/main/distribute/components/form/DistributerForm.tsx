/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { StaticButton } from '../../../../../global/components/lib/button/staticButton/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { StyledForm } from '../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import { BannerContext } from '../../../../../global/context/widget/banner/BannerContext';
import Color from '../../../../../global/css/colors';
import microservices from '../../../../../global/firebase/apis/microservices/microservices';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useForm from '../../../../../global/hooks/useForm';
import IncomeClass from '../../../details/components/Income/class/Class';
import CurrentClass from '../../../details/components/accounts/current/class/Class';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import NDist from '../../namespace/NDist';

export default function DistributeForm(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { setShowBanner, setBannerMessage, setBannerZIndex, setHandleBannerClick, setBannerType } =
      useContext(BannerContext);
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: savingsAccount } = SavingsClass.useQuery.getSavingsAccounts();
   const { data: incomes } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const { data: calcDistData } = NDist.API.useQuery.getCalcDist();

   const currentAccAsArr = ObjectOfObjects.convertToArrayOfObj(
      currentAccounts ? currentAccounts : {},
   );
   const dist = new NDist.FormBuilder(currentAccAsArr);
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      dist.form.initialState,
      dist.form.initialErrors,
      dist.form.validate,
   );
   const isCurrentMonthDistributed = calcDistData && NDist.Data.hasCurrentMonth(calcDistData);

   useEffect(() => {
      if (isCurrentMonthDistributed && isPortableDevice) {
         setShowBanner(true);
         setBannerMessage(`Continuing overwrites current month as it's already distributed.`);
         setBannerType('warning');
         setHandleBannerClick(() => null);
         setBannerZIndex(99999);
      }
   }, []);

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
      const newCalculatedDist = NDist.Calc.run(
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
         <ConditionalRender condition={!!isCurrentMonthDistributed && !isPortableDevice}>
            <TextColourizer
               color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
               fontSize="0.85em"
            >
               Continuing overwrites current month because it has already been distributed.
            </TextColourizer>
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
