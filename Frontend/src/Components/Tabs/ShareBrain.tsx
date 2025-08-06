import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbars";
import { SideBar } from "../SideBar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  ShareBrainDataAtom,
  ShareBrainTypeAtom,
  ShareBrainUsernameAtom,
} from "../../store/atoms/shareBrainDataAtom";
import { motion } from "motion/react";
import { LuBrain } from "react-icons/lu";
import { useToast } from "../UI/ToastProvider";
import { Button } from "../UI/Button";
import { sidebarAtom } from "../../store/atoms/sidebarAtom";
import { LuMenu } from "react-icons/lu";

type LinkStatus = "loading" | "valid" | "invalid";

export const ShareBrain = () => {
  const { hash } = useParams<{ hash: string }>();
  const setAllData = useSetRecoilState(ShareBrainDataAtom);
  const setUsername = useSetRecoilState(ShareBrainUsernameAtom);
  const setShareBrainType = useSetRecoilState(ShareBrainTypeAtom);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [linkStatus, setLinkStatus] = useState<LinkStatus>("loading");
  const [activeSidebar, setActiveSidebar] = useRecoilState(sidebarAtom);

  useEffect(() => {
    if (localStorage.getItem("tokenBB")) {
      navigate("/", { replace: true });
      return;
    }

    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `https://api.brainbank.cv/v1/share/brain/show/${hash}`
        );

        if (response.status === 200) {
          setAllData(response.data.user);
          setUsername(response.data.username);
          setShareBrainType(response.data.type);
          setLinkStatus("valid");
        }
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 404) {
          addToast({
            type: "error",
            message: "This share link has been deactivated.",
            size: "md",
          });
          setLinkStatus("invalid");
        } else {
          addToast({
            type: "failure",
            message: "An unexpected error occurred.",
            size: "md",
          });
          setLinkStatus("invalid");
        }
      }
    };

    fetchContent();
  }, [hash, navigate, setAllData, setUsername]);

  if (linkStatus === "loading") {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-primaryBlack text-white text-2xl">
        Loading BrainBank...
      </div>
    );
  }

  if (linkStatus === "invalid") {
    return <InvalidLinkPage />;
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div>
        <Navbar closeDropDown={true} />
      </div>
      <div className="flex flex-1 overflow-hidden">
          {activeSidebar && <SideBar isShare={true} />}
          {!activeSidebar && (
            <button
              onClick={() => setActiveSidebar(true)}
              className="fixed opacity-70 hover:opacity-100 top-24 left-4 z-50 p-2 rounded-md bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm"
              aria-label="Open sidebar"
            >
              <LuMenu className="cursor-pointer text-2xl dark:text-blackOrange text-whiteOrange" />
            </button>
          )}
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
  const type = useRecoilValue(ShareBrainTypeAtom);
  return (
    <div>
      <div className="h-screen font-primary overflow-hidden bg-white dark:bg-primaryBlack text-center flex justify-center items-center flex-col">
        <motion.div
          className="w-25 h-25 md:w-35 md:h-30 bg-orange-600/30 dark:bg-orange-600/20 overflow-hidden rounded-xl flex justify-center items-center border border-transparent dark:hover:border-amber-600 hover:border-amber-600 mb-5"
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
            <LuBrain className="text-5xl cursor-grab dark:text-amber-50 text-gray-700" />
          </motion.div>
        </motion.div>
        <motion.h1
          className="dark:text-white text-4xl md:text-7xl"
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {username}'s
          <strong className="text-whiteOrange dark:text-blackOrange font-semibold">
            {" "}
            Brain
          </strong>
          <p className="text-lg text-gray-500 mt-2">
            Explore the sidebar to see what {username}{" "}
            {type === "organization" && "organization"} stored in{" "}
            {type === "organization" ? "their" : "his"} Brain
          </p>
        </motion.h1>
      </div>
    </div>
  );
};

// for the invalid link page
const InvalidLinkPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center dark:bg-primaryBlack text-white font-primary text-center p-4">
      <Navbar closeDropDown={true} />
      <div className="flex-1 flex flex-col justify-center items-center">
        <motion.div
          className="w-35 h-30  overflow-hidden rounded-xl flex justify-center items-center border border-transparent dark:hover:md:border-amber-600 hover:border-amber-600 mb-5"
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
            <LuBrain className="text-5xl cursor-grab text-red-600 " />
          </motion.div>
        </motion.div>
        <motion.h1
          className="text-4xl font-bold mb-4 dark:text-white text-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Share Link Deactivated
        </motion.h1>
        <motion.p
          className="text-lg dark:text-gray-400 text-gray-500 max-w-md mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          This link is either invalid or has been disabled by its owner.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="primary"
            size="lg"
            text="Create Your Own BrainBank"
            onClick={() => navigate("/auth")}
          />
        </motion.div>
      </div>
    </div>
  );
};
