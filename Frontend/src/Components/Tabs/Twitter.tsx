import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../UI/ToastProvider";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { callBackend } from "../../store/atoms/backednCallAtom";
import { selectOpt } from "../../store/atoms/formAtom";
import { Card  } from "../UI/Card";
import { ResponseStr } from "./Youtube";
import { TwitterSharedSelector } from "../../store/selectors/shareBrainSelector";
import { NoContent } from "../UI/NoContent";

export interface TweetResponse {
  type: string;
  content: string;
  link: string;
  date: string;
  userId: { _id: string; username: string };
  _id: string;
}

export const Twitter = ({isShare}:{isShare: boolean}) => {
  const setCurrtab = useSetRecoilState(currSidebar);
  const [tweets, setTweets] = useState<ResponseStr[]>([]);
  const { addToast } = useToast();
  const isCallBackend = useRecoilValue(callBackend);
  const setCallBackend = useSetRecoilState(callBackend);
  const setSelectedOption = useSetRecoilState(selectOpt);
  const [loading, setLoading] = useState(true);
  const theme: string = localStorage.getItem("theme") || "";
  const fetchCalled = useRef(false);
  const shareTweets = useRecoilValue(TwitterSharedSelector);
  const hasFiredToast = useRef(false);


  useEffect(() => {
    setCurrtab("Twitter");
    setSelectedOption("Twitter");


    if(isShare){
      setTweets(shareTweets);
      setLoading(false)
      return;
    }

    if (fetchCalled.current) {
      return;
    }
    fetchCalled.current = true;

    const getAllTweets = async () => {
      try {
        const token = localStorage.getItem("tokenBB");
        
        const latestId = tweets[0]?._id;
        const url =
          `https://api.brainbank.cv/v1/content/fetch?type=Twitter` +
          (latestId ? `&latestId=${encodeURIComponent(latestId)}` : "");


        const response = await axios.get(url,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.status === 201) {
          const newContent = response.data.AllContent;
          if (latestId) {
            setTweets((prev) =>
              newContent.length ? [...newContent, ...prev] : prev
            );
          } else {
            setTweets(response.data.AllContent);
          }        
        }
      } catch (e) {
        addToast({
          type: "failure",
          size: "md",
          message: "Failed to fetch tweets",
        });
      }finally{
        setLoading(false);
        setCallBackend(false);
      }
    };
    
    getAllTweets().finally(() => {
      fetchCalled.current = false;
    });
    
  
  }, [isCallBackend]);

  useEffect(() => {
    if (hasFiredToast.current) return; 

    const timer = setTimeout(() => {
      addToast({
        type: "progress",
        size: "md",
        message: "Embedding tweets may take a moment...",
      });
      hasFiredToast.current = true;
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const removeTweet = (id: string) => {
    setTweets((prevTweets) =>
      prevTweets.filter((tweet: ResponseStr) => tweet._id !== id)
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-primaryBlack pl-5">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-white text-3xl">Fetching...</h1>
        </div>
      ) : tweets.length > 0 ? (
        <div className="flex-1 overflow-y-auto pt-46 p-4 top-30 pb-10">
          <div className="columns-1 md:columns-4 gap-4 pr-10">
            {tweets.map((tweet: ResponseStr) => (
              <div key={tweet._id} className="break-inside-avoid mb-2">
                <Card
                    key={tweet._id}
                    preview={<TwitterEmbed tweetUrl={tweet.link} theme={theme}/>}
                    details={tweet}
                    removeContent={removeTweet}
                    isShare={isShare}
                />
              </div>
              
              
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full text-white text-center mt-20 text-9xl">
          <NoContent type="Twitter"/>
        </div>
        
      )}
  </div>
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
