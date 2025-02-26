import { AnimatePresence, motion } from "motion/react";

const pStyle =
  "text-xl font-medium items-center flex text-black dark:text-white w-full h-10 dark:hover:bg-gray-600 hover:bg-gray-400 pl-5 cursor-pointer rounded-md ";

export const DropDownMenu = () => {
  return (
    <AnimatePresence>
      <motion.div
      initial={{ scale: 0.5, opacity:0, filter: "blur(5px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", ease: "easeInOut", duration: 1}}
      exit={{opacity:0, scale: 0.4, filter: "blur(10px)"}}
      className="w-32 h-32 z-100 top-16 left-68 absolute flex justify-center items-start flex-col gap-3 font-primary bg-gray-300 dark:bg-gray-800 rounded-lg"
    >
      <span className={`${pStyle}`}>My Org</span>
      <span className={`${pStyle}`}>My Brain</span>
    </motion.div>
    </AnimatePresence>
    
  );
};
