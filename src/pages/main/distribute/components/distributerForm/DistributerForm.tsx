import styled from 'styled-components';
import { StaticButton } from '../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import Color from '../../../../../global/css/colors';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useForm from '../../../../../global/hooks/useForm';
import CurrentClass from '../../../details/components/accounts/current/class/Class';
import DistributerClass from './class/DistributerClass';

interface ICalcSchema {
   distributer: {
      timestamp: string;
      msgs: string[];
   }[];
   savingsAccounts: {
      id: string;
      balance: number;
      timestamp: string;
   }[];
   calculations: {
      totalIncomes: number;
      totalExpenses: number;
      prevMonth: {
         totalSpendings: number;
         totalDisposableSpending: number;
         totalSavings: number;
      };
      timestamp: string;
   }[];
}

const FormWrapper = styled.div<{ isDarkTheme: boolean }>`
   border: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   margin: 1em;
   border-radius: 10px;
`;

export default function DistributeForm() {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const currentAccAsArr = ObjectOfObjects.convertToArrayOfObj(
      currentAccounts ? currentAccounts : {},
   );
   const dist = new DistributerClass(currentAccAsArr);
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      dist.form.initialState,
      dist.form.initialErrors,
      dist.form.validate,
   );

   if (!currentAccounts) return <></>;

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      // TODO: add the calculations functionality here and then the functionality to upload the calculations to firebase
   }

   return (
      <FormWrapper isDarkTheme={isDarkTheme}>
         <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
            {currentAccounts &&
               dist.form.inputs.map((input) => (
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
                  />
               ))}
            <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
               Distribute
            </StaticButton>
         </StyledForm>
      </FormWrapper>
   );
}
