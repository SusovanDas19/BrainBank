import { useEffect, useRef, useState } from "react";
import { Button } from "./UI/Button";
import { Tabs } from "./UI/Tabs";
import { Portal } from "./Portal";
import axios from "axios";
import { useToast } from "./UI/ToastProvider";
import useClickOutside from "../customHooks/useClickOutside";
import { useRecoilState, useSetRecoilState } from "recoil";
import { showMenuAtom } from "../store/atoms/menuAtom";
import { motion } from "motion/react";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { LuBrainCircuit } from "react-icons/lu";
import { div } from "motion/react-client";

interface MenuProps {
  handleLogout: () => void;
}

export const Menu = ({ handleLogout }: MenuProps) => {
  const username: string = localStorage.getItem("usernameBB") || "";
  const [shareBrain, setShareBrain] = useState<boolean>(false);
  const logOutRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useRecoilState(showMenuAtom);

  useClickOutside(logOutRef, () => {
    setShowMenu(false);
  });

  return (
    <div
      ref={logOutRef}
      className="absolute z-50 top-2 right-5 w-50 h-70 flex justify-center items-center gap-10 flex-col bg-white  dark:bg-primaryBlack  rounded-sm rounded-tl-4xl rounded-br-4xl border-2 border-whiteOrange dark:border-blackOrange hover:border-3"
    >
      <div className="w-3/4 font-primary text-xl text-white relative flex justify-center items-center flex-col">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        <Tabs text={username} size="lg" variant="navTabs"></Tabs>
      </div>

      <div className="flex flex-col gap-8 justify-center items-center">
        <Button
          text="Share Brain"
          size="md"
          variant="secondary"
          onClick={() => setShareBrain(!shareBrain)}
        />

        <Button
          text="Logout"
          size="sm"
          variant="primary"
          onClick={handleLogout}
        />
      </div>

      {shareBrain && showMenu && (
        <Portal>
          <motion.div
            className="z-30"
            ref={logOutRef}
            initial={{
              x: 550,
              y: -200,
              opacity: 0,
              scale: 0.1,
              filter: "blur(10px)",
            }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, type: "spring" }}
            exit={{
              x: 550,
              y: -200,
              opacity: 0,
              scale: 0.1,
              filter: "blur(10px)",
            }}
          >
            <ShareBrain setShareBrain={setShareBrain} />
          </motion.div>
        </Portal>
      )}
    </div>
  );
};

const ShareBrain = ({
  setShareBrain,
}: {
  setShareBrain: (key: boolean) => void;
}) => {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();
  const token = localStorage.getItem("tokenBB");
  const setShowMenu = useSetRecoilState(showMenuAtom);
  

  const generateShareLink = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        "http://localhost:3000/v1/share/brain/link",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.link) {
        setLink(response.data.link);
        addToast({
          type: "success",
          size: "md",
          message: "Link generated successfully",
        });
      } else {
        addToast({
          type: "error",
          size: "md",
          message: "Something went wrong, try again",
        });
      }
    } catch (e) {
      addToast({
        type: "failure",
        size: "md",
        message: "Unable to generate link",
      });
    }finally{
      setLoading(false)
    }
  };

  const deleteShareLink = async ()=>{
    try {
      setLoading(true)
      const response = await axios.delete(
        "http://localhost:3000/v1/share/brain/link/delete",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      console.log(response)
      if (response.status === 200) {
        console.log(response)
        setLink("");
        addToast({
          type: "success",
          size: "md",
          message: response.data.message,
        });
      }
    } catch (e: any) {

      const errMsg = e.response?.data?.message || "Unable to delete share link";
      addToast({
        type: "failure",
        size: "md",
        message: errMsg,
      });
    }finally{
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      addToast({
        type: "success",
        size: "md",
        message: "Link copied to clipboard",
      });
    });
  };

  return (
    <div className="w-[500px] h-60  rounded-2xl border-2 dark:border-white bg-gray-200/90 dark:bg-primaryBlack/90 flex justify-center items-center font-primary">
      <motion.div
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={() => {
          setShareBrain(false) 
          setShowMenu(false)
        }}
        className="absolute cursor-pointer top-2 right-2 text-2xl hover:bg-red-600/20 p-1 pl-2 pr-2 rounded rounded-tr-2xl hover:border hover:border-red-600 text-gray-500 hover:dark:text-white hover:text-black"
      >
        <MdOutlineCancelPresentation />
      </motion.div>

      {!link && !loading &&(
        <div className="flex flex-col gap-5 justify-center items-center">
          <Button
            variant="primary"
            size="lg"
            text="Fetch Share Link"
            onClick={generateShareLink}
          />
          <Button
            variant="secondary"
            size="md"
            text="Delete Share Link"
            onClick={deleteShareLink}
          />
        </div>
      )}
      {loading && <p className="text-2xl dark:text-white">Generating....</p>}

      {link && !loading && (
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="flex flex-row gap-3 justify-center items-center">
            <div className="w-80 h-10 rounded-md bg-whiteOrange/30 dark:bg-blackOrange/30 border-l-5 border-blackOrange flex justify-center items-center">
              <p className="break-all text-lg font-medium dark:text-white">
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

          <p className=" text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-800 cursor-pointer flex justify-center items-center gap-1 text-lg group font-medium">
            Anyone with this link can view your
            <LuBrainCircuit className="text-md text-black dark:text-white group-hover:text-blackOrange" />
            BrainBank
          </p>
        </div>
      )}
    </div>
  );
};
