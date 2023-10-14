/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import type { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import useForm from '../../../../../../../global/hooks/useForm';
import SavingsClass from '../../savings/class/Class';
import type { ICurrentFormInputs } from '../class/Class';
import CurrentClass from '../class/Class';

interface ICurrentForm {
   inputValues?: ICurrentFormInputs;
}

export default function CurrentForm(props: ICurrentForm): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : CurrentClass.form.initialState,
      CurrentClass.form.initialErrors,
      CurrentClass.form.validate,
   );

   const queryClient = useQueryClient();
   const { data: savingsAccount } = SavingsClass.useQuery.getSavingsAccounts();

   const setCurrentAccountInFirestore = CurrentClass.useMutation.setCurrentAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCurrentAccount.name] });
      },
   });

   const deleteCurrentAccountInFirestore = CurrentClass.useMutation.delCurrentAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCurrentAccount.name] });
      },
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await setCurrentAccountInFirestore.mutateAsync(form);
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      await deleteCurrentAccountInFirestore.mutateAsync(form);
   }

   function dropDownOptions(
      input: (typeof CurrentClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return undefined;
      if (!savingsAccount) return [];
      if (!input.dropDownOptions) {
         return Object.entries(savingsAccount).map(([_, account]) => ({
            value: account.id,
            label: account.accountName,
         })) as IDropDownOption[];
      }
      return input.dropDownOptions;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {CurrentClass.form.inputs.map((input) => (
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
            {`${inputValues ? 'Update' : 'Add'} Account`}
         </StaticButton>
         <ConditionalRender condition={!!inputValues}>
            <StaticButton
               isDarkTheme={isDarkTheme}
               type={'button'}
               isDangerBtn
               onClick={(e) => handleDelete(e)}
            >
               Delete Account
            </StaticButton>
         </ConditionalRender>
      </StyledForm>
   );
}
