import { useContext } from 'react';
import { ApiErrorContext } from '../apiErrorContext';

export default function useApiErrorContext() {
   const { apiError, setApiError } = useContext(ApiErrorContext);
   return { apiError, setApiError };
}
