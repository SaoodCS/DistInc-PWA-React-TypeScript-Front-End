import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import APIHelper from '../../../../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import { useCustomMutation } from '../../../../../../../global/hooks/useCustomMutation';
import useForm from '../../../../../../../global/hooks/useForm';
import { useSavingsAccounts } from '../../slide/AccountsSlide';
import CurrentFormClass, { ICurrentFormInputs } from './Class';

interface ICurrentForm {
   inputValues: ICurrentFormInputs;
}

export default function CurrentForm(props: ICurrentForm): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : CurrentFormClass.initialState,
      CurrentFormClass.initialErrors,
      CurrentFormClass.validate,
   );
   const { data } = useSavingsAccounts();
   const queryClient = useQueryClient();

   const setCurrentAccountInFirestore = useCustomMutation(
      async (formData: ICurrentFormInputs) => {
         const body = APIHelper.createBody(formData);
         const method = 'POST';
         const microserviceName = microservices.setCurrentAccount.name;
         await APIHelper.gatewayCall(body, method, microserviceName);
      },
      {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getCurrentAccounts'] });
         },
      },
   );

   const deleteCurrentAccountInFirestore = useCustomMutation(
      async (formData: ICurrentFormInputs) => {
         const body = APIHelper.createBody({ id: formData.id });
         const method = 'POST';
         const microserviceName = microservices.deleteCurrentAccount.name;
         await APIHelper.gatewayCall(body, method, microserviceName);
      },
      {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getCurrentAccounts'] });
         },
      },
   );

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await setCurrentAccountInFirestore.mutateAsync(form);
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      await deleteCurrentAccountInFirestore.mutateAsync(form);
   }

   function dropDownOptions(input: (typeof CurrentFormClass.inputs)[0]) {
      if (!input.isDropDown) return undefined;
      if (!data) return [];
      if (!input.dropDownOptions) {
         return Object.entries(data).map(([id, account]) => ({
            value: id,
            label: account.accountName,
         })) as IDropDownOption[];
      }
      return input.dropDownOptions;
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
