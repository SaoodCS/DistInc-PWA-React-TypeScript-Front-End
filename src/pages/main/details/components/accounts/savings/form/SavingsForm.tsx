/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import { TextColourizer } from '../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import type { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import Color from '../../../../../../../global/css/colors';
import microservices from '../../../../../../../global/firebase/apis/microservices/microservices';
import ArrayOfObjects from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import useForm from '../../../../../../../global/hooks/useForm';
import type { ISavingsFormInputs } from '../class/Class';
import SavingsClass, { CoversShortfallSavingsAccForm } from '../class/Class';

interface ISavingsFormComponent {
   inputValues?: ISavingsFormInputs;
}

const SHORTFALL_CHANGE_MSG =
   'You will be changing the savings account that covers shortfall to this account';

export default function SavingsForm(props: ISavingsFormComponent): JSX.Element {
   const { inputValues } = props;
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const savingsAccArr = useMemo(
      () => ObjectOfObjects.convertToArrayOfObj(savingsAccounts || {}),
      [savingsAccounts],
   );
   const queryClient = useQueryClient();
   const setSavingAccInFS = SavingsClass.useMutation.setSavingsAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });
   const delSavingAccInFS = SavingsClass.useMutation.delSavingsAccount({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getSavingsAccount.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getCurrentAccount.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getExpenses.name] });
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
      },
   });
   ////
   const { form, setForm, errors, handleChange, initHandleSubmit } = useForm(
      inputValues ? inputValues : SavingsClass.form.initialState,
      SavingsClass.form.initialErrors,
      SavingsClass.form.validate,
   );
   /////
   const {
      form: changeShortfallToDiffAccForm,
      errors: changeShortfallToDiffAccFormErrors,
      handleChange: changeShortfallToDiffAccHandleChange,
      initHandleSubmit: changeShortfallToDiffAccInitHandleSubmit,
   } = useForm(
      CoversShortfallSavingsAccForm.form.initialState,
      CoversShortfallSavingsAccForm.form.initialErrors,
      CoversShortfallSavingsAccForm.form.validate,
   );
   const [showChangeShortfallToDiffAccForm, setShowChangeShortfallToDiffAccForm] = useState(false);
   const [changeShortfallToThisAccMsg, setChangeShortfallToThisAccMsg] = useState<string>();
   const [disabledFields, setDisabledFields] = useState<(keyof ISavingsFormInputs)[]>([]);

   useEffect(() => {
      const noOfExistingAcc = savingsAccArr.length;
      const isNewAcc = !MiscHelper.isNotFalsyOrEmpty(inputValues);
      if (isNewAcc) {
         if (noOfExistingAcc < 1) {
            setForm((prev) => ({ ...prev, coversShortfall: 'true' }));
            setDisabledFields(['coversShortfall']);
            return;
         }
         if (form.coversShortfall === 'true') setChangeShortfallToThisAccMsg(SHORTFALL_CHANGE_MSG);
         else setChangeShortfallToThisAccMsg('');
         return;
      }
      if (noOfExistingAcc <= 1) {
         setForm((prev) => ({ ...prev, coversShortfall: 'true' }));
         setDisabledFields(['coversShortfall']);
         return;
      }
      if (inputValues.coversShortfall === form.coversShortfall) {
         setShowChangeShortfallToDiffAccForm(false);
         setChangeShortfallToThisAccMsg(undefined);
         return;
      }
      if (form.coversShortfall === 'false') setShowChangeShortfallToDiffAccForm(true);
      else setChangeShortfallToThisAccMsg(SHORTFALL_CHANGE_MSG);
   }, [inputValues, savingsAccounts, form?.coversShortfall]);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (showChangeShortfallToDiffAccForm) {
         const { isFormValid } = changeShortfallToDiffAccInitHandleSubmit(e);
         if (!isFormValid) return;
         const accToCoverShortfall = ArrayOfObjects.getObj(
            savingsAccArr,
            'id',
            changeShortfallToDiffAccForm.selectedAccName,
         )!;
         await Promise.all([
            setSavingAccInFS.mutateAsync({ ...accToCoverShortfall, coversShortfall: 'true' }),
            setSavingAccInFS.mutateAsync(form),
         ]);
         return;
      }
      if (MiscHelper.isNotFalsyOrEmpty(changeShortfallToThisAccMsg)) {
         const prevCoveringShortfall = ArrayOfObjects.getObj(
            savingsAccArr,
            'coversShortfall',
            'true',
         )!;
         await Promise.all([
            setSavingAccInFS.mutateAsync({ ...prevCoveringShortfall, coversShortfall: 'false' }),
            setSavingAccInFS.mutateAsync(form),
         ]);
         return;
      }
      await setSavingAccInFS.mutateAsync(form);
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      if (!MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) return;
      const isCoveringShortfall = inputValues?.coversShortfall === 'true';
      if (savingsAccArr.length === 1 || !isCoveringShortfall) {
         await delSavingAccInFS.mutateAsync(form);
         return;
      }
      if (!showChangeShortfallToDiffAccForm) setShowChangeShortfallToDiffAccForm(true);
      const { isFormValid } = changeShortfallToDiffAccInitHandleSubmit(
         e as unknown as React.FormEvent<HTMLFormElement>,
      );
      if (!isFormValid) return;
      const accToCoverShortfallId = changeShortfallToDiffAccForm.selectedAccName;
      const accToCoverShortfall = ArrayOfObjects.getObj(
         savingsAccArr,
         'id',
         accToCoverShortfallId,
      )!;
      await Promise.all([
         setSavingAccInFS.mutateAsync({
            ...accToCoverShortfall,
            coversShortfall: 'true',
         }),
         delSavingAccInFS.mutateAsync(form),
      ]);
   }

   function dropDownOptions(
      input: (typeof CoversShortfallSavingsAccForm.form.inputs)[0],
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
         {SavingsClass.form.inputs.map((input) => (
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
               isDisabled={disabledFields.includes(input.name)}
            />
         ))}
         <ConditionalRender condition={showChangeShortfallToDiffAccForm}>
            {CoversShortfallSavingsAccForm.form.inputs.map((input) => (
               <InputCombination
                  placeholder={input.placeholder}
                  type={input.type}
                  name={input.name}
                  isRequired={input.isRequired}
                  autoComplete={input.autoComplete}
                  handleChange={changeShortfallToDiffAccHandleChange}
                  value={changeShortfallToDiffAccForm[input.name]}
                  error={changeShortfallToDiffAccFormErrors[input.name]}
                  id={input.id}
                  key={input.id}
                  dropDownOptions={dropDownOptions(input)}
               />
            ))}
         </ConditionalRender>

         <ConditionalRender condition={changeShortfallToThisAccMsg !== undefined}>
            <TextColourizer
               fontSize="0.75em"
               padding="0em 0em 1.25em 0em"
               bold
               color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
               style={{ fontStyle: 'italic' }}
            >
               {changeShortfallToThisAccMsg}
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
