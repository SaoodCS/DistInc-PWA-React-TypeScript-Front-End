/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import type { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../../global/hooks/useForm';
import type { ICreditFormInputs } from '../class/Class';
import CreditClass from '../class/Class';
import CurrentClass from '../../current/class/Class';

interface ICreditForm {
   inputValues?: ICreditFormInputs;
}

export default function CreditForm(props: ICreditForm): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : CreditClass.form.initialState,
      CreditClass.form.initialErrors,
      CreditClass.form.validate,
   );

   const queryClient = useQueryClient();
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();

   const setCreditAccountInFirestore = CreditClass.useMutation.setCreditAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getCreditAccount.name] });
      },
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await setCreditAccountInFirestore.mutateAsync(form);
   }

   function dropDownOptions(
      input: (typeof CreditClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return undefined;
      if (!MiscHelper.isNotFalsyOrEmpty(currentAccounts)) return [];
      if (!input.dropDownOptions) {
         // eslint-disable-next-line @typescript-eslint/naming-convention, unused-imports/no-unused-vars
         return Object.entries(currentAccounts).map(([_, account]) => ({
            value: account.id,
            label: account.accountName,
         })) as IDropDownOption[];
      }
      return input.dropDownOptions;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {CreditClass.form.inputs.map((input) => (
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
            {`Update Account`}
         </StaticButton>
      </StyledForm>
   );
}
