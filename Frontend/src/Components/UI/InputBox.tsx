import { RefObject, useState } from 'react';
import { LuEyeClosed } from "react-icons/lu";
import { IoEyeOffOutline } from "react-icons/io5";

export type InputBoxTypes = {
  variant: "auth" | "atForm" | "atDashboard" | "recentSearch";
  placeholder: string;
  type: string;
  name: string;
  onClick?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  Icon?: boolean
  inputRef?:  RefObject<HTMLInputElement>;
  [key: string]: any;
};


const inpVariantStyle = {
    auth: "w-[280px]  px-4 py-3 ",
    atForm: "w-80 md:w-[380px] text-lg md:text-2xl font-medium px-3 py-1 py-2 ",
    atDashboard: "w-fit md:w-[380px] text-lg md:text-2xl font-medium px-3 py-1 md:py-2 ",
    recentSearch: "w-40 py-1 md:px-8 md:py-4 md:w-[280px] text-sm md:text-md"
}

export const inpDefaultStyle = "bg-none outline-none text-black dark:text-white rounded-lg border-2 transition-colors duration-100 border-solid dark:focus:border-blackOrange focus:border-whiteOrange border-gray-800 placeholder-gray-800 dark:placeholder-gray-400";

export const InputBox = (props: InputBoxTypes) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        variant,
        placeholder,
        type,
        Icon,
        inputRef,
        ...rest
    } = props;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative flex items-center justify-center font-">
            <input
                // Spread the 'rest' object here. This applies `required` and any other standard attributes.
                {...rest}
                className={`${inpDefaultStyle} ${inpVariantStyle[variant]} ${Icon && "pl-10 pr-10 bg-gray-300/40 dark:bg-gray-500/50"}`}
                placeholder={placeholder}
                type={type === 'password' && showPassword ? 'text' : type}
                ref={inputRef}
            />
            {type === 'password' && (
                <button
                    type="button"
                    className="absolute right-3 top-3 text-white text-center"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <IoEyeOffOutline className='text-lg dark:text-white text-black cursor-pointer'/> : <LuEyeClosed className='text-lg dark:text-white text-black cursor-pointer'/>}
                </button>
            )}
        </div>
    );
};
