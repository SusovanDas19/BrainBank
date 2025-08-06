
import { GoCheckCircleFill } from "react-icons/go";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoWarning } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { ImCancelCircle } from "react-icons/im";

export interface ToastProps {
  id: number
  type: "success" | "progress" | "error" | "failure";
  size: "sm" | "md" | "lg";
  message: string;
  removeToast?: () => void;
}

const typeStyle = {
  success: "border-green-600 shadow-green-500 dark:border-green-800 dark:shadow-green-700",
  progress: "border-cyan-600 shadow-sky-500 dark:border-cyan-800 dark:shadow-cyan-700",
  error: "border-yellow-600 shadow-yellow-500 dark:border-yellow-800 dark:shadow-yellow-700",
  failure: "border-red-600 shadow-red-500 dark:border-red-800 dark:shadow-red-700",
};

const sizeStyle = {
  sm: "text-sm p-2",
  md: "w-50 md:w-70 text-sm md:text-md p-4",
  lg: "text-lg p-6",
};

const Icons = {
  success: <GoCheckCircleFill className="text-green-600"/>,
  progress: <RiErrorWarningFill className="text-blue-600"/>,
  error: <IoWarning className="text-yellow-500"/>,
  failure: <ImCancelCircle className="text-red-600"/>,
};

const toastDefaultStyle = "bg-white dark:bg-primaryBlack text-black dark:text-white relative group flex items-center rounded-lg shadow-sm border-1";


export const Toast = ({ type, size, message, removeToast }: ToastProps) => {
  return (
    <div
      className={`${toastDefaultStyle} ${typeStyle[type]}  ${sizeStyle[size]} `}
    >
      <div className="mr-2 text-xl md:text-2xl">{Icons[type]}</div>
      <div className="flex-1 ">{message}</div>
      <div
        className="absolute top-1 right-1 cursor-pointer"
        onClick={removeToast}
      >
        <RxCross2 className="hover:text-red-600 hover:text-xl hover:font-bold" />
      </div>
    </div>
  );
};
