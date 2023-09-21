import { useState } from "react";

export default function useForm(initialState: any, initialErrors: any, validationFunc: any){
    const [formInputs, setFormInputs] = useState(initialState);
    const [errors, setErrors] = useState(initialErrors);
    const [apiError, setApiError] = useState('');

    function initHandleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        setApiError('');
        setErrors(initialErrors);
        const validationErrors = validationFunc(formInputs);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    }

    function handleChange(e: any): void {
        const { name, value } = e.target;
        setFormInputs(prevState => ({ ...prevState, [name]: value }));
    }

    return {
        formInputs,
        errors,
        apiError,
        setApiError,
        handleChange,
        initHandleSubmit
    }
}