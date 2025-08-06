import { LuBrainCircuit } from "react-icons/lu";
import { VscGithubInverted } from "react-icons/vsc";
import { motion } from "motion/react";
import { useMediaQuery } from "../customHooks/useMediaQuery";

export const Footer = () => {
  const handleScrollToFeatures = (tab:string) => {
    const el = document.getElementById(tab);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="w-full h-50 dark:bg-gray-50/10 bg-secondaryWhite border-t-1  border-t-gray-400 dark:border-t-gray-50/40 flex flex-row justify-center items-center px-5 md:px-30">
      <div className=" flex flex-col gap-3 flex-1">
        <span className="flex flex-row gap-2 text-xl md:text-3xl font-semibold">
          <LuBrainCircuit className="text-3xl md:text-4xl" /> BrainBank
        </span>
        <p className="text-md md:text-lg">
          When you find something valuable online,
          {isDesktop && <br />} save it to{" "}
          <strong className=" text-whiteOrange dark:text-blackOrange">BrainBank</strong> before it
          slips your mind.
        </p>
      </div>
      <div className="flex-1 flex justify-around items-center cursor-pointer flex-row">
        <div className="flex flex-col items-start gap-3 text-md md:text-lg ">
          <button
            onClick={()=>handleScrollToFeatures("features")}
            className="hover:text-whiteOrange dark:hover:text-blackOrange cursor-pointer hover:font-semibold"
          >
            How its works ?
          </button>
          <button
            onClick={()=>handleScrollToFeatures("aiFeatures")}
            className="hover:text-whiteOrange dark:hover:text-blackOrange cursor-pointer hover:font-semibold"
          >
            AI Features
          </button>
          <button
            onClick={()=>handleScrollToFeatures("colab")}
            className="hover:text-whiteOrange dark:hover:text-blackOrange cursor-pointer hover:font-semibold"
          >
            Built for Teams
          </button>
        </div>
        <motion.a
          href="https://github.com/SusovanDas19/BrainBank"
          target="blank"
          initial={{ x: 0, y: 0, scale: 1 }}
          transition={{type: 'spring'}}
          whileHover={{ x: 0, y: 0, scale: 1.3 }}
        >
          <VscGithubInverted className="text-3xl hover:text-whiteOrange dark:hover:text-blackOrange" />
        </motion.a>
      </div>
    </div>
  );
};
