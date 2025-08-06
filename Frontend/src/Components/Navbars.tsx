import { useRef } from "react";
import { Menu } from "./Menu";
import { Tabs } from "./UI/Tabs";
import ThemeToggle from "./UI/ThemeToggle";
import { LuBrainCircuit } from "react-icons/lu";
import { RiArrowDropUpLine } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";

import { useLocation, useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { dropMenuAtom, swtichMenuAtom } from "../store/atoms/dropMenuAtom";
import { DropDownMenu } from "./DropeDownMenu";
import { Button } from "./UI/Button";
import { motion, AnimatePresence } from "motion/react";
import useClickOutside from "../customHooks/useClickOutside";
import { showMenuAtom } from "../store/atoms/menuAtom";
import { dashboardAtom, shareBBAtom } from "../store/atoms/brainBankFeatures";
import { Portal } from "./Portal";
import { Dashboard, ShareBrain } from "./MenuFeatures";
import { useMediaQuery } from "../customHooks/useMediaQuery";

export const Navbar = ({ closeDropDown }: { closeDropDown?: boolean }) => {
  const [open, setOpen] = useRecoilState(dropMenuAtom);
  const [showMenu, setShowMenu] = useRecoilState(showMenuAtom);
  const [activeDashboard, setActiveDashBoard] = useRecoilState(dashboardAtom);
  const [activeShareBrain, setActiveShareBrain] = useRecoilState(shareBBAtom);
  const setSwitchMenu = useSetRecoilState(swtichMenuAtom)
  const menuRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("tokenBB");
  const navigate = useNavigate();
  const currProfileVarient: string =
    localStorage.getItem("profileVarientBB") || "";
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const location = useLocation();

  const initialX = isDesktop ? 550 : 80;
  const initialY = isDesktop ? -200 : -200;

  useClickOutside(menuRef, () => {
    setOpen(false);
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("tokenBB");
      localStorage.removeItem("usernameBB");
      localStorage.removeItem("profileVarientBB");
      localStorage.removeItem("currTabBB");
      localStorage.removeItem("OrgNameBB");
      localStorage.removeItem("userType");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="w-full z-1000 h-20 flex fixed top-0  flex-row md:justify-between items-center bg-gray-200 dark:bg-[#0f141c] border-b-1 border-b-gray-400 dark:border-b-gray-800 px-4">
      <div className="flex items-center gap-20 md:gap-4">
        <div
          onClick={() => navigate("/")}
          className="flex justify-center items-center font-primary cursor-pointer mr-5 md:ml-10 md:mr-0"
        >
          <LuBrainCircuit className=" text-2xl md:text-4xl text-black dark:text-white" />
          <span className="text-2xl md:text-3xl text-black dark:text-white font-primary font-medium">
            BrainBank
          </span>
        </div>
        {!closeDropDown && token && (
          <div
            className="flex flex-row items-center gap-4 md:ml-20 "
            ref={menuRef}
          >
            <Tabs
              variant="navTabs"
              text={currProfileVarient}
              size="md"
              endIcon={<DropMenu />}
              onClick={() => {
                setOpen(!open);
                setActiveShareBrain(false);
                setActiveDashBoard(false);
                setSwitchMenu(false);
              }}
            />
            <div className="absolute top-16 left-40 md:left-90">
              {open && <DropDownMenu />}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row md:mr-5 gap-10 md:gap-20">
        {!isDesktop && !token && (location.pathname === "/auth" || location.pathname === "/" || location.pathname.includes("/share/brain/show")) && (
          <div className="flex items-center justify-center gap-4">
            <ThemeToggle />
          </div>
        )}

        {isDesktop && (
          <div className="flex items-center justify-center gap-4">
            <ThemeToggle />
          </div>
        )}

        <div>
          {token ? (
            <>
              <button className="w-8 h-8 md:h-10 md:w-10 rounded-full outline cursor-pointer dark:outline-amber-50  flex items-center justify-center">
                {showMenu ? (
                  <RxCrossCircled
                    className="text-4xl text-whiteOrange dark:text-blackOrange"
                    onClick={() => {
                      setShowMenu(!showMenu);
                      setActiveDashBoard(false);
                      setActiveShareBrain(false);
                    }}
                  />
                ) : (
                  <IoPersonCircleSharp
                    className="text-4xl text-black dark:text-white"
                    onClick={() => {
                      setShowMenu(!showMenu);
                      setActiveDashBoard(false);
                      setActiveShareBrain(false);
                    }}
                  />
                )}
              </button>
              <div>
                <AnimatePresence>
                  {showMenu ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{
                        type: "spring",
                        ease: ["easeIn", "easeOut"],
                      }}
                      exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                    >
                      <Menu handleLogout={handleLogout} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              <div>
                <AnimatePresence>
                  {(activeDashboard || activeShareBrain) && (
                    <Portal>
                      <motion.div
                        className="z-30"
                        initial={{
                          x: initialX,
                          y: initialY,
                          opacity: 0,
                          scale: 0.1,
                          filter: "blur(10px)",
                        }}
                        animate={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        transition={{ duration: 1, type: "spring" }}
                        exit={{
                          x: initialX,
                          y: initialY,
                          opacity: 0,
                          scale: 0.1,
                          filter: "blur(10px)",
                        }}
                      >
                        {activeDashboard && <Dashboard />}
                        {activeShareBrain && <ShareBrain />}
                      </motion.div>
                    </Portal>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="ml-15">
              <Button
                text="Signup"
                variant="primary"
                size="sm"
                onClick={() => navigate("/auth")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const arrowStyle = "text-2xl text-dark dark:text-white";

const DropMenu = () => {
  const open = useRecoilValue(dropMenuAtom);

  return (
    <div className="cursor-pointer">
      {open ? (
        <RiArrowDropDownLine className={`${arrowStyle}`} />
      ) : (
        <RiArrowDropUpLine className={`${arrowStyle}`} />
      )}
    </div>
  );
};
