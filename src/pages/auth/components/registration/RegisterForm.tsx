import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { StaticButton } from '../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../global/components/lib/form/form/Style';
import InputComponent from '../../../../global/components/lib/form/input/Input';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import APIHelper from '../../../../global/firebase/apis/helper/NApiHelper';
import microservices from '../../../../global/firebase/apis/microservices/microservices';
import { auth } from '../../../../global/firebase/config/config';
import { useCustomMutation } from '../../../../global/hooks/useCustomMutation';
import useForm from '../../../../global/hooks/useForm';
import type { ICurrentFormInputs } from '../../../main/details/components/accounts/current/class/Class';
import CurrentClass from '../../../main/details/components/accounts/current/class/Class';
import type { IRegInputs } from './Class';
import RegClass from './Class';

export default function RegisterForm(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const {
      form: regForm,
      errors,
      handleChange,
      initHandleSubmit,
   } = useForm(RegClass.initialState, RegClass.initialErrors, RegClass.validate);

   const setCurrentAccountInFirestore = CurrentClass.useMutation.setCurrentAccount({});

   const registerUser = useCustomMutation(async (formData: IRegInputs) => {
      const body = APIHelper.createBody(formData);
      const method = 'POST';
      const microserviceName = microservices.registerUser.name;
      await APIHelper.gatewayCall(body, method, microserviceName);
      const signInUser = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await setCurrentAccountInFirestore.mutateAsync({
         accountName: 'Salary And Expenses',
         minCushion: 0,
         accountType: 'Salary & Expenses',
         transferLeftoversTo: '',
      } as ICurrentFormInputs);
      await setCurrentAccountInFirestore.mutateAsync({
         accountName: 'Spendings',
         minCushion: 0,
         accountType: 'Spending',
         transferLeftoversTo: '',
      } as ICurrentFormInputs);
      await sendEmailVerification(signInUser.user);
   });

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await registerUser.mutateAsync(regForm);
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {RegClass.inputs.map((input) => (
            <InputComponent
               placeholder={input.placeholder}
               type={input.type}
               name={input.name}
               isRequired={input.isRequired}
               autoComplete={input.autoComplete}
               handleChange={handleChange}
               value={regForm[input.name]}
               error={errors[input.name]}
               id={input.id}
               key={input.id}
            />
         ))}
         <StaticButton isDarkTheme={isDarkTheme} type={'submit'}>
            Sign Up
         </StaticButton>
      </StyledForm>
   );
}
