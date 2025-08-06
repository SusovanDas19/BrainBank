import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currSidebar } from "../../store/atoms/currSideTab";
import { selectOpt } from "../../store/atoms/formAtom";
import axios from "axios";
import { useToast } from "../UI/ToastProvider";
import { callBackend } from "../../store/atoms/backednCallAtom";
import { ResponseStr } from "./Youtube";
import { Container } from "../UI/Container";
import { RandomSharedSelector } from "../../store/selectors/shareBrainSelector";
import { NoContent } from "../UI/NoContent";

export const Random = ({isShare}:{isShare: boolean}) => {
  const setCurrTab = useSetRecoilState(currSidebar);
  const setSelectedOption = useSetRecoilState(selectOpt);
  const [isCallBackend, setCallBackend] = useRecoilState(callBackend);
  const [allData, setAllData] = useState<ResponseStr[]>([]);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const fetchCalled = useRef(false);
  const ShareRandom = useRecoilValue(RandomSharedSelector);

  useEffect(() => {
    setCurrTab("Random");
    setSelectedOption("Random");

    if(isShare){
      setAllData(ShareRandom);
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
          `https://api.brainbank.cv/v1/content/fetch?type=Random` +
          (latestId ? `&latestId=${encodeURIComponent(latestId)}` : "");

        const response = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 201) {
          const newContent = response.data.AllContent;
          if (latestId) {
            setAllData((prev) =>
              newContent.length ? [...newContent, ...prev] : prev
            );
          } else {
            setAllData(response.data.AllContent);
          }
        }
      } catch (e) {
        addToast({
          type: "failure",
          size: "md",
          message: "Content fetched fail",
        });
      }
      finally {
        setLoading(false);
        setCallBackend(false);
      }
    };

    getData().finally(() => {
      fetchCalled.current = false;
    });
    
  }, [isCallBackend]);

  const removeContent = (id: string) => {
    setAllData((prevData) =>
      prevData.filter((data: ResponseStr) => data._id !== id)
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-primaryBlack">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-white text-3xl">Fetching...</h1>
        </div>
      ) : allData.length > 0 ? (
        <div className="flex-1 overflow-y-auto pt-46 p-4 top-30 pb-10 mt-10">
          <div className="grid md:grid-cols-4 gap-10 w-full justify-center items-center">
            {allData.map((data: ResponseStr) => (
              <div>
                <Container
                  key={data._id}
                  details={data}
                  removeContent={removeContent}
                  isShare={isShare}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full text-white text-center mt-20 text-9xl">
          <NoContent type="Random"/>
        </div>
      )}
    </div>
  );
};
