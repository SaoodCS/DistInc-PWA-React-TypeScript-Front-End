/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import useForm from '../../../../../../global/hooks/useForm';
import Notif from '../namespace/Notif';

export default function NotifScheduleForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { data: notifScheduleData } = Notif.DataStore.useQuery.getNotifSettings();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      Notif.Schedule.form.setInitialState(notifScheduleData),
      Notif.Schedule.form.initialErrors,
      Notif.Schedule.form.validate,
   );

   const queryClient = useQueryClient();

   const setNotifSettingsInFirestore = Notif.DataStore.useMutation.setNotifSettings({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getNotifSettings.name] });
      },
   });

   const deleteNotifScheduleInFirestore = Notif.DataStore.useMutation.delNotifSettings({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [microservices.getNotifSettings.name] });
      },
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      const fcmToken = notifScheduleData?.fcmToken as string;
      const badgeCount = notifScheduleData?.badgeCount as number;
      await setNotifSettingsInFirestore.mutateAsync({
         notifSchedule: form,
         fcmToken,
         badgeCount,
      });
   }

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      e.preventDefault();
      const fcmToken = notifScheduleData?.fcmToken as string;
      await deleteNotifScheduleInFirestore.mutateAsync({
         notifSchedule: form,
         fcmToken,
         badgeCount: 0,
      });
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {Notif.Schedule.form.inputs.map((input) => (
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
               dropDownOptions={input.dropDownOptions}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            {`${notifScheduleData?.notifSchedule ? 'Update' : 'Set'} Schedule`}
         </StaticButton>
         <ConditionalRender condition={!!notifScheduleData?.notifSchedule}>
            <StaticButton
               isDarkTheme={isDarkTheme}
               type={'button'}
               isDangerBtn
               onClick={(e) => handleDelete(e)}
            >
               Delete Schedule
            </StaticButton>
         </ConditionalRender>
      </StyledForm>
   );
}
