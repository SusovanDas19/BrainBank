import { ReactElement } from "react";
import {motion} from "motion/react"

export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const VariantStyle = {
  primary: "bg-whiteOrange dark:bg-blackOrange text-black dark:text-white hover:bg-transparent hover:ring-1 hover:ring-whiteOrange dark:hover:ring-blackOrange",
  secondary: "bg-transparent text-black border-1 hover:border-2 border-black dark:border-white hover:bg-whiteOrange dark:hover:bg-whiteOrange hover:ring-1 hover:ring-whiteOrange dark:hover:ring-blackOrange",
};

const defaultStyle = "flex overflow-hidden items-center text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow  h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-200 ease-out ";

export const Button = (props: ButtonProps) => {
  return (
    <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.8}}>
      <button
        className={`${defaultStyle} ${VariantStyle[props.variant]}`}
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
      >
        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-black dark:bg-white opacity-30 transition-all duration-1000 ease-out group-hover:-translate-x-55"></span>
        <div className="flex items-center">
          {props.startIcon}
          <span className="ml-1 group-hover:text-black dark:group-hover:text-white dark:text-white text-black font-primary text-2xl text-center">{props.text}</span>
        </div>
        <div className="ml-2 flex items-center gap-1 text-sm md:flex">
          {props.endIcon}
        </div>
      </button>
    </motion.div>
  );
};
