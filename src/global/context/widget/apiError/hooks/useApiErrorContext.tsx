import { useContext } from 'react';
import { ApiErrorContext, IApiErrorContext } from '../apiErrorContext';

export default function useApiErrorContext(): IApiErrorContext {
   const { apiError, setApiError } = useContext(ApiErrorContext);
   return { apiError, setApiError };
}
