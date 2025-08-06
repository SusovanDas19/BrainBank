import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { selectOpt } from "../../store/atoms/formAtom";
import axios from "axios";
import { useToast } from "../UI/ToastProvider";
import { callBackend } from "../../store/atoms/backednCallAtom";
import { ResponseStr } from "./Youtube";
import { Container } from "../UI/Container";
import { AichatSharedSelector } from "../../store/selectors/shareBrainSelector";
import { NoContent } from "../UI/NoContent";

export const Aichat = ({isShare}:{isShare: boolean}) => {
  const setCurrTab = useSetRecoilState(currSidebar);
  const setSelectedOption = useSetRecoilState(selectOpt);
  const [isCallBackend, setCallBackend] = useRecoilState(callBackend);
  const [allData, setAllData] = useState<ResponseStr[]>([]);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const fetchCalled = useRef(false);
  const ShareAiChats = useRecoilValue(AichatSharedSelector);
  
  
  useEffect(() => {
    setCurrTab("Aichat");
    setSelectedOption("Aichat");

    if(isShare){
      setAllData(ShareAiChats);
      setLoading(false);
      return;
    }


    if (fetchCalled.current) {
      return;
    }
    fetchCalled.current = true;

    const getData = async () => {
      try {
        const token = localStorage.getItem("tokenBB");

        const latestId = allData[0]?._id;
        const url =
          `https://api.brainbank.cv/v1/content/fetch?type=Aichat` +
          (latestId ? `&latestId=${encodeURIComponent(latestId)}` : "");


        const response = await axios.get(
          url,{
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.status === 201) {
          const newContent = response.data.AllContent;
          if (latestId) {
            setAllData((prev) =>
              newContent.length ? [...newContent, ...prev] : prev
            );
          } else {
            setAllData(response.data.AllContent);
          }        }
      } catch (e) {
        addToast({
          type: "failure",
          size: "md",
          message: "Content fetched fail",
        });
      }finally{
        setLoading(false);
        setCallBackend(false);
      }
    };

    getData().finally(() => {
      fetchCalled.current = false;
    });
  }, [isCallBackend]);

  const removeContent = (id: string)=>{
    setAllData((prevData)=>
      prevData.filter((data: ResponseStr)=> data._id !== id)
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-primaryBlack">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-white text-3xl">Fetching...</h1>
        </div>
      ) : allData.length > 0 ? (
        <div className="flex-1 overflow-y-auto pt-46 p-4 top-30 pb-10">
          <div className="grid md:grid-cols-4 gap-10 w-full justify-center items-center mt-10">
            {allData.map((data: ResponseStr) => (
              <div key={data._id}>
                <Container
                  isShare={isShare}
                  details={data}
                  removeContent={removeContent}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full text-white text-center mt-20 ">
           <NoContent type="AI Chat's"/>
        </div>
      )}
    </div>
  );
};
