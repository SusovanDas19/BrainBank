import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "../UI/ToastProvider";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { callBackend } from "../../store/atoms/backednCallAtom";
import { selectOpt } from "../../store/atoms/formAtom";
import { Card  } from "../UI/Card";
import { ResponseStr } from "./Youtube";

export interface TweetResponse {
  type: string;
  content: string;
  link: string;
  date: string;
  userId: { _id: string; username: string };
  _id: string;
}

export const Twitter = () => {
  const setCurrtab = useSetRecoilState(currSidebar);
  const [tweets, setTweets] = useState([]);
  const { addToast } = useToast();
  const isCallBackend = useRecoilValue(callBackend);
  const setCallBackend = useSetRecoilState(callBackend);
  const setSelectedOption = useSetRecoilState(selectOpt);
  const [loading, setLoading] = useState(true);
  const theme: string = localStorage.getItem("theme") || "";

  useEffect(() => {
    setCurrtab("Twitter");
    setSelectedOption("Twitter");

    const getAllTweets = async () => {
      try {
        const token = localStorage.getItem("tokenBB");
        const response = await axios.get(
          "http://localhost:3000/v1/content/fetch?type=Twitter",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 201) {
          setTweets(response.data.AllContent);
        }
      } catch (e) {
        addToast({
          type: "failure",
          size: "md",
          message: "Failed to fetch tweets",
        });
      }
      setLoading(false);
      setCallBackend(false);
    };
    
    getAllTweets();

    const timer = setTimeout(()=>{
        addToast({
          type: "progress",
          size: "md",
          message: "Embedding tweets may take a moment..."
        })
      }, 7000)
    

    return ()=>{clearTimeout(timer)}
  }, [isCallBackend]);

  const removeTweet = (id: string) => {
    setTweets((prevTweets) =>
      prevTweets.filter((tweet: ResponseStr) => tweet._id !== id)
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-primaryBlack">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-white text-3xl">Fetching...</h1>
        </div>
      ) : tweets.length > 0 ? (
        <div className="flex-1 overflow-y-auto pt-46 p-4 top-30 pb-10">
          <div className="columns-4 gap-4 pr-10">
            {tweets.map((tweet: ResponseStr) => (
              <div key={tweet._id} className="break-inside-avoid mb-2">
                <Card
                    key={tweet._id}
                    preview={<TwitterEmbed tweetUrl={tweet.link} theme={theme}/>}
                    details={tweet}
                    removeContent={removeTweet}
                />
              </div>
              
              
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full text-white text-center mt-20 text-9xl">
          <h1>No tweets available</h1>
        </div>
        
      )}
+    </div>
  );
};

const TwitterEmbed = ({ tweetUrl, theme }: { tweetUrl: string, theme: string }) => {
    const fixedTweetUrl = tweetUrl.replace("x.com", "twitter.com");

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    
    }, []);
  
    return (
      <div className="w-80  flex justify-center items-center p-4">
        {fixedTweetUrl ? (
          <blockquote className="twitter-tweet" data-theme={theme}>
            <a href={fixedTweetUrl}></a>
          </blockquote>
        ) : (
          <p className="text-center text-gray-500 p-4 border-1 border-red-600/40">
            ⚠️ No Tweet URL provided
          </p>
        )}
      </div>
    );
  };


export default TwitterEmbed;
