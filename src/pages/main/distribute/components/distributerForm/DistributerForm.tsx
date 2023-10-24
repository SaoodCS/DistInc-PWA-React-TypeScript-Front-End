import { StaticButton } from '../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useForm from '../../../../../global/hooks/useForm';
import IncomeClass from '../../../details/components/Income/class/Class';
import CurrentClass from '../../../details/components/accounts/current/class/Class';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';
import calculateDist from '../calculateDist';
import DistributerClass from './class/DistributerClass';

export default function DistributeForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: savingsAccount } = SavingsClass.useQuery.getSavingsAccounts();
   const { data: incomes } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();

   const currentAccAsArr = ObjectOfObjects.convertToArrayOfObj(
      currentAccounts ? currentAccounts : {},
   );
   const dist = new DistributerClass(currentAccAsArr);
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      dist.form.initialState,
      dist.form.initialErrors,
      dist.form.validate,
   );

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      const calculations = calculateDist(
         savingsAccount || {},
         currentAccounts || {},
         incomes || {},
         expenses || {},
         form,
      );
      // TODO: upload the calculations to firestore from here
   }

   return (
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
   );
}
