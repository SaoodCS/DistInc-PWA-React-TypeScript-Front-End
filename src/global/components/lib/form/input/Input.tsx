import { useState } from 'react';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper, TextInput } from './Style';

interface IInput {
   placeholder: string;
   type: string;
   name: string;
   isRequired?: boolean;
   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   error: string;
   value: string | number;
}

export default function InputComponent(props: IInput): JSX.Element {
   const { placeholder, type, name, isRequired, handleChange, value, error } = props;
   const [isActive, setIsActive] = useState(false);
   function handleFocus() {
      setIsActive(true);
   }

   function handleBlur() {
      setIsActive(false);
   }

   return (
      <InputContainer>
         <LabelWrapper htmlFor={name}>
            <InputLabel
               focusedInput={isActive}
               isRequired={isRequired || false}
               inputHasValue={!!value}
            >
               {placeholder}
            </InputLabel>
         </LabelWrapper>
         <TextInput
            id={name}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={type}
            name={name}
            isRequired={isRequired || false}
            onChange={handleChange}
            value={value}
            hasError={!!error}
         />
         <ErrorLabel>{error}</ErrorLabel>
      </InputContainer>
   );
}

InputComponent.defaultProps = {
   required: false,
};
