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

   function handleChange(e: any): void {
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
