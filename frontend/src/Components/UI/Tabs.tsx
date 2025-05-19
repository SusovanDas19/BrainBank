import { ReactElement } from "react";

export interface TabsProps {
  variant: "navTabs" | "sideTabs";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  tabActive?:boolean
}

const VariantStyle = {
  navTabs:
    "hover:bg-gray-300 dark:text-gray-500 dark:hover:bg-gray-800 pl-5 pr-5 pt-1 pb-1",
  sideTabs:
    "flex justify-start items-center gap-1 dark:hover:bg-gray-800 pl-2 pt-1 pb-1 hover:bg-gray-400",
};

const currTabStyle = {
  sideTabs: "dark:bg-gray-800 bg-gray-400",
  navTabs: "bg-gray-300 dark:text-gray-500 dark:bg-gray-800",
}

const sizeStyle = {
  sm: "",
  md: "w-25",
  lg: "w-40",
};

const defaultStyle =
  "text-center flex justify-center items-center flex-row cursor-pointer font-primary text-gray-600 hover:text-black text-2xl font-medium dark:hover:text-white rounded-md group";

export const Tabs = (props: TabsProps) => {
  return (
    <div
      className={`${defaultStyle} ${VariantStyle[props.variant]} ${sizeStyle[props.size]} ${props.tabActive ? currTabStyle[props.variant]:""}`}
      onClick={props.onClick}
    >
      {props.startIcon && (
        <span className="mr-2 ">
          {props.startIcon}
        </span>
      )}
      {props.text}
      {props.endIcon && <span className="ml-2">{props.endIcon}</span>}
    </div>
  );
};
