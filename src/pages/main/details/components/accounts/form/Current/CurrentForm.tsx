import { Fragment } from 'react';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import DropDownInput, {
   IDropDownOption,
} from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../../global/components/lib/form/input/Input';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
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

   function dropDownOptions(data: ISavingsAccountFirebase | undefined): IDropDownOption[] {
      if (!data) return [];
      return Object.entries(data).map(([id, account]) => ({
         value: id,
         label: account.accountName,
      }));
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {CurrentFormClass.inputs.map((input) => (
            <Fragment key={input.id}>
               <ConditionalRender condition={!input.isDropDown} key={input.id}>
                  <InputComponent
                     placeholder={input.placeholder}
                     type={input.type}
                     name={input.name}
                     isRequired={input.isRequired}
                     autoComplete={input.autoComplete}
                     handleChange={handleChange}
                     value={form[input.name]}
                     error={errors[input.name]}
                     id={input.id}
                  />
               </ConditionalRender>
               <ConditionalRender condition={!!input.isDropDown} key={input.id}>
                  <DropDownInput
                     placeholder={input.placeholder}
                     name={input.name}
                     options={dropDownOptions(data)}
                     isRequired={input.isRequired}
                     error={errors[input.name]}
                     handleChange={handleChange}
                     id={input.id}
                  />
               </ConditionalRender>
            </Fragment>
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Add Account
         </StaticButton>
      </StyledForm>
   );
}
