import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../UI/ToastProvider";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { callBackend } from "../../store/atoms/backednCallAtom";
import { selectOpt } from "../../store/atoms/formAtom";
import { Card } from "../UI/Card";
import { ResponseStr } from "./Youtube";
import { LinkedinSharedSelector } from "../../store/selectors/shareBrainSelector";
import { NoContent } from "../UI/NoContent";

export interface LinkedInResponse {
  type: string;
  content: string;
  link: string;
  date: string;
  userId: { _id: string; username: string };
  _id: string;
}

export const Linkedin = ({isShare}:{isShare: boolean}) => {
  const setCurrtab = useSetRecoilState(currSidebar);
  const [posts, setPosts] = useState<ResponseStr[]>([]);
  const { addToast } = useToast();
  const isCallBackend = useRecoilValue(callBackend);
  const setCallBackend = useSetRecoilState(callBackend);
  const setSelectedOption = useSetRecoilState(selectOpt);
  const [loading, setLoading] = useState(true);
  const fetchCalled = useRef(false);
  const hasFiredToast = useRef(false);
  const shareLinkedInPosts = useRecoilValue(LinkedinSharedSelector);
  

  useEffect(() => {
    setCurrtab("Linkedin");
    setSelectedOption("Linkedin");

    if(isShare){
      setPosts(shareLinkedInPosts);
      setLoading(false);
      return;
    }

    if (fetchCalled.current) {
      return;
    }
    fetchCalled.current = true;

    const getAllPosts = async () => {
      try {
        const token = localStorage.getItem("tokenBB");
        
        const latestId = posts[0]?._id;
        const url =
          `https://api.brainbank.cv/v1/content/fetch?type=Linkedin` +
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
            setPosts((prev) =>
              newContent.length ? [...newContent, ...prev] : prev
            );
          } else {
            setPosts(response.data.AllContent);
          }
        }
      } catch (e) {
        addToast({
          type: "failure",
          size: "md",
          message: "Failed to fetch LinkedIn posts",
        });
      }finally{
        setLoading(false);
        setCallBackend(false);
      }
      
    };
    getAllPosts().finally(()=>{
      fetchCalled.current = false;
    });

   
  }, [isCallBackend]);

  useEffect(() => {
    if (hasFiredToast.current) return; 

    const timer = setTimeout(() => {
      addToast({
        type: "progress",
        size: "md",
        message: "Embedding Linkedin Posts may take a moment...",
      });
      hasFiredToast.current = true;
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const removePost = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post: ResponseStr) => post._id !== id)
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-primaryBlack">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-white text-3xl">Fetching...</h1>
        </div>
      ) : posts.length > 0 ? (
        <div className="flex-1 overflow-y-auto pt-46 p-4 top-30 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full justify-center items-center pl-10 pr-10 mb-50">
            {posts.map((post: ResponseStr) => (
                <Card
                  preview={<LinkedInEmbed postUrl={post.link}/>}
                  details={post}
                  removeContent={removePost}
                  isShare={isShare}
                />
              
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full text-white text-center mt-20 ">
          <NoContent type="LinkedIn"/>
        </div>
      )}
    </div>
  );
};


const getEmbedUrl = (postUrl: string) => {
    const match = postUrl.match(/([a-zA-Z]+)-(\d+)/);
    return match ? `https://www.linkedin.com/embed/feed/update/urn:li:${match[1]}:${match[2]}` : "";
};  

export const LinkedInEmbed = ({ postUrl }: { postUrl: string }) => {
    const embedUrl = getEmbedUrl(postUrl);
    return (
      <div className="w-70 h-auto flex justify-center items-center p-4">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="LinkedIn Post"
            className="w-96 h-96 border border-gray-300 dark:border-gray-600 rounded-lg"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-center text-gray-500 p-4 border-1 border-red-600/40">
            ⚠️ Invalid LinkedIn post URL
          </p>
        )}
      </div>
    );
  };
  
  

export default Linkedin;
