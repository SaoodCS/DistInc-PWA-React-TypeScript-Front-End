/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import useForm from '../../../../../../global/hooks/useForm';
import type { IIncomeFormInputs } from '../class/Class';
import IncomeClass from '../class/Class';

interface IIncomeForm {
   inputValues?: IIncomeFormInputs;
}

export default function IncomeForm(props: IIncomeForm): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : IncomeClass.form.initialState,
      IncomeClass.form.initialErrors,
      IncomeClass.form.validate,
   );

   const queryClient = useQueryClient();
   const setIncomeInFirestore = IncomeClass.useMutation.setIncome({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getIncomes.name] });
      },
   });

   const deleteIncomeInFirestore = IncomeClass.useMutation.delIncome({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getIncomes.name] });
      },
   });
   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await setIncomeInFirestore.mutateAsync(form);
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      await deleteIncomeInFirestore.mutateAsync(form);
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {IncomeClass.form.inputs.map((input) => (
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
               dropDownOptions={input.dropDownOptions}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            {`${inputValues ? 'Update' : 'Add'} Income`}
         </StaticButton>
         <ConditionalRender condition={!!inputValues}>
            <StaticButton
               isDarkTheme={isDarkTheme}
               type={'button'}
               isDangerBtn
               onClick={(e) => handleDelete(e)}
            >
               Delete Income
            </StaticButton>
         </ConditionalRender>
      </StyledForm>
   );
}
