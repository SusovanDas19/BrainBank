import { ReactElement } from "react";
import {motion} from "motion/react"

interface BlockProps {
  type: "primary" | "secondary";
  name: string;
  count: number;
  icon: ReactElement;
}
const blockTypeStyle = {
  primary: "",
  secondary: "w-60 md:w-80",
};

const BlockDefaultStyle =
  "bg-gray-200 dark:bg-gray-300/15 p-4 md:p-8 border-1 border-gray-400 dark:border-gray-300 rounded-2xl flex flex-col justify-center items-center font-primary cursor-pointer group";

export const Blocks = (props: BlockProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, filter: "blur(10px)" }}
      animate={{ scale: 1, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        ease: ["easeIn", "easeOut"],
      }}
      whileHover={{ scale: 1.05 }}
      className={`${BlockDefaultStyle} ${blockTypeStyle[props.type]}`}
    >
      <h1 className="flex flex-row gap-2 text-gray-700 dark:text-white text-2xl md:text-3xl font-bold dark:group-hover:text-blackOrange group-hover:text-whiteOrange justify-center items-center">
        {props.icon}
        {props.count}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 font-semibold text-xl md:text-2xl dark:group-hover:text-white group-hover:text-gray-400">
        {props.name}
      </p>
    </motion.div>
  );
};