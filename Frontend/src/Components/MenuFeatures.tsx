import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "./UI/Button";
import { motion } from "motion/react";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { LuBrainCircuit } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa6";
import { useToast } from "./UI/ToastProvider";
import { useState } from "react";
import { dashboardAtom, shareBBAtom } from "../store/atoms/brainBankFeatures";
import { dashboardActiveAtom, dashboardTabAtom } from "../store/atoms/dashboardTabAtom";

import { CgToggleSquareOff, CgToggleSquare } from "react-icons/cg";
import { DashBoardTab } from "./DashNav";
import { AdminsTab } from "./DashAdminTab";
import { HomeTab } from "./DashHomeTab";
import { MembersTab } from "./DashMemberTab";
import { DashAdd } from "./DashAdd";
import axios from "axios";
import { useMediaQuery } from "../customHooks/useMediaQuery";

export const Dashboard = () => {
  const setActiveDashBoard = useSetRecoilState(dashboardAtom);
  const userType = localStorage.getItem("userType");
  const dashboardTab = useRecoilValue(dashboardTabAtom);
  const [isDashBoardActiveTabs, setActiveDashBoardTabs] = useRecoilState(dashboardActiveAtom)


  return (
    <div className="w-80 md:w-[1200px] h-[600px] mt-20 rounded-2xl border-2 dark:border-white bg-gray-200/90 dark:bg-primaryBlack/90 flex flex-col items-center font-primary p-5 gap-8">
      <div className="w-full flex justify-center mt-5">
        <div>
          <h1 className="text-4xl dark:text-white">{userType} DashBoard</h1>
        </div>
        <motion.div
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          onClick={() => {
            setActiveDashBoard(false);
          }}
          className="absolute cursor-pointer top-2 right-2 text-2xl hover:bg-red-600/20 p-1 pl-2 pr-2 rounded rounded-tr-2xl hover:border hover:border-red-600 text-gray-500 hover:dark:text-white hover:text-black"
        >
          <MdOutlineCancelPresentation />
        </motion.div>
      </div>
      <div className="absolute top-28 left-5 md:left-18 cursor-ew-resize hover:text-blackOrange text-gray-600 dark:text-white text-2xl">
        {isDashBoardActiveTabs === true ? (
          <CgToggleSquareOff onClick={() => setActiveDashBoardTabs(!isDashBoardActiveTabs)} />
        ) : (
          <CgToggleSquare onClick={() => setActiveDashBoardTabs(!isDashBoardActiveTabs)} />
        )}
      </div>
      <div className="w-full">
        <DashBoardTab show={isDashBoardActiveTabs === true ? "all" : dashboardTab} />
      </div>

      <div
        className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-[var(--color-secondaryWhite)]
          [&::-webkit-scrollbar-thumb]:bg-[var(--color-gray-300)]
          hover:[&::-webkit-scrollbar-thumb]:bg-[var(--color-whiteOrange)]
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:rounded-full
          dark:[&::-webkit-scrollbar-track]:bg-[var(--color-gray-600)]
          dark:[&::-webkit-scrollbar-thumb]:bg-[var(--color-gray-300)]
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-[var(--color-blackOrange)]"
      >
        <div className="space-y-4 mt-7">
          {dashboardTab === "Home" && <HomeTab />}
          {dashboardTab === "Admins" && <AdminsTab />}
          {dashboardTab === "Members" && <MembersTab />}
          {dashboardTab === "add" && <DashAdd />}
        </div>
      </div>
    </div>
  );
};

export const ShareBrain = () => {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();
  const setActiveShareBrain = useSetRecoilState(shareBBAtom);

  const currProfileVarient =
    localStorage.getItem("profileVarientBB") || "personal";
  const type = currProfileVarient === "MyOrg" ? "organization" : "personal";
  const token = localStorage.getItem("tokenBB");

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const generateLink = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://api.brainbank.cv/v1/share/brain/fetch/link",
        { type: type },
        { headers: { Authorization: `${token}` } }
      );
      setLink(data.link);
      addToast({
        type: "success",
        message: "Share link generated!",
        size: "md",
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to generate link.";
      addToast({ type: "failure", message: errorMsg, size: "md" });
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `https://api.brainbank.cv/v1/share/brain/remove/link/${type}`, 
        { headers: { Authorization: `${token}` } }
      );
      addToast({ type: "success", message: data.message, size: "md" });
      setLink(""); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete link.";
      addToast({ type: "failure", message: errorMsg, size: "md" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!link) return;

    const result = await copyTextToClipboard();

    if (result) {
      addToast({
        type: "success",
        size: "md",
        message: "Link copied to clipboard",
      });
    }
    else{
      addToast({
        type: "failure",
        size: "md",
        message: "Unable to copy",
      });
    }
  };

  async function copyTextToClipboard(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (err: unknown) {

    }
    const textArea = document.createElement("textarea");
    textArea.value = link;

    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful; 
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  return (
    <div className="w-80 md:w-[500px] h-70 px-5 md:h-60 rounded-2xl border-2 dark:border-white bg-gray-200/90 dark:bg-primaryBlack/90 flex justify-center items-center font-primary">
      <motion.div
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={() => setActiveShareBrain(false)}
        className="absolute cursor-pointer top-2 right-2 text-2xl hover:bg-red-600/20 p-1 pl-2 pr-2 rounded-tr-2xl hover:border hover:border-red-600 text-gray-500 hover:dark:text-white hover:text-black"
      >
        <MdOutlineCancelPresentation />
      </motion.div>

      {!link && !loading && (
        <div className="flex flex-col gap-5 justify-center items-center">
          <Button
            variant="primary"
            size="lg"
            text={`Fetch Share Link`}
            onClick={generateLink}
          />
          <Button
            variant="secondary"
            size="md"
            text={`Deactivate Share Link`}
            onClick={deleteLink}
          />
        </div>
      )}
      {loading && <p className="text-2xl dark:text-white">Please wait...</p>}

      {link && !loading && (
        <div className="w-full flex items-center justify-center flex-col gap-4 p-4">
          <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
            <div className="w-60 md:w-90 h-10 rounded-md bg-whiteOrange/30 dark:bg-blackOrange/30 border-l-4 border-blackOrange flex justify-center items-center px-3">
              <p className="break-all text-md font-medium dark:text-white truncate">
                {link}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              text="Copy"
              onClick={copyToClipboard}
            />
          </div>
          <p className="w-70 text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-800 cursor-pointer flex justify-center items-center gap-1 text-lg group font-medium">
            Anyone with this link can view your{" "}
            {isDesktop && (
              <LuBrainCircuit className="md:text-md text-black dark:text-white group-hover:text-blackOrange" />
            )}
            {type === "organization" && "Organization's "}BrainBank
          </p>
          <Button
            variant="primary"
            size="sm"
            text="Back"
            onClick={() => setLink("")}
            startIcon={<FaArrowLeft />}
          />
        </div>
      )}
    </div>
  );
};
