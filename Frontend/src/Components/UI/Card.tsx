import { ReactElement, useState, useEffect, useRef } from "react";
import { ResponseStr } from "../Tabs/Youtube";
import { Button } from "./Button";
import { AnimatePresence, motion } from "motion/react";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { IoMdLink } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { useToast } from "./ToastProvider";
import useClickOutside from "../../customHooks/useClickOutside";
import { RiDvdAiFill } from "react-icons/ri";
import { Ai } from "../AI";


interface CardContainerProps {
  preview?: ReactElement;
  details: ResponseStr;
  removeContent: (id: string) => void;
  isShare?:boolean
}

export const Card = ({ preview, details, removeContent,isShare }: CardContainerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOpt, setShowOpt] = useState(false);
  const optRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const [showAiChat, setShowAiChat] = useState<boolean>(false);
  

  useClickOutside(optRef, () => {
    setShowDetails(false);
    setShowOpt(false);
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem("tokenBB");
    try {
      const response = await axios.delete(
        "https://api.brainbank.cv/v1/content/remove",
        {
          data: { contentId: details._id },
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        removeContent(details._id);
        setShowDetails(false);
        setShowOpt(false);
        addToast({
          type: "success",
          size: "md",
          message: "Content deleted successfully",
        });
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          addToast({
            type: "error",
            size: "md",
            message: "Contetnt does not found",
          });
        } else {
          addToast({
            type: "failure",
            size: "md",
            message: "Internal server error",
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="relative flex flex-col justify-center items-center animate-pulse">
        <div className="w-70 aspect-video rounded-lg bg-gray-300"></div>
        <div className="w-20 h-8 absolute -bottom-5 bg-gray-300 opacity-0 group-hover:opacity-100"></div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="relative flex flex-col  justify-center items-center "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ scale: 0.5, filter: "blur(10px)" }}
      >
        <div className="group">
          <div>{preview}</div>

          {/* Button to toggle details */}
          <div className="absolute -bottom-5 left-40  md:left-30 opacity-50 md:opacity-0 group-hover:opacity-100">
            {!showDetails && (
              <Button
                variant="secondary"
                type="button"
                size="sm"
                text={showDetails ? "Close" : "Explore"}
                onClick={() => setShowDetails(!showDetails)}
              />
            )}
          </div>
        </div>
        <AnimatePresence>
          {showDetails && (
            <motion.div
              key={details._id}
              className={`absolute  ${details.type === "Youtube" ? 'top-5':'top-50'}  w-70  rounded-md bg-white/5 dark:bg-black/30 backdrop-blur-md border border-blackOrange/50  p-2 shadow-lg z-4 font-primary`}
              initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "backOut" }}
              exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
              ref={optRef}
            >
              <h1 title={`#${details.title}`} className="text-lg font-semibold text-black dark:text-white truncate pr-5">
                {details.title}
              </h1>
              <p title={`#${details.description}`} className="text-sm text-black dark:text-white truncate pr-5">
                {details.description}
              </p>
              <a
                href={details.link}
                className="w-15 text-blue-600 flex flex-row items-center gap-2 text-lg dark:text-blue-500 font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoMdLink />
                Link
              </a>
              <p className="text-black dark:text-white">
                Created At: <strong>{details.date}</strong>
              </p>
              <div className="flex flex-row gap-4">
                {details.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center max-w-[75px] bg-transparent px-2 rounded-2xl text-black border-1 dark:text-white font-primary text-lg font-bold border-gray-700 group"
                  >
                    <p className="truncate text-gray-300">
                      <span className="text-blackOrange">#</span>
                      {tag}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-black dark:text-white  cursor-pointer">
                {showOpt ? (
                  <motion.div
                    className="absolute  top-1 left-25"
                    initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.4 }}
                    exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                  >
                    <Options
                      setShowOpt={setShowOpt}
                      setShowDetails={setShowDetails}
                      handleDelete={handleDelete}
                    />
                  </motion.div>
                ) : null}
                {!showOpt && !isShare && (
                  <div
                    className="absolute top-1 right-1 dark:text-white"
                    onClick={() => setShowOpt(!showOpt)}
                  >
                    <BsThreeDotsVertical />
                  </div>
                )}
                {details.type != "Linkedin" && (
                  <div
                    className="absolute top-10 right-1 dark:text-white text-lg"
                    onClick={() => setShowAiChat(!showAiChat)}
                  >
                    <RiDvdAiFill />
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {showAiChat && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-primaryBlack/50">
              <div className="relative">
                <Ai link={details.link} setShowAiChat={setShowAiChat} type={details.type}/>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

interface OptionsProps {
  setShowOpt: (value: boolean) => void;
  setShowDetails: (value: boolean) => void;
  handleDelete: () => void;
}

const Options = ({
  setShowOpt,
  setShowDetails,
  handleDelete,
}: OptionsProps) => {
  return (
    <div className="w-35 h-25 md:w-40 md:h-28  bg-gray-300 dark:bg-primaryBlack pt-5  rounded-md border-1 border-blackOrange/70">
      <div className="absolute right-1 top-1" onClick={() => setShowOpt(false)}>
        <BsThreeDotsVertical />
      </div>
      <div
        className="p-2 pl-5 flex flex-row gap-2 justify-start items-center  cursor-pointer font-primary hover:bg-yellow-500/40"
        onClick={() => {
          setShowDetails(false);
          setShowOpt(false);
        }}
      >
        <MdOutlineCancelPresentation className="hover:text-red-600 text-md md:text-lg" />
        <span className="text-black dark:text-white text-md md:text-xl">
          Close Details
        </span>
      </div>
      <div className="border-b-1 w-full  border-gray-700"></div>
      <div
        className="p-2 flex pl-5 group felx-row gap-2 hover:bg-red-600/20 justify-start items-center cursor-pointer  font-primary"
        onClick={handleDelete}
      >
        <MdDelete className="hover:text-whiteOrange dark:hover:text-blackOrange text-md md:text-lg" />
        <span className="text-black dark:text-white text-md md:text-xl">Delete</span>
      </div>
    </div>
  );
};
