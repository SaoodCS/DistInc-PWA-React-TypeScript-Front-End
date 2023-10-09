import { useSearchParams } from "react-router-dom";

export default function useURLState(param: string) {
    // Get the current search params and a setter function from useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();
  
    // Get the value of the param from the search params
    const value = searchParams.get(param);
  
    // Define a setter function that updates the param in the search params
    const setValue = (newValue: string) => {
      // Create a new URLSearchParams object with the updated param
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(param, newValue);
  
      // Set the new search params using the setter function
      setSearchParams(newSearchParams);
    };
  
    // Return the value and the setter function as a tuple
    return [value, setValue] as const;
  }