import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "../UI/ToastProvider";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { showFormState } from "../../store/atoms/formAtom";

export const Youtube = () => {
  const setCurrtab = useSetRecoilState(currSidebar);
  const [videos, setVideos] = useState([]);
  const {addToast} = useToast();
  const showFrom = useRecoilValue(showFormState);
  useEffect(()=>{
    setCurrtab("Youtube");
    const getAllVideos = async ()=>{
      try{
        const token = localStorage.getItem("tokenBB");
        const response = await axios.get("http://localhost:3000/v1/content/fetch?type=Youtube",{
          headers: {
            Authorization: token,
          }
        })
        if(response.status === 201){
          setVideos(response.data.AllContent);
          console.log(response.data.AllContent);
          addToast({
            type: "success",
            size: "md",
            message: "All content fetched.",
          });
        }
      }catch(e){
        addToast({
          type: "failure",
          size: "md",
          message: "Content fetched fail",
        });
      }
    }
    getAllVideos();
  },[showFrom])
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-primaryBlack">
      <div className="flex-1 overflow-y-auto pt-46 p-4 top-30">
        <div className="grid grid-cols-3 w-full justify-center items-center">
          {videos.map((video)=>(
            //@ts-ignore
            <YouTubeEmbed key={video._id} videoUrl={video.link}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const YouTubeEmbed = ({ videoUrl }: { videoUrl: string }) => {
  // Extract YouTube video ID from the URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : "";
  };

  return (
    <div className="flex justify-center items-center p-4">
      {videoUrl ? (
        <iframe
          className="w-80 aspect-video rounded-lg shadow-lg"
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
