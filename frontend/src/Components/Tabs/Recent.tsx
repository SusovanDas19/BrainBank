
import { useRecoilState, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { useEffect, useState } from "react";
import { selectOpt } from "../../store/atoms/formAtom";

import YouTubeEmbed, { ResponseStr } from "./Youtube";
import axios from "axios";
import { useToast } from "../UI/ToastProvider";
import { Card } from "../UI/Card";
import TwitterEmbed from "./Twitter";
import { LinkedInEmbed } from "./Linkedin";
import { Container } from "../UI/Container";
import { Button } from "../UI/Button";
import { Search } from "../VectorSearch";
import { recentSectionPosts } from "../../store/atoms/recentSection";

export const Recent = () => {
  const setCurrtab = useSetRecoilState(currSidebar);
  const setSelectedOption = useSetRecoilState(selectOpt);
  const [posts, setPosts] = useRecoilState<ResponseStr[]>(recentSectionPosts);
  const { addToast } = useToast();
  const theme: string = localStorage.getItem("theme") || "";
  const [others, setOthers] = useState<boolean>(false);
  

  useEffect(() => {
    setCurrtab("Recent");
    setSelectedOption("");
    fetchRecentPosts();
  }, [setPosts]);

  const fetchRecentPosts = async () => {
    try {
      const token = localStorage.getItem("tokenBB");
      const api = "http://localhost:3000/v1/content/fetch/recent";

      const response = await axios.get(api, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setPosts(response.data.recentPosts);
        console.log(response.data.recentPosts);
      }
    } catch (e) {
      console.log("Error");
      addToast({
        type: "failure",
        size: "md",
        message: "Content fetch failed",
      });
    }
  };
  
  const removePost = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((Post: ResponseStr) => Post._id !== id)
    );
  };

  const embedTypes = ["Youtube", "Twitter", "Linkedin"];
  const cardPosts = posts.filter((p) => embedTypes.includes(p.type));
  const containerPosts = posts.filter((p) => !embedTypes.includes(p.type));

  return (
    <div className="relative min-h-screen flex justify-center items-center text-black dark:text-white bg-white dark:bg-primaryBlack pb-10">
      <div className="flex flex-row z-1 items-center gap-30 absolute top-35 right-90 transform -translate-x-1/2 -translate-y-1/2">
        <Search />
        {containerPosts.length > 0 && <Button
          variant="secondary"
          size="md"
          text="Others"
          onClick={() => setOthers(!others)}
        />}
        
      </div>
      <div className="flex-1 overflow-y-auto p-4 mb-40">
        {others && containerPosts.length > 0 ? (
          <div className="min-h-screen pt-50"><Others containerPosts={containerPosts} removeContent={removePost} /></div>
          
        ) : (
          <div className="columns-4 gap-10 pr-10 pl-10 mt-50">
            {cardPosts.map((post) => (
              <div key={post._id} className="pb-7">
                <Card
                  preview={
                    post.type === "Youtube" ? (
                      <YouTubeEmbed videoUrl={post.link} />
                    ) : post.type === "Twitter" ? (
                      <TwitterEmbed tweetUrl={post.link} theme={theme} />
                    ) : (
                      <LinkedInEmbed postUrl={post.link} />
                    )
                  }
                  details={post}
                  removeContent={removePost}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Others = ({ containerPosts, removeContent }:{
  containerPosts: ResponseStr[],
  removeContent: (id: string)=> void;
}) => {
  return (
    <div className="w-full columns-4 gap-10 pr-10 pl-10 h-screen relative mt-10">
      {containerPosts.map((post) => (
        <div key={post._id} className="pb-7 break-inside-avoid">
          <Container details={post} removeContent={removeContent} />
        </div>
      ))}
    </div>
  );
};
