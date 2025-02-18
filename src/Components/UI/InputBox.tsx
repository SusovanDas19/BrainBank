import { useState } from 'react';
import { LuEyeClosed } from "react-icons/lu";
import { IoEyeOffOutline } from "react-icons/io5";

type InputBoxTypes = {
    placeholder: string,
    type: string,
    name: string,
    onClick?: () => void
}

export const InputBox = (props: InputBoxTypes) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative flex items-center justify-center">
            <input
                className="bg-none px-4 py-3  outline-none w-[280px] text-black dark:text-white rounded-lg border-2 transition-colors duration-100 border-solid dark:focus:border-blackOrange focus:border-whiteOrange border-gray-800 placeholder-gray-800 dark:placeholder-gray-400"
                name={props.name}
                placeholder={props.placeholder}
                type={props.type === 'password' && showPassword ? 'text' : props.type}
            />
            {props.type === 'password' && (
                <button
                    type="button"
                    className="absolute right-3 top-3 text-white text-center"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <IoEyeOffOutline className='text-lg dark:text-white text-black'/> : <LuEyeClosed className='text-lg dark:text-white text-black'/>}
                </button>
            )}
        </div>
    );
};
