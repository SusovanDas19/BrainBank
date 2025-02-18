import { motion } from "motion/react";

const pStyle =
  "text-xl font-medium items-center flex text-black dark:text-white w-full h-10 dark:hover:bg-gray-600 hover:bg-gray-400 pl-5 cursor-pointer rounded-md ";

export const DropDownMenu = () => {
  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", ease: ["easeIn", "easeOut"] }}
      className="w-32 h-32  top-16 left-68 absolute flex justify-center items-start flex-col gap-3 font-primary bg-gray-300 dark:bg-gray-800 rounded-lg"
    >
      <span className={`${pStyle}`}>My Org</span>
      <span className={`${pStyle}`}>My Brain</span>
    </motion.div>
  );
};
