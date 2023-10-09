import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { IDropDownOption } from '../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import useForm from '../../../../../../global/hooks/useForm';
import SavingsClass from '../../accounts/savings/class/Class';
import ExpensesClass, { IExpenseFormInputs } from '../class/ExpensesClass';

interface IExpenseForm {
   inputValues?: IExpenseFormInputs;
}

export default function ExpenseForm(props: IExpenseForm): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : ExpensesClass.form.initialState,
      ExpensesClass.form.initialErrors,
      ExpensesClass.form.validate,
   );

   const queryClient = useQueryClient();
   const { data } = SavingsClass.useQuery.getSavingsAccounts();

   const setExpenseInFirestore = ExpensesClass.useMutation.setExpense({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getExpenses.name] });
      },
   });

   const delExpenseInFirestore = ExpensesClass.useMutation.delExpense({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getExpenses.name] });
      },
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await setExpenseInFirestore.mutateAsync(form);
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      await delExpenseInFirestore.mutateAsync(form);
   }

   function dropDownOptions(input: (typeof ExpensesClass.form.inputs)[0]) {
      if (!input.isDropDown) return undefined;
      if (!data) return [];
      if (input.name === 'expenseType') {
         let dropDownOptions: IDropDownOption[] = [];
         Object.entries(data).forEach(([id, savingsAccount]) => {
            dropDownOptions.push({
               value: `Savings Transfer:${id}`,
               label: `Savings Transfer: ${savingsAccount.accountName}`,
            });
         });
         input.dropDownOptions?.forEach((option) => {
            dropDownOptions.push(option);
         });
         return dropDownOptions;
      }
      return input.dropDownOptions;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {ExpensesClass.form.inputs.map((input) => (
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
               dropDownOptions={dropDownOptions(input)}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            {`${inputValues ? 'Update' : 'Add'} Expense`}
         </StaticButton>
         <ConditionalRender condition={!!inputValues}>
            <StaticButton
               isDarkTheme={isDarkTheme}
               type={'button'}
               isDangerBtn
               onClick={(e) => handleDelete(e)}
            >
               Delete Expense
            </StaticButton>
         </ConditionalRender>
      </StyledForm>
   );
}
