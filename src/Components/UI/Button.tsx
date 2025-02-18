import { ReactElement } from "react";

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
  primary: "bg-black text-white hover:bg-black/90",
  secondary: "bg-transparent text-black border-1 dark:border-white border-black hover:bg-black/90",
};

const defaultStyle = "flex overflow-hidden items-center text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow  h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2";

export const Button = (props: ButtonProps) => {
  return (
    <div>
      <button
        className={`${defaultStyle} ${VariantStyle[props.variant]}`}
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
      >
        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
        <div className="flex items-center">
          {props.startIcon}
          <span className="ml-1 text-white font-primary text-2xl text-center">{props.text}</span>
        </div>
        <div className="ml-2 flex items-center gap-1 text-sm md:flex">
          {props.endIcon}
        </div>
      </button>
    </div>
  );
};
