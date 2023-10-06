import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../../global/hooks/useForm';
import CurrentFormClass from './Class';

export default function CurrentForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      CurrentFormClass.initialState,
      CurrentFormClass.initialErrors,
      CurrentFormClass.validate,
   );

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      // if (!isFormValid) return;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {CurrentFormClass.inputs.map((input) => (
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
               key={input.id}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Add Account
         </StaticButton>
      </StyledForm>
   );
}
