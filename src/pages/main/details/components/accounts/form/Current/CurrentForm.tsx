import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../../global/hooks/useForm';
import { ISavingsAccountFirebase, useSavingsAccounts } from '../../slide/AccountsSlide';
import CurrentFormClass from './Class';

export default function CurrentForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      CurrentFormClass.initialState,
      CurrentFormClass.initialErrors,
      CurrentFormClass.validate,
   );
   const { data } = useSavingsAccounts();

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      // if (!isFormValid) return;
   }

   function transferToInputOptions(data: ISavingsAccountFirebase | undefined): IDropDownOption[] {
      if (!data) return [];
      return Object.entries(data).map(([id, account]) => ({
         value: id,
         label: account.accountName,
      }));
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {CurrentFormClass.inputs.map((input) => (
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
               dropDownOptions={!!input.isDropDown ? transferToInputOptions(data) : undefined}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Add Account
         </StaticButton>
      </StyledForm>
   );
}
