import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../../global/components/lib/form/input/Input';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import useForm from '../../../../../../../global/hooks/useForm';
import SavingsClass, { ISavingsFormInputs } from '../class/Class';

interface ISavingsFormComponent {
   inputValues?: ISavingsFormInputs;
}

export default function SavingsForm(props: ISavingsFormComponent): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : SavingsClass.form.initialState,
      SavingsClass.form.initialErrors,
      SavingsClass.form.validate,
   );

   const queryClient = useQueryClient();

   const setSavingAccountInFirestore = SavingsClass.useMutation.setSavingsAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
      },
   });

   const delSavingAccountInFirestore = SavingsClass.useMutation.delSavingsAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
      },
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await setSavingAccountInFirestore.mutateAsync(form);
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      await delSavingAccountInFirestore.mutateAsync(form);
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {SavingsClass.form.inputs.map((input) => (
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
