import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../UI/ToastProvider";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { callBackend } from "../../store/atoms/backednCallAtom";
import { Card } from "../UI/Card";
import { selectOpt } from "../../store/atoms/formAtom";
import { YoutubeSharedSelector } from "../../store/selectors/shareBrainSelector";
import { NoContent } from "../UI/NoContent";

export interface ResponseStr {
  type: string;
  description: string;
  link: string;
  tags: [string];
  title: string;
  date: string;
  userId?: { _id: string; username: string };
  _id: string;
}

export const Youtube = ({isShare}:{isShare: boolean}) => {
  const setCurrtab = useSetRecoilState(currSidebar);
  const [videos, setVideos] = useState<ResponseStr[]>([]);
  const { addToast } = useToast();
  const setSelectedOption = useSetRecoilState(selectOpt);
  const [isCallBackend, setCallBackend] = useRecoilState(callBackend);
  const [loading, setLoading] = useState(true);
  const fetchCalled = useRef(false);
  const shareYtPosts = useRecoilValue(YoutubeSharedSelector)
  const hasFiredToast = useRef(false);


  useEffect(() => {
    setCurrtab("Youtube");
    setSelectedOption("Youtube");

    if(isShare){
      setVideos(shareYtPosts);
      setLoading(false)
      return;
    }

    if (fetchCalled.current) {
      return;
    }
    fetchCalled.current = true;

    const getAllVideos = async () => {
      try {
        const token = localStorage.getItem("tokenBB");

        const latestId = videos[0]?._id;
        const url =
          `https://api.brainbank.cv/v1/content/fetch?type=Youtube` +
          (latestId ? `&latestId=${encodeURIComponent(latestId)}` : "");

        const response = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 201) {
          const newContent = response.data.AllContent;
          if (latestId) {
            setVideos((prev) =>
              newContent.length ? [...newContent, ...prev] : prev
            );
          } else {
            setVideos(response.data.AllContent);
          }
        }
      } catch (e) {
        addToast({
          type: "failure",
          size: "md",
          message: "Content fetch failed",
        });
      }finally{
        setLoading(false);
        setCallBackend(false);
      }
      
    };

    getAllVideos().finally(() => {
      fetchCalled.current = false;
    });
  }, [isCallBackend]);

  useEffect(() => {
    if (hasFiredToast.current) return; 

    const timer = setTimeout(() => {
      addToast({
        type: "progress",
        size: "md",
        message: "Embedding YouTube videos may take a moment…",
      });
      hasFiredToast.current = true;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const removeVideo = (id: string) => {
    setVideos((prevVideo) =>
      prevVideo.filter((video: ResponseStr) => video._id !== id)
    );
  };
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-primaryBlack md:pt-40 pt-10">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-white text-3xl">Fetching...</h1>
        </div>
      ) : videos.length > 0 ? (
        <div className="flex-1 overflow-y-auto pt-46 p-2 md:p-4 top-30 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full justify-center items-center">
            {videos.map((video: ResponseStr) => (
              <Card
                key={video._id}
                preview={<YouTubeEmbed videoUrl={video.link} />}
                details={video}
                removeContent={removeVideo}
                isShare={isShare}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full text-white text-center mt-20 ">
          <NoContent type="YouTube"/>
        </div>
      )}
    </div>
  );
};

export const YouTubeEmbed = ({ videoUrl }: { videoUrl: string }) => {
  // Extract YouTube video ID from the URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : "";
  };

  return (
    <div className="flex justify-center items-center p-4">
      {videoUrl ? (
        <iframe
          className="w-70 aspect-video rounded-lg shadow-lg"
          src={getYouTubeEmbedUrl(videoUrl)}
          title="YouTube Video"
          allowFullScreen
        ></iframe>
      ) : (
        <p className="text-center text-gray-500">No video URL provided</p>
      )}
    </div>
  );
};

export default YouTubeEmbed;
