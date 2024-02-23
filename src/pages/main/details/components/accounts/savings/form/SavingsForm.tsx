/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import type { InputArray } from '../../../../../../../global/helpers/react/form/FormHelper';
import useForm from '../../../../../../../global/hooks/useForm';
import type { ISavingsFormInputs } from '../class/Class';
import SavingsClass, { YearlyExpSavingsAccForm } from '../class/Class';
import type { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import ArrayOfObjects from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { TextColourizer } from '../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import Color from '../../../../../../../global/css/colors';

interface ISavingsFormComponent {
   inputValues?: ISavingsFormInputs;
}

export default function SavingsForm(props: ISavingsFormComponent): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, setForm, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : SavingsClass.form.initialState,
      SavingsClass.form.initialErrors,
      SavingsClass.form.validate,
   );
   const {
      form: changeYearlyExpForm,
      errors: changeYearlyExpFormErrors,
      handleChange: changeYearlyExpHandleChange,
      initHandleSubmit: changeYearlyExpInitHandleSubmit,
   } = useForm(
      YearlyExpSavingsAccForm.form.initialState,
      YearlyExpSavingsAccForm.form.initialErrors,
      YearlyExpSavingsAccForm.form.validate,
   );
   const [displayYearlyExpForm, setDisplayYearlyExpForm] = useState(false);
   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const queryClient = useQueryClient();
   const [yearlyExpAccChangeWarningMsg, setYearlyExpAccChangeWarningMsg] = useState<
      string | undefined
   >();

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) {
         setForm((prev) => ({ ...prev, coversYearlyExpenses: 'true' }));
         return;
      }
      if (MiscHelper.isNotFalsyOrEmpty(inputValues)) {
         const savingsAccountArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         if (savingsAccountArr.length === 1) {
            setForm((prev) => ({ ...prev, coversYearlyExpenses: 'true' }));
         }
      }
   }, [inputValues, savingsAccounts]);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(inputValues)) {
         const isCoveringYearlyExpenses = inputValues.coversYearlyExpenses === 'true';
         const changedToCoverYearlyExpenses = form?.coversYearlyExpenses === 'true';
         const changedToNotCoverYearlyExpenses = form?.coversYearlyExpenses === 'false';
         if (!(isCoveringYearlyExpenses && changedToNotCoverYearlyExpenses)) {
            if (displayYearlyExpForm) setDisplayYearlyExpForm(false);
         }
         if (!(!isCoveringYearlyExpenses && changedToCoverYearlyExpenses)) {
            if (yearlyExpAccChangeWarningMsg) setYearlyExpAccChangeWarningMsg(undefined);
         }
         if (!isCoveringYearlyExpenses && changedToCoverYearlyExpenses) {
            const savingsAccountArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts || {});
            const accCoveringYearlyExpName = ArrayOfObjects.getObjWithKeyValuePair(
               savingsAccountArr,
               'coversYearlyExpenses',
               'true',
            ).accountName;
            const accBeingUpdatedName = form.accountName;
            const message = `You are about to change the account that covers yearly expenses from ${accCoveringYearlyExpName} to ${accBeingUpdatedName}`;
            setYearlyExpAccChangeWarningMsg(message);
         } else if (isCoveringYearlyExpenses && changedToNotCoverYearlyExpenses) {
            if (!displayYearlyExpForm) setDisplayYearlyExpForm(true);
         }
      }
   }, [inputValues, form?.coversYearlyExpenses]);

   useEffect(() => {
      const isNewAccountForm = !MiscHelper.isNotFalsyOrEmpty(inputValues);
      const savingsAccountsExist = MiscHelper.isNotFalsyOrEmpty(savingsAccounts);
      const changedToCoverYearlyExpenses = form?.coversYearlyExpenses === 'true';
      if (!(isNewAccountForm && changedToCoverYearlyExpenses && savingsAccountsExist)) {
         if (yearlyExpAccChangeWarningMsg) setYearlyExpAccChangeWarningMsg(undefined);
      }
      if (isNewAccountForm && changedToCoverYearlyExpenses && savingsAccountsExist) {
         const savingsAccountArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts || {});
         const accCoveringYearlyExpName = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccountArr,
            'coversYearlyExpenses',
            'true',
         ).accountName;
         const accBeingUpdatedName = form.accountName;
         const message = `You are about to change the account that covers yearly expenses from ${accCoveringYearlyExpName} to ${accBeingUpdatedName}`;
         setYearlyExpAccChangeWarningMsg(message);
      }
   }, [inputValues, savingsAccounts, form?.coversYearlyExpenses]);

   const setSavingAccountInFirestore = SavingsClass.useMutation.setSavingsAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });

   const delSavingAccountInFirestore = SavingsClass.useMutation.delSavingsAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getCurrentAccount.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getExpenses.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      const isNewAccountForm = !MiscHelper.isNotFalsyOrEmpty(inputValues);
      const isUpdateAccountForm = MiscHelper.isNotFalsyOrEmpty(inputValues);
      const savingsAccountsExist = MiscHelper.isNotFalsyOrEmpty(savingsAccounts);
      const changedToCoverYearlyExpenses = form?.coversYearlyExpenses === 'true';
      const changedToNotCoverYearlyExpenses = form?.coversYearlyExpenses === 'false';
      const isCoveringYearlyExpenses = inputValues?.coversYearlyExpenses === 'true';
      if (!savingsAccountsExist) {
         await setSavingAccountInFirestore.mutateAsync(form);
         return;
      }
      if (isNewAccountForm && !savingsAccountsExist) {
         await setSavingAccountInFirestore.mutateAsync(form);
         return;
      }
      if (isNewAccountForm && savingsAccountsExist) {
         if (!changedToCoverYearlyExpenses) {
            await setSavingAccountInFirestore.mutateAsync(form);
            return;
         }
         if (changedToCoverYearlyExpenses) {
            const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
            const accCoveringYearlyExp = ArrayOfObjects.getObjWithKeyValuePair(
               savingsAccAsArr,
               'coversYearlyExpenses',
               'true',
            );
            await Promise.all([
               setSavingAccountInFirestore.mutateAsync({
                  ...accCoveringYearlyExp,
                  coversYearlyExpenses: 'false',
               }),
               setSavingAccountInFirestore.mutateAsync(form),
            ]);
            return;
         }
      }
      if (isUpdateAccountForm) {
         const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         if (savingsAccAsArr.length === 1) {
            await setSavingAccountInFirestore.mutateAsync(form);
            return;
         }
         const coversYearlyExpensesHasNotChanged =
            form?.coversYearlyExpenses === inputValues?.coversYearlyExpenses;

         if (coversYearlyExpensesHasNotChanged) {
            await setSavingAccountInFirestore.mutateAsync(form);
            return;
         }

         if (!isCoveringYearlyExpenses && changedToCoverYearlyExpenses) {
            const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
            const accCoveringYearlyExp = ArrayOfObjects.getObjWithKeyValuePair(
               savingsAccAsArr,
               'coversYearlyExpenses',
               'true',
            );
            Promise.all([
               setSavingAccountInFirestore.mutateAsync({
                  ...accCoveringYearlyExp,
                  coversYearlyExpenses: 'false',
               }),
               setSavingAccountInFirestore.mutateAsync(form),
            ]);
            return;
         }
         if (isCoveringYearlyExpenses && changedToNotCoverYearlyExpenses) {
            const { isFormValid } = changeYearlyExpInitHandleSubmit(
               e as unknown as React.FormEvent<HTMLFormElement>,
            );
            if (!isFormValid) return;
            const accToCoverYearlyExpensesId = changeYearlyExpForm.selectedAccName;
            const savingsAccountArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
            const accToCoverYearlyExpenses = ArrayOfObjects.getObjWithKeyValuePair(
               savingsAccountArr,
               'id',
               accToCoverYearlyExpensesId,
            );
            await Promise.all([
               setSavingAccountInFirestore.mutateAsync({
                  ...accToCoverYearlyExpenses,
                  coversYearlyExpenses: 'true',
               }),
               setSavingAccountInFirestore.mutateAsync(form),
            ]);
            // return;
         }
      }
      //  await setSavingAccountInFirestore.mutateAsync(form);
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      if (MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) {
         const savingsAccountArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         if (savingsAccountArr.length === 1) {
            await delSavingAccountInFirestore.mutateAsync(form);
            return;
         }
         const isCoveringYearlyExpenses = inputValues?.coversYearlyExpenses === 'true';
         if (isCoveringYearlyExpenses) {
            if (!displayYearlyExpForm) setDisplayYearlyExpForm(true);
            const { isFormValid } = changeYearlyExpInitHandleSubmit(
               e as unknown as React.FormEvent<HTMLFormElement>,
            );
            if (!isFormValid) return;
            const accToCoverYearlyExpensesId = changeYearlyExpForm.selectedAccName;
            const savingsAccountArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
            const accToCoverYearlyExpenses = ArrayOfObjects.getObjWithKeyValuePair(
               savingsAccountArr,
               'id',
               accToCoverYearlyExpensesId,
            );
            await Promise.all([
               setSavingAccountInFirestore.mutateAsync({
                  ...accToCoverYearlyExpenses,
                  coversYearlyExpenses: 'true',
               }),
               delSavingAccountInFirestore.mutateAsync(form),
            ]);
         }
      }
   }

   function filteredInputs(): InputArray<ISavingsFormInputs> {
      if (!MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) {
         return SavingsClass.form.inputs.filter((input) => input.name !== 'coversYearlyExpenses');
      }
      if (MiscHelper.isNotFalsyOrEmpty(inputValues)) {
         const savingsAccountArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         if (savingsAccountArr.length === 1) {
            return SavingsClass.form.inputs.filter(
               (input) => input.name !== 'coversYearlyExpenses',
            );
         }
      }
      return SavingsClass.form.inputs;
   }

   function dropDownOptions(
      input: (typeof YearlyExpSavingsAccForm.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (input.name === 'selectedAccName') {
         if (!MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) return input.dropDownOptions;
         const dropDownOptions: IDropDownOption[] = [];
         Object.entries(savingsAccounts).forEach(([id, savingsAccount]) => {
            if (id !== inputValues?.id.toString()) {
               dropDownOptions.push({ value: id, label: savingsAccount.accountName });
            }
         });
         return dropDownOptions;
      }
      return undefined;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {filteredInputs().map((input) => (
            <InputCombination
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
               dropDownOptions={input.dropDownOptions}
            />
         ))}
         <ConditionalRender condition={displayYearlyExpForm}>
            {YearlyExpSavingsAccForm.form.inputs.map((input) => (
               <InputCombination
                  placeholder={input.placeholder}
                  type={input.type}
                  name={input.name}
                  isRequired={input.isRequired}
                  autoComplete={input.autoComplete}
                  handleChange={changeYearlyExpHandleChange}
                  value={changeYearlyExpForm[input.name]}
                  error={changeYearlyExpFormErrors[input.name]}
                  id={input.id}
                  key={input.id}
                  dropDownOptions={dropDownOptions(input)}
               />
            ))}
         </ConditionalRender>

         <ConditionalRender condition={yearlyExpAccChangeWarningMsg !== undefined}>
            <TextColourizer
               fontSize="0.75em"
               padding="0em 0em 1.25em 0em"
               bold
               color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
               style={{ fontStyle: 'italic' }}
            >
               {yearlyExpAccChangeWarningMsg}
            </TextColourizer>
         </ConditionalRender>

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
