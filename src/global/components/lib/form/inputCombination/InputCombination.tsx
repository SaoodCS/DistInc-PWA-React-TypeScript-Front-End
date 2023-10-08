import DropDownInput, { IDropDownOption } from '../dropDown/DropDownInput';
import InputComponent from '../input/Input';

interface IInputCombination {
   placeholder: string;
   name: string;
   isRequired?: boolean;
   handleChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
   error: string;
   dropDownOptions?: IDropDownOption[];
   id: string;
   type: string;
   value: string | number;
   autoComplete?: 'current-password' | 'new-password';
}

export default function InputCombination(props: IInputCombination) {
   const {
      placeholder,
      name,
      isRequired,
      handleChange,
      error,
      dropDownOptions,
      id,
      type,
      value,
      autoComplete,
   } = props;

   return (
      <>
         {!dropDownOptions && (
            <InputComponent
               placeholder={placeholder}
               type={type}
               name={name}
               isRequired={isRequired}
               autoComplete={autoComplete}
               handleChange={handleChange}
               value={value}
               error={error}
               id={id}
            />
         )}
         {!!dropDownOptions && (
            <DropDownInput
               placeholder={placeholder}
               name={name}
               options={dropDownOptions}
               isRequired={isRequired}
               error={error}
               handleChange={handleChange}
               id={id}
            />
         )}
      </>
   );
}
