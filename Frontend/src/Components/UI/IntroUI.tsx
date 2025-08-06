import { ReactNode } from "react";
import {motion} from "motion/react"

interface BoxProps {
  children: ReactNode;
  variant: "parent" | "child" | "manage";
}

const boxVariantStyle = {
  parent:
    "w-20 h-20 bg-gradient-to-br from-10% from-orange-480/80 to-orange-500",
  child: "w-12 h-12 bg-orange-600/80 dark:bg-orange-800/80",
  manage: "w-11 h-11",
};

export const Box = ({ children, variant }: BoxProps) => {
  return (
    <div
      className={`${boxVariantStyle[variant]} rounded-lg border border-gray-400 dark:border-gray-300  flex justify-center items-center`}
    >
      {children}
    </div>
  );
};

interface IntoCardProps {
  variant: "1" | "2" | "3";
  children: ReactNode;
}

const IntroCardVariantStyle = {
  1: "w-85 md:w-[550px] h-[510px] bg-gradient-to-br from-10% dark:from-blue-950/5 to-orange-300 dark:to-orange-400",
  2: "w-85 md:w-[400px] h-[600px] md:h-[510px] bg-gradient-to-br from-10% from-none to-gray-300 dark:to-blue-950/50 border border-gray-400 dark:border-gray-700",
  3: "w-85 md:w-[1000px] md:h-55 outline-2 outline-orange-700 outline-offset-3 border-1 border-gray-400",
};

export const IntroCard = ({ children, variant }: IntoCardProps) => {
  return (
    <motion.div
      className={`${IntroCardVariantStyle[variant]} rounded-lg 
             
             p-6`}
      initial={{ scale: 1 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
};

interface IntroSubCardProps{
    children: ReactNode
    variant: "1" | "2"
}

const IntorSubCardVStyle = {
    1: "w-full flex flex-col gap-2 justify-center items-center bg-gray-500/10 dark:bg-gray-50/5 px-8 py-5 rounded-lg border-r dark:border-r-orange-500 border-r-orange-600",
    2: "h-full flex-1 py-5 flex justify-center items-center rounded-b-2xl bg-gradient-to-br from-25% from-primaryWhite dark:from-primaryBlack to-orange-400 dark:to-orange-500 border-l-2 border-orange-600 dark:border-orange-800"
}
export const IntroSubCard = ({children, variant}: IntroSubCardProps) =>{
    return(
        <div className={`${IntorSubCardVStyle[variant]}`}>
          {children}
        </div>
    )
}

