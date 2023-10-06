import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import APIHelper from '../../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import { useCustomMutation } from '../../../../../../../global/hooks/useCustomMutation';
import useForm from '../../../../../../../global/hooks/useForm';
import SavingsFormClass, { ISavingsFormInputs } from './Class';

export default function SavingsForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit, setForm } = useForm(
      SavingsFormClass.initialState,
      SavingsFormClass.initialErrors,
      SavingsFormClass.validate,
   );
   const setSavingAccountInFirestore = useCustomMutation(async (formData: ISavingsFormInputs) => {
      const body = APIHelper.createBody(formData);
      const method = 'POST';
      const microserviceName = microservices.setSavingsAccount.name;
      await APIHelper.gatewayCall(body, method, microserviceName);
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      console.log(form);
      if (!isFormValid) return;
      await setSavingAccountInFirestore.mutateAsync(form);
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {SavingsFormClass.inputs.map((input) => (
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
