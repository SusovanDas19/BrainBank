import { useRef } from "react";
import { Menu } from "./Menu";
import { Tabs } from "./UI/Tabs";
import ThemeToggle from "./UI/ThemeToggle";
import { LuBrainCircuit } from "react-icons/lu";
import { RiArrowDropUpLine } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";

import { useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { dropMenuAtom } from "../store/atoms/dropMenuAtom";
import { DropDownMenu } from "./DropeDownMenu";
import { Button } from "./UI/Button";
import { motion, AnimatePresence } from "motion/react";
import useClickOutside from "../customHooks/useClickOutside";
import { showMenuAtom } from "../store/atoms/menuAtom";

export const Navbar = ({ closeDropDown }: { closeDropDown: boolean }) => {
  const [open, setOpen] = useRecoilState(dropMenuAtom);
  const [showMenu, setShowLogout] = useRecoilState(showMenuAtom);
  const menuRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("tokenBB");
  const navigate = useNavigate();
  const currProfileVarient: string = localStorage.getItem("profileVarientBB") || ""
  console.log("curr varient "+currProfileVarient);
  useClickOutside(menuRef, () => {
    setOpen(false);
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("tokenBB");
      localStorage.removeItem("usernameBB");
      localStorage.removeItem("profileVarientBB");
      localStorage.removeItem("theme");
      localStorage.removeItem("currTabBB");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="w-full z-1000 h-20 flex fixed top-0  flex-row justify-between items-center bg-gray-200 dark:bg-[#0f141c] border-b-1 border-b-gray-400 dark:border-b-gray-800 px-4">
      <div
        className="flex items-center gap-4"
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="flex justify-center items-center font-primary cursor-pointer ml-10">
          <LuBrainCircuit className="text-4xl text-black dark:text-white" />
          <span className="text-3xl text-black dark:text-white font-primary font-medium">
            BrainBank
          </span>
        </div>
        {!closeDropDown && token && (
          <div className="flex flex-row items-center gap-4 ml-20" ref={menuRef}>
            <Tabs
              variant="navTabs"
              text={currProfileVarient}
              size="md"
              endIcon={<DropMenu />}
              onClick={() => setOpen(!open)}
            />
            {open && <DropDownMenu />}
          </div>
        )}
      </div>
      <div className="flex flex-row mr-15 gap-20">
        <div className="flex items-center justify-center gap-4 ">
          <ThemeToggle />
        </div>
        <div>
          {token ? (
            <>
              <button className="h-10 w-10 rounded-full outline cursor-pointer dark:outline-amber-50  flex items-center justify-center">
                {showMenu ? (
                  <RxCrossCircled
                    className="text-4xl text-whiteOrange dark:text-blackOrange"
                    onClick={() => setShowLogout(!showMenu)}
                  />
                ) : (
                  <IoPersonCircleSharp
                    className="text-4xl text-black dark:text-white"
                    onClick={() => setShowLogout(!showMenu)}
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
            </>
          ) : (
            <Button
              text="Signup"
              variant="primary"
              size="sm"
              onClick={() => navigate("/auth")}
            />
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
