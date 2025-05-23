import { motion } from "motion/react";
import { BsTwitterX } from "react-icons/bs";   
import { GrYoutube } from "react-icons/gr";
import { BsLinkedin } from "react-icons/bs";
import { SiNotion } from "react-icons/si";
import { VscGithubInverted } from "react-icons/vsc";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { RiChatAiFill } from "react-icons/ri";
import { MdEditNote } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";


import { Tabs } from "./UI/Tabs";
import { useRecoilState } from "recoil";
import { currSidebar } from "../store/atoms/currSideTab";
import { Link } from "react-router-dom";


const IconDefaultStyle = `text-gray-800 dark:text-gray-400 text-xl`;

const tabData = [
  { id: "Recent", text: "Recent", icon: MdAccessTimeFilled, activeColor: `text-amber-400` },
  { id: "Youtube", text: "YouTube", icon: GrYoutube, activeColor: "text-red-600" },
  { id: "Twitter", text: "Twitter/X", icon: BsTwitterX, activeColor: "text-white" },
  { id: "Linkedin", text: "LinkedIn", icon: BsLinkedin, activeColor: "text-blue-500" },
  { id: "Notion", text: "Notion", icon: SiNotion, activeColor: "text-white " },
  { id: "Github", text: "GitHub", icon: VscGithubInverted, activeColor: "text-white" },
  { id: "Aichat", text: "AI Chats", icon: RiChatAiFill, activeColor: "text-purple-600 dark:text-purple-400" },
  { id: "Random", text: "Random", icon: GiPerspectiveDiceSixFacesRandom, activeColor: "text-pink-600" },
  { id: "Notes", text: "Notes", icon: MdEditNote, activeColor: "text-green-600" },
];


const hoverColors: Record<string, string> = {
  All: "group-hover:text-amber-400",
  Youtube: "group-hover:text-red-600",
  Twitter: "group-hover:text-white",
  Linkedin: "group-hover:text-blue-500",
  Notion: "group-hover:text-white",
  Github: "group-hover:text-white",
  Aichat: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
  Random: "group-hover:text-pink-600",
  Notes: "group-hover:text-green-600",
};


type TabItemProps = {
  id: string;
  text: string;
  icon: React.ComponentType<{ className: string }>;
  activeColor: string;
  currTab: string;
  setCurrTab: (tab: string) => void;
};




const TabItem: React.FC<TabItemProps> = ({ id, text, icon: Icon, activeColor, currTab, setCurrTab }) => (
  <Link to={`${id}`}>
    <motion.div className="group" whileHover={{ scale: 1.1 }} onClick={() => setCurrTab(id)}>
    <Tabs
      variant="sideTabs"
      size="lg"
      text={text}
      startIcon={
        <Icon className={`${currTab === id ? `${activeColor} text-2xl` : IconDefaultStyle} 
               
              ${hoverColors[id] || ''}`}
        />
      }
      tabActive={currTab === id}
      
    />
  </motion.div>
  </Link>
);


export const SideBar = ({ isShare }: { isShare: boolean }) => {
  const [currTab, setCurrTab] = useRecoilState(currSidebar);

  return (
    <div className="w-50 h-full z-60 fixed top-20 left-0 flex flex-col gap-5 dark:bg-secondaryBlack bg-gray-300 border-r-1 dark:border-gray-700 border-gray-500 pt-5 pl-7">
      {tabData
        .filter(tab => !(isShare && tab.id === "Recent"))
        .map(tab => (
          <TabItem
            key={tab.id}
            {...tab}
            currTab={currTab}
            setCurrTab={setCurrTab}
          />
        ))}
    </div>
  );
};
