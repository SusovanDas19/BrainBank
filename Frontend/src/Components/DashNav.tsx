import { useRecoilState } from "recoil";
import {
  dashboardActiveAtom,
  DashboardTab,
  dashboardTabAtom,
} from "../store/atoms/dashboardTabAtom";
import { AnimatePresence, motion } from "motion/react";
import { Tabs } from "./UI/Tabs";
import { MdHomeFilled } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { BsPersonFillAdd } from "react-icons/bs";
import { ReactElement, useRef } from "react";
import { useMediaQuery } from "../customHooks/useMediaQuery";
import useClickOutside from "../customHooks/useClickOutside";
import { CgToggleSquareOff } from "react-icons/cg";

interface DashboardTabProps {
  show: DashboardTab;
}

interface TabConfig {
  id: DashboardTab;
  text: string;
  icon: ReactElement;
  allowedRoles: string[];
}

const TABS_CONFIG: TabConfig[] = [
  {
    id: "Home",
    text: "Home",
    icon: <MdHomeFilled />,
    allowedRoles: ["admin", "member"],
  },
  {
    id: "Admins",
    text: "Admins",
    icon: <RiAdminFill />,
    allowedRoles: ["admin"],
  },
  {
    id: "Members",
    text: "Members",
    icon: <IoPersonSharp />,
    allowedRoles: ["admin", "member"],
  },
  {
    id: "add",
    text: "Add Members",
    icon: <BsPersonFillAdd />,
    allowedRoles: ["admin"],
  },
];

export const DashBoardTab: React.FC<DashboardTabProps> = ({ show }) => {
  const [dashboardTab, setDashboardTab] = useRecoilState(dashboardTabAtom);
  const userType = localStorage.getItem("userType") || "";
  const isMobile = useMediaQuery("(min-width: 768px)");
  const mobDashboardRef = useRef<HTMLDivElement>(null);
  const [isDashBoardActiveTabsTabs, setActiveDashBoardTabs] =
    useRecoilState(dashboardActiveAtom);

  const availableTabs =
    show == "all" ? TABS_CONFIG : TABS_CONFIG.filter((tab) => tab.id === show);
  useClickOutside(mobDashboardRef, () => {
    setActiveDashBoardTabs(false);
  });

  if (!isMobile && isDashBoardActiveTabsTabs) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="
            absolute top-16 left-4 w-50 
            bg-gray-300 dark:bg-secondaryBlack
            rounded-lg shadow-xl border
            border-gray-400 dark:border-gray-700
            z-10 p-2 flex flex-col gap-1
          "
          ref={mobDashboardRef}
        >
          <CgToggleSquareOff
            onClick={() => setActiveDashBoardTabs(!isDashBoardActiveTabsTabs)}
            className="text-gray-800 dark:text-white"
          />
          {availableTabs.map((tab) => (
            <Tabs
              key={tab.id}
              variant="MobDashTab"
              size="md"
              text={tab.text}
              tabActive={dashboardTab === tab.id}
              startIcon={tab.icon}
              onClick={() => {
                setDashboardTab(tab.id);
                setActiveDashBoardTabs(false);
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }
  return (
    <div className="w-full flex flex-row  mt-10 items-center ">
      {show === "all" ? (
        <>
          <motion.div
            initial={{ x: 0, scale: 0, filter: "blur(10px)" }}
            animate={{ x: 100, scale: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              ease: ["easeIn", "easeOut"],
              duration: 1,
            }}
          >
            <Tabs
              variant="DashboardTabs"
              size="lg"
              text="Home"
              tabActive={dashboardTab === "Home" && true}
              onClick={() => setDashboardTab("Home")}
              startIcon={<MdHomeFilled />}
            />
          </motion.div>

          <motion.div
            initial={{ x: -200, scale: 0, filter: "blur(10px)" }}
            animate={{ x: 200, scale: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              ease: ["easeIn", "easeOut"],
              duration: 1,
            }}
          >
            <Tabs
              variant="DashboardTabs"
              size="lg"
              text="Admins"
              tabActive={dashboardTab === "Admins" && true}
              onClick={() => setDashboardTab("Admins")}
              startIcon={<RiAdminFill />}
            />
          </motion.div>
          <motion.div
            initial={{ x: -400, scale: 0, filter: "blur(10px)" }}
            animate={{ x: 300, scale: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              ease: ["easeIn", "easeOut"],
              duration: 1,
            }}
          >
            <Tabs
              variant="DashboardTabs"
              size="lg"
              text="Members"
              tabActive={dashboardTab === "Members" && true}
              onClick={() => setDashboardTab("Members")}
              startIcon={<IoPersonSharp />}
            />
          </motion.div>
          {userType !== "Member" && (
            <motion.div
              initial={{ x: -550, scale: 0, filter: "blur(10px)" }}
              animate={{ x: 400, scale: 1, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                ease: ["easeIn", "easeOut"],
                duration: 1,
              }}
            >
              <Tabs
                variant="DashboardTabs"
                size="lg"
                text="Add Members"
                tabActive={dashboardTab === "add" && true}
                onClick={() => setDashboardTab("add")}
                startIcon={<BsPersonFillAdd />}
              />
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex items-start w-full">
          {show === "Home" && (
            <Tabs
              variant="DashboardTabs"
              size="lg"
              text="Home"
              tabActive={dashboardTab === "Home" && true}
              startIcon={<MdHomeFilled />}
            />
          )}

          {show === "Admins" && (
            <Tabs
              variant="DashboardTabs"
              size="lg"
              text="Admins"
              tabActive={dashboardTab === "Admins" && true}
              startIcon={<RiAdminFill />}
            />
          )}

          {show === "Members" && (
            <Tabs
              variant="DashboardTabs"
              size="lg"
              text="Members"
              tabActive={dashboardTab === "Members" && true}
              startIcon={<IoPersonSharp />}
            />
          )}

          {show === "add" && userType !== "Member" && (
            <Tabs
              variant="DashboardTabs"
              size="lg"
              text="Add Members"
              tabActive={dashboardTab === "add" && true}
              startIcon={<BsPersonFillAdd />}
            />
          )}
        </div>
      )}
    </div>
  );
};
