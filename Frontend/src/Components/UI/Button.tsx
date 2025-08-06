import { ReactElement } from "react";
import { motion } from "motion/react";

export interface ButtonProps {
  variant: "primary" | "secondary" | "tertiary" | "dashbutton1" | "dashbutton2";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  [key: string]: any;
}

const VariantStyle = {
  primary:
    "bg-whiteOrange dark:bg-blackOrange text-black dark:text-white hover:bg-transparent hover:ring-1 hover:ring-whiteOrange dark:hover:ring-blackOrange text-xl md:text-2xl",
  secondary:
    "bg-transparent text-black border-1 hover:border-2 border-black dark:border-white hover:bg-whiteOrange dark:hover:bg-whiteOrange hover:ring-1 hover:ring-whiteOrange dark:hover:ring-blackOrange text-2xl",
  tertiary: "hover:bg-blue-500 dark:hover:bg-blue-700 border border-blue-700/70 text-xl md:text-2xl",
  dashbutton1: "border border-yellow-600 hover:bg-yellow-600 text-sm md:text-lg",
  dashbutton2: "border border-red-600 hover:bg-red-600 text-sm md:text-lg"
};

const sizeStyle = {
  sm: "w-20 h-8",
  md: "h-9",
  lg: "w-65 h-10",
};

const defaultStyle =
  "flex overflow-hidden  items-center  font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow px-4 py-2 whitespace-pre md:flex group relative justify-center gap-2 rounded-md transition-all duration-200 ease-out ";

export const Button = (props: ButtonProps) => {
  return (
    <motion.div whileTap={{ scale: 0.8 }}>
      <button
        className={`${defaultStyle} ${VariantStyle[props.variant]} ${
          sizeStyle[props.size]
        }`}
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
      >
        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-black dark:bg-white opacity-30 transition-all duration-1000 ease-out group-hover:-translate-x-55"></span>
        <div className="flex items-center">
          {props.startIcon}
          <span className="ml-1  group-hover:text-black dark:group-hover:text-white dark:text-white text-black font-primary  text-center">
            {props.text}
          </span>
        </div>
        <div className="ml-2 flex items-center gap-1 text-sm md:flex">
          {props.endIcon}
        </div>
      </button>
    </motion.div>
  );
};
