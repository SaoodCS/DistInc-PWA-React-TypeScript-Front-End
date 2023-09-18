import { useState } from 'react';
import { InputContainer, InputLabel, TextInput } from './pages/auth/Style';

interface IInput {
   placeholder: string;
   type?: string;
   name?: string;
}

export default function InputComponent(props: IInput): JSX.Element {
    const { placeholder, type, name } = props;
   const [isActive, setIsActive] = useState(false);
   function handleFocus() {
      setIsActive(true);
   }

   function handleBlur() {
      setIsActive(false);
   }

   return (
      <InputContainer>
         <InputLabel focusedInput={isActive}>{placeholder}</InputLabel>
         <TextInput onFocus={handleFocus} onBlur={handleBlur} />
      </InputContainer>
   );
}
