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
      form: changeShortfallAccForm,
      errors: changeShortfallAccFormErrors,
      handleChange: changeShortfallAccHandleChange,
      initHandleSubmit: changeShortfallAccInitHandleSubmit,
   } = useForm(
      CoversShortfallSavingsAccForm.form.initialState,
      CoversShortfallSavingsAccForm.form.initialErrors,
      CoversShortfallSavingsAccForm.form.validate,
   );
   const [displayChangeShortfallAccForm, setDisplayChangeShortfallAccForm] = useState(false);
   const [shortfallAccChangeToTrueMsg, setShortfallAccChangeToTrueMsg] = useState<string>();
   const [disabledFields, setDisabledFields] = useState<(keyof ISavingsFormInputs)[]>([]);

   useEffect(() => {
      const noOfExistingAcc = savingsAccArr.length;
      const isCreating = !MiscHelper.isNotFalsyOrEmpty(inputValues);
      if (isCreating) {
         if (noOfExistingAcc < 1) {
            setForm((prev) => ({ ...prev, coversShortfall: 'true' }));
            setDisabledFields(['coversShortfall']);
            return;
         }
         if (form.coversShortfall === 'true') setShortfallAccChangeToTrueMsg(SHORTFALL_CHANGE_MSG);
         return;
      }
      if (noOfExistingAcc <= 1) {
         setForm((prev) => ({ ...prev, coversShortfall: 'true' }));
         setDisabledFields(['coversShortfall']);
         return;
      }
      if (inputValues.coversShortfall === form.coversShortfall) {
         setDisplayChangeShortfallAccForm(false);
         setShortfallAccChangeToTrueMsg(undefined);
         return;
      }
      if (form.coversShortfall === 'false') {
         setDisplayChangeShortfallAccForm(true);
      } else setShortfallAccChangeToTrueMsg(SHORTFALL_CHANGE_MSG);
   }, [inputValues, savingsAccounts, form?.coversShortfall]);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const noOfExistingAcc = savingsAccArr.length;
      const isCreating = !MiscHelper.isNotFalsyOrEmpty(inputValues);
      const isEditing = !isCreating;
      const shortfallValChanged = form.coversShortfall !== inputValues?.coversShortfall;
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!shortfallValChanged) {
         await setSavingAccInFS.mutateAsync(form);
         return;
      }
      if ((isCreating && noOfExistingAcc < 1) || (isEditing && noOfExistingAcc <= 1)) {
         await setSavingAccInFS.mutateAsync(form);
         return;
      }
      if (MiscHelper.isNotFalsyOrEmpty(shortfallAccChangeToTrueMsg)) {
         const prevCoveringShortfall = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'coversShortfall',
            'true',
         );
         await Promise.all([
            setSavingAccInFS.mutateAsync({ ...prevCoveringShortfall, coversShortfall: 'false' }),
            setSavingAccInFS.mutateAsync(form),
         ]);
         return;
      }

      if (shortfallValChanged && form.coversShortfall === 'false') {
         const { isFormValid } = changeShortfallAccInitHandleSubmit(e);
         if (!isFormValid) return;
         const accToCoverShortfall = ArrayOfObjects.getObjWithKeyValuePair(
            savingsAccArr,
            'id',
            changeShortfallAccForm.selectedAccName,
         );
         await Promise.all([
            setSavingAccInFS.mutateAsync({ ...accToCoverShortfall, coversShortfall: 'true' }),
            setSavingAccInFS.mutateAsync(form),
         ]);
      }
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      if (!MiscHelper.isNotFalsyOrEmpty(savingsAccounts)) return;
      const isCoveringShortfall = inputValues?.coversShortfall === 'true';
      if (savingsAccArr.length === 1 || !isCoveringShortfall) {
         await delSavingAccInFS.mutateAsync(form);
         return;
      }
      if (!displayChangeShortfallAccForm) setDisplayChangeShortfallAccForm(true);
      const { isFormValid } = changeShortfallAccInitHandleSubmit(
         e as unknown as React.FormEvent<HTMLFormElement>,
      );
      if (!isFormValid) return;
      const accToCoverShortfallId = changeShortfallAccForm.selectedAccName;
      const accToCoverShortfall = ArrayOfObjects.getObjWithKeyValuePair(
         savingsAccArr,
         'id',
         accToCoverShortfallId,
      );
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
         <ConditionalRender condition={displayChangeShortfallAccForm}>
            {CoversShortfallSavingsAccForm.form.inputs.map((input) => (
               <InputCombination
                  placeholder={input.placeholder}
                  type={input.type}
                  name={input.name}
                  isRequired={input.isRequired}
                  autoComplete={input.autoComplete}
                  handleChange={changeShortfallAccHandleChange}
                  value={changeShortfallAccForm[input.name]}
                  error={changeShortfallAccFormErrors[input.name]}
                  id={input.id}
                  key={input.id}
                  dropDownOptions={dropDownOptions(input)}
               />
            ))}
         </ConditionalRender>

         <ConditionalRender condition={shortfallAccChangeToTrueMsg !== undefined}>
            <TextColourizer
               fontSize="0.75em"
               padding="0em 0em 1.25em 0em"
               bold
               color={isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning}
               style={{ fontStyle: 'italic' }}
            >
               {shortfallAccChangeToTrueMsg}
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
