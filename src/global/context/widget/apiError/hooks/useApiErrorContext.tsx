import { useContext } from 'react';
import { ApiErrorContext } from '../apiErrorContext';

interface IUseApiErrorReturn {
   apiError: string;
   setApiError: React.Dispatch<React.SetStateAction<string>>;
}

export default function useApiErrorContext(): IUseApiErrorReturn {
   const { apiError, setApiError } = useContext(ApiErrorContext);
   return { apiError, setApiError };
}
