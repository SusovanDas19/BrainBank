import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import axios from "axios";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { motion } from "motion/react";
import { InputBox } from "./UI/InputBox";
import { FaCircleArrowUp } from "react-icons/fa6";
import { GrYoutube } from "react-icons/gr";
import { Typewrite } from "./UI/Typewrite";
import { TiDeleteOutline } from "react-icons/ti";
import { IoCopyOutline } from "react-icons/io5";

interface ChatMessage {
  id: string;
  prompt: string;
  response: string;
}

interface AiProps {
  videoLink: string;
  setShowAiChat: (value: boolean) => void;
}

export const Ai = ({ setShowAiChat, videoLink }: AiProps) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [waitForResponse, setWaitForResponse] = useState<boolean>(false);

  const generateId = () => Date.now().toString();

  const handleSend = async () => {
    if (!message.trim()) {
      alert("Please enter a prompt before sending.");
      return;
    } else if (message.length > 150) {
      alert("Your prompt is too large");
      return;
    }
    const prompt = message;
    const id = generateId();

    // Immediately add the new prompt with an empty response
    setChatHistory((prev) => [...prev, { id, prompt, response: "" }]);
    setMessage("");
    setWaitForResponse(true);

    const token = localStorage.getItem("tokenBB");
    try {
      const res = await axios.post(
        "http://localhost:3000/v1/Ai/youtube",
        { videoLink, sendMessage: prompt },
        { headers: { Authorization: token || "" } }
      );
      const responseText = res.data.response as string;

      // Update the chat entry with the received response using its unique id
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === id ? { ...chat, response: responseText } : chat
        )
      );
      setWaitForResponse(false)
    } catch (error: any) {
      console.error("Error sending request:", error);
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === id
            ? {
                ...chat,
                response: "Error generating answer. Please try again.",
              }
            : chat
        )
      );
      setWaitForResponse(false)
    }
  };

  // Handle enter key to send prompt
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.length > 0 && !waitForResponse) {
      e.preventDefault();
      handleSend();
    }
  };

  
  const handleDelete = useCallback((id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <motion.div
      className="w-[700px] h-[500px] bg-gray-200 dark:bg-primaryBlack rounded-md border dark:border-blackOrange border-whiteOrange flex flex-col"
      initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4 }}
      exit={{ scale: 0.1, opacity: 0, filter: "blur(10px)" }}
    >
      {/* Header */}
      <div className="relative flex-none">
        <motion.div
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          onClick={() => setShowAiChat(false)}
          className="absolute cursor-pointer top-1 right-2 text-2xl hover:bg-red-600/20 p-1 pl-2 pr-2 rounded hover:border hover:border-red-600 text-gray-400 hover:dark:text-white hover:text-black"
        >
          <MdOutlineCancelPresentation />
        </motion.div>
        <div className="font-primary text-black dark:text-white font-medium text-xl mt-2 ml-5 mr-20 border-b pb-2 border-gray-700/70 flex items-center">
          Exploring
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold ml-2 mr-2 flex items-center gap-1"
          >
            <GrYoutube className="text-red-600/70 hover:text-red-600" />
          </a>
          Video
        </div>
      </div>

      {/* Chat  */}
      <div ref={chatHistoryRef} className="flex-grow p-4 overflow-y-auto">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className="w-full mb-15 flex flex-col justify-end items-end "
          >
            {/* Prompt */}
            <div className="w-fit pl-5 pr-5 pt-2 pb-2 dark:text-white bg-gray-400 dark:bg-gray-500/60 rounded-full">
              <p>{chat.prompt}</p>
            </div>
            {/* Response */}
            <div className="w-full  mt-2 p-2  rounded relative bg-gray-400/50 dark:bg-gray-400/10 ">
              {chat.response === "" ? (
                <p className="text-xl font-normal font-primary dark:text-white">
                  Analysing the video...
                </p>
              ) : (
                <div className="relative group">
                  <Typewrite data={chat.response} />
                  <div className="flex flex-row gap-4 mt-2 opacity-0 group-hover:opacity-100 justify-start items-center">
                    {/* Delete Button with Label */}
                    <div className="relative">
                      <button className="peer cursor-pointer" onClick={() => handleDelete(chat.id)}>
                        <TiDeleteOutline className=" text-2xl group  font-bold hover:text-red-600 text-gray-500" />
                      </button>
                      <span className="absolute top-6 -left-1  mt-1 text-xs dark:text-white opacity-0 peer-hover:opacity-100 bg-gray-500 p-1 font-semibold rounded">
                        Remove
                      </span>
                    </div>
                    {/* Copy Button with Label */}
                    <div className="relative">
                      <button className="peer cursor-pointer"
                        onClick={() =>
                          navigator.clipboard.writeText(chat.response)
                        }
                      >
                        <IoCopyOutline className=" text-xl hover:text-white text-gray-400" />
                      </button>
                      <span className="absolute top-6 -left-1  mt-1 text-xs dark:text-white opacity-0 peer-hover:opacity-100 bg-gray-500 p-1 font-semibold rounded">
                        Copy
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area*/}
      <div className="flex-none p-4  border-gray-400 font-primary">
        <div className="relative">
          <InputBox
            type="text"
            name="askAi"
            variant="atForm"
            placeholder="Ask anything about this YT video"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {(message && !waitForResponse) && (
            <div
              className="absolute top-2 right-40 text-2xl dark:text-white cursor-pointer"
              onClick={handleSend}
            >
              <FaCircleArrowUp />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
