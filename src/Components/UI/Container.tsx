import axios from "axios";
import { useToast } from "./ToastProvider";
import { ResponseStr } from "../Tabs/Youtube";
import { AnimatePresence, motion } from "motion/react";
import { IoMdLink } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useRef, useState } from "react";
import useClickOutside from "../../customHooks/useClickOutside";

interface Containerprops {
  details: ResponseStr;
  removeContent: (id: string) => void;
}
export const Container = ({ details, removeContent }: Containerprops) => {
  const { addToast } = useToast();
  const [showDetele, setShowDelete] = useState(false);
  const deleteRef = useRef(null);

  useClickOutside(deleteRef, ()=>{
    setShowDelete(false)
  })

  const handleDelete = async () => {
    const token = localStorage.getItem("tokenBB");
    try {
      const response = await axios.delete(
        "http://localhost:3000/v1/content/remove",
        {
          data: { contentId: details._id },
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        removeContent(details._id);

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

  return (
    <div>
      <motion.div
        key={details._id}
        className="absolute group top-45  w-70 rounded-md bg-white/5 dark:bg-black/30 backdrop-blur-md border border-blackOrange/50  p-2 shadow-lg z-100 font-primary"
        initial={{ y: -50, opacity: 0, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "backOut" }}
        exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
      >
        <h1 className="text-lg font-semibold text-black dark:text-white">
          {details.title}
        </h1>
        <p className="text-sm text-black dark:text-white">
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
              className="flex items-center justify-center max-w-[110px] bg-transparent px-2 rounded-2xl text-black border-1 dark:text-white font-primary text-lg font-bold border-gray-700 group"
            >
              <p className="truncate text-gray-300">
                <span className="text-blackOrange">#</span>
                {tag}
              </p>
            </div>
          ))}
        </div>
        <div>
          <div
            className="absolute top-2 right-2 group"
            onClick={() => setShowDelete(!showDetele)}
          >
            <MdDelete className=" text-red-600 text-lg opacity-0 group-hover:opacity-100 cursor-pointer" />
          </div>

          <AnimatePresence>
            {showDetele && (
              <motion.div 
              className="w-30 h-20 border-1 border-red-800 absolute top-2 right-10 bg-red-950/30 rounded backdrop-blur-3xl text-black dark:text-white text-xl flex justify-center items-start  flex-col"
              initial={{y:-50, opacity: 0, filter: "blur(10px)"}}
              animate={{y: 0, opacity: 1, filter: "blur(0px)"}}
              transition={{duration: 0.3}}
              exit={{y:-50, opacity: 0, filter: "blur(10px)"}}
              ref={deleteRef}
              >
                <div
                  className="w-full hover:bg-red-700/50 p-1 cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </div>
                <div
                  className="cursor-pointer w-full hover:bg-green-700/50 p-1"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
