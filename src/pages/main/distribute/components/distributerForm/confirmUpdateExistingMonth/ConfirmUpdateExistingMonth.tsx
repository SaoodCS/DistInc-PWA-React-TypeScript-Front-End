/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { TextBtn } from '../../../../../../global/components/lib/button/textBtn/Style';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { ModalFooterWrapper } from '../../../../../../global/components/lib/modal/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import IncomeClass from '../../../../details/components/Income/class/Class';
import CurrentClass from '../../../../details/components/accounts/current/class/Class';
import SavingsClass from '../../../../details/components/accounts/savings/class/Class';
import ExpensesClass from '../../../../details/components/expense/class/ExpensesClass';
import CalculateDist from '../../calculation/CalculateDist';
import DistributerClass from '../class/DistributerClass';

interface IConfirmUpdateExistingMonthProps {
   form: {
      [x: number]: number;
   };
}

export default function ConfirmUpdateExistingMonth(
   props: IConfirmUpdateExistingMonthProps,
): JSX.Element {
   const { form } = props;
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: savingsAccount } = SavingsClass.useQuery.getSavingsAccounts();
   const { data: incomes } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const { isDarkTheme } = useThemeContext();
   const queryClient = useQueryClient();

   const setCalcDistInFirestore = DistributerClass.useMutation.setCalcDist({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
      },
   });

   async function handleSubmit(): Promise<void> {
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
         <TextColourizer>Are you sure you want to update the existing month?</TextColourizer>
         <ModalFooterWrapper>
            <TextBtn onClick={() => handleSubmit()} isDarkTheme={isDarkTheme}>
               Update
            </TextBtn>
         </ModalFooterWrapper>
      </>
   );
}
