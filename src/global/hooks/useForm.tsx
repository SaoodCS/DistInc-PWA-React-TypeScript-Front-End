import { useState } from 'react';
import FormHelper from '../helpers/react/form/FormHelper';

export default function useForm<T>(
   initialState: T,
   initialErrors: Record<keyof T, string>,
   validationFunc: (formStateVal: T) => Record<keyof T, string>,
) {
   const [form, setForm] = useState(initialState);
   const [errors, setErrors] = useState(initialErrors);
   const [apiError, setApiError] = useState('');

   function initHandleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setApiError('');
      setErrors(initialErrors);
      const validationErrors = validationFunc(form);
      if (FormHelper.hasErrors(validationErrors)) {
         setErrors(validationErrors);
         return { isFormValid: false };
      }
      return { isFormValid: true };
   }

   function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
      const { name, value } = e.target;
      setForm((prevState) => ({ ...prevState, [name]: value }));
   }

   return {
      form,
      setForm,
      errors,
      setErrors,
      apiError,
      setApiError,
      handleChange,
      initHandleSubmit,
   };
}

// Potential update:
//1 - rather than passing initialErrors as a prop, create initialErrors from initialState in the hook
// --- adv: less code to write in the form's class (DRY principle)
// --- disadv: less consistency as initialState and initialErrors won't both created in same place (also may have to memoize the const to avoid it recalculating on every render as it's in a func component)
//2 - rather than passing initialErrors and initialState, pass the inputs prop from the form's class and then create the initialErrors and initialState in the hook
// --- disadv: less control over setting the initialState for an individual form
