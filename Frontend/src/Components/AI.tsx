import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import axios from "axios";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";
import { InputBox } from "./UI/InputBox";
import { FaCircleArrowUp } from "react-icons/fa6";
import { GrYoutube } from "react-icons/gr";
import { Typewrite } from "./UI/Typewrite";
import { TiDeleteOutline } from "react-icons/ti";
import { IoCopyOutline } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";

import {
  MdSentimentVerySatisfied,
  MdOutlineSentimentNeutral,
  MdOutlineSentimentDissatisfied,
} from "react-icons/md";
import { BiAngry } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useToast } from "./UI/ToastProvider";

const token = localStorage.getItem("tokenBB");

interface ChatMessage {
  id: string;
  prompt: string;
  response: string;
}

interface AiProps {
  link: string;
  setShowAiChat: (value: boolean) => void;
  type: string;
}

export const Ai = ({ setShowAiChat, link, type }: AiProps) => {
  return (
    <motion.div
      className="md:w-[700px] h-[500px] bg-gray-200 dark:bg-primaryBlack rounded-md border dark:border-blackOrange border-whiteOrange flex flex-col"
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
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold ml-2 mr-2 flex items-center gap-1"
          >
            {type === "Youtube" ? (
              <GrYoutube className="text-red-600/70 hover:text-red-600 cursor-pointer" />
            ) : (
              <BsTwitterX className="text-gray-500 hover:text-gray-700 dark:hover:text-white cursor-pointer" />
            )}
          </a>
          {type === "Youtube" ? "Video" : "Tweet"}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {type === "Youtube" ? (
          <YoutubeExplore link={link} />
        ) : (
          <TweetSentiment link={link} />
        )}
      </div>
    </motion.div>
  );
};

const YoutubeExplore = ({ link }: { link: string }) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

  const [waitForResponse, setWaitForResponse] = useState<boolean>(false);

  const generateId = () => Date.now().toString();
  const { hash } = useParams<{ hash: string }>();

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

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

    setChatHistory((prev) => [...prev, { id, prompt, response: "" }]);
    setMessage("");
    setWaitForResponse(true);

    try {
      const res = await axios.post(
        `https://api.brainbank.cv/v1/Ai/Youtube`,
        { link, sendMessage: prompt, hash: hash },
        { headers: { Authorization: token || "" } }
      );
      const responseText = res.data.response as string;

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === id ? { ...chat, response: responseText } : chat
        )
      );
      setWaitForResponse(false);
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
      setWaitForResponse(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.length > 0 && !waitForResponse) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = useCallback((id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
  }, []);

  return (
    <div className="w-90 md:w-full flex-1 flex flex-col overflow-hidden">
      {/* Chat  */}
      <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className="w-full mb-15 flex flex-col justify-end items-end "
          >
            {/* Prompt */}
            <div className="w-70 break-words h-fit pl-5 pr-5 pt-2 pb-2 dark:text-white bg-gray-400 dark:bg-gray-500/60 rounded-2xl">
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
                  <div className="flex flex-row gap-4 mt-2 md:opacity-0 group-hover:md:opacity-100 justify-start items-center">
                    {/* Delete Button with Label */}
                    <div className="relative">
                      <button
                        className="peer cursor-pointer"
                        onClick={() => handleDelete(chat.id)}
                      >
                        <TiDeleteOutline className=" text-2xl group  font-bold hover:text-red-600 text-gray-500" />
                      </button>
                      <span className="absolute top-6 -left-1  mt-1 text-xs dark:text-white opacity-0 peer-hover:opacity-100 bg-gray-500 p-1 font-semibold rounded">
                        Remove
                      </span>
                    </div>
                    {/* Copy Button with Label */}
                    <div className="relative">
                      <button
                        className="peer cursor-pointer"
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
      <div className=" flex-none sticky bottom-0 bg-gray-200 dark:bg-primaryBlack font-primary p-4">
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
          {message && !waitForResponse && (
            <div
              className="absolute top-3 right-5 md:top-2 md:right-40 text-2xl dark:text-white cursor-pointer"
              onClick={handleSend}
            >
              <FaCircleArrowUp />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TweetSentiment = ({ link }: { link: string }) => {
  const [showSenAna, setShowSenAna] = useState<boolean>(true);
  const [tweetData, setTweetData] = useState<string>("");
  const [sentiment, setSentiment] = useState<string>("");
  const [generating, setGenerating] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  const { hash } = useParams<{ hash: string }>();

  const {addToast} = useToast();

  const handelSentimentAnalysis = async () => {
    setShowSenAna(false);
    setDone(false);
    setGenerating("generating");

    try {
      const response = await axios.post(
        "https://api.brainbank.cv/v1/Ai/Twitter",
        { link, tweetData: tweetData, hash: hash },
        { headers: { Authorization: token || "" } }
      );

      if (tweetData.length == 0) {
        setTweetData(response.data.tweetData);
      }

      setSentiment(response.data.sentimentText);
      setGenerating("done");
    } catch (e: unknown) {

      addToast({
        type: "failure",
        size: "md",
        message: "Sentiment analysis failed try again later",
      });

    } 
  };
  return (
    <div className="w-90 md:w-full flex flex-col h-full font-primary px-6 items-center justify-center">
      <AnimatePresence>
        {(showSenAna) && (
          <>
            <h2 className="text-2xl text-white mt-10 text-center">
              Welcome! Choose how you think the tweet feels
            </h2>
            <motion.div
              className="h-60 w-55 mt-10 flex flex-col justify-between items-center bg-gray-400/30
                   dark:bg-gray-600/20 border border-gray-500 rounded-2xl p-6 cursor-pointer shadow-md shadow-gray-500 dark:shadow-gray-700 hover:bg-transparent"
              initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.4, delay: 0.5 }}
              exit={{ scale: 0.1, opacity: 0, filter: "blur(10px)" }}
              onClick={handelSentimentAnalysis}
            >
              <h1 className="text-2xl dark:text-gray-300 font-semibold text-center">
                Sentiment Analysis
              </h1>

              <div className="grid grid-cols-2 gap-4 mt-2 justify-items-center">
                <MdSentimentVerySatisfied className="text-4xl text-green-500 hover:scale-110" />
                <MdOutlineSentimentNeutral className="text-4xl text-blue-500 hover:scale-110" />
                <MdOutlineSentimentDissatisfied className="text-4xl text-yellow-500 hover:scale-110" />
                <BiAngry className="text-4xl text-red-500 hover:scale-110" />
              </div>

              <p className="mt-4 dark:text-gray-400 text-center">
                Tap to analyze the tweet’s mood.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {generating === "generating" && (
          <p className="text-white text-xl md:text-2xl self-center mt-4 font-Ai">
            Generating…
          </p>
        )}

        {generating === "done" || done && (
          <div className="flex-1 w-full overflow-y-auto p-4 pt-10 rounded-md ">
            <Typewrite data={sentiment} setDone={setDone} />
          </div>
        )}
      </div>
    </div>
  );
};
