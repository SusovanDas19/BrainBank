import { motion } from "motion/react";
import all from "../assets/all.png";
import { Button } from "./UI/Button";
import { useNavigate } from "react-router-dom";

export const Intro = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col font-primary justify-center items-center text-black dark:text-white dark:bg-primaryBlack bg-white pb-10">
      <h1 className="text-6xl mb-30 flex flex-row gap-2 mt-10">
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 1,
          }}
        >
          Welcome
        </motion.span>
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 1,
            delay: 0.2,
          }}
        >
          to
        </motion.span>
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 1,
            delay: 0.3,
          }}
        >
          BrainBank
        </motion.span>
      </h1>
      <div className="flex flex-row gap-8 mb-20">
        <div className="flex flex-col justify-center items-center gap-5">
          <h1 className="text-4xl">
            Never lose a importannt <strong>link</strong> again☺️
          </h1>
          <p className="font-Ai text-center text-gray-600 dark:text-gray-400 font-light mb-10">
            Your all-in-one link Bank 😎 - Organize, share, and explore links
            and browser tabs effortlessly.
            <br /> Store the important link in your
            <strong className="text-whiteOrange dark:text-blackOrange ml-1">
              BrainBank
            </strong>
          </p>
          <Button
            variant="primary"
            size="md"
            text="Explore BrainBank"
            onClick={() => {
              navigate("/auth");
            }}
          />
        </div>
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 2,
            delay: 0.5,
          }}
        >
          <img
            src={all}
            alt=""
            className="w-[500px] h-96 rounded shadow-xl shadow-gray-400 dark:shadow-gray-400/60 ring-1"
          />
        </motion.span>
      </div>
{/* 
      <div className="felx justify-center items-center">
        <h1 className="text-4xl">Our Features</h1>
        <IntroCard>
          <div>
            <p>Add your links in various catagories</p>
          </div>
        </IntroCard>
      </div> */}
    </div>
  );
};

// interface IntoCardInterface {
//   mainHeading: string;
// }

// const IntroCard = ({ children }: { children: any }) => {
//   return (
//     <motion.div
//       className="w-[600px] h-[450px] rounded-lg 
//              bg-gradient-to-br from-10% from-orange-500/80 to-orange-300
//              p-6 ring-2 ring-orange-500"
//       initial={{ scale: 1 }}
//       whileHover={{
//         scale: 1.02,
//         boxShadow: "0px 5px 5px #201E43",
//         transition: { duration: 0.3 },
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };
