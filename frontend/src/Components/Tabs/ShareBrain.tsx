import axios from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbars";
import { SideBar } from "../SideBar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  ShareBrainDataAtom,
  ShareBrainUsernameAtom,
} from "../../store/atoms/shareBrainDataAtom";
import { motion } from "motion/react";
import { LuBrain } from "react-icons/lu";

export const ShareBrain = () => {
  const { hash } = useParams<{ hash: string }>();
  const  setAllData = useSetRecoilState(ShareBrainDataAtom);
  const navigate = useNavigate();
  const setUsername = useSetRecoilState(ShareBrainUsernameAtom);

  useEffect(() => {
    if (localStorage.getItem("tokenBB")) {
      navigate("/", { replace: true });
      return;
    }

    async function fetch() {
      try {
        const response = await axios.get(
          `http://localhost:3000/v1/share/brain/show/${hash}`
        );

        if (response.status === 200) {
          setAllData(response.data.user);
          setUsername(response.data.username);
        }
      } catch (e) {}
    }

    fetch();
  }, [hash]);

  return (
    <div className="h-full w-full flex flex-col">
      <div>
        <Navbar closeDropDown={true} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-50 min-h-screen overflow-hidden">
          <SideBar isShare={true} />
        </div>
        <div className="flex-1 h-full overflow-y-auto transition-all duration-300">
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShareHome = () => {
  const username = useRecoilValue(ShareBrainUsernameAtom);
  return (
    <div>
      <div className="h-screen font-primary overflow-hidden bg-white dark:bg-primaryBlack text-center flex justify-center items-center flex-col">
        <motion.div
          className="w-35 h-30 bg-orange-600/30 dark:bg-orange-600/20 overflow-hidden rounded-xl flex justify-center items-center border border-transparent dark:hover:border-amber-600 hover:border-amber-600 mb-5"
          initial={{ x: 0, y: 0, filter: "blur(10px)", scale: 0 }}
          animate={{ x: 0, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            drag
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
            className="flex justify-center items-center"
          >
            <LuBrain className="text-5xl cursor-grab dark:text-amber-50" />
          </motion.div>
        </motion.div>
        <motion.h1
          className="dark:text-white text-5xl"
          initial={{ x: 0, y: 0, filter: "blur(10px)", scale: 0 }}
          animate={{ x: 0, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to
        </motion.h1>
        <motion.h1
          className="dark:text-white text-7xl"
          initial={{
            x: 0,
            y: 1000,
            filter: "blur(10px)",
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            filter: "blur(0px)",
            opacity: 1,
            scale: 1,
          }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {username}'s{" "}
          <strong className="text-whiteOrange dark:text-blackOrange font-semibold">
            Brain
          </strong>
          <p className="text-lg text-gray-500">Explore the side bar to see what {username} store into his Brain</p>
          
        </motion.h1>
        
      </div>
    </div>
  );
};
