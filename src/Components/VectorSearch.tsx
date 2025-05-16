import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { InputBox } from "./UI/InputBox";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { recentSectionPosts } from "../store/atoms/recentSection";
import { ResponseStr } from "./Tabs/Youtube";
import { useToast } from "./UI/ToastProvider";

export const Search = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [shortcut, setShortcut] = useState<string>("");
  const  setPosts = useSetRecoilState<ResponseStr[]>(recentSectionPosts);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("tokenBB");
  const { addToast } = useToast();

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

  const handleVectorSearch = async () => {
    const query = inputRef.current?.value;
    try {
      addToast({
        type: "progress",
        size: "md",
        message: "Searching",
      });

      const response = await axios.post(
        "http://localhost:3000/v1/search/relevent",
        { query: query },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if(response.status === 200){
        setPosts(response.data.data);
        addToast({
        type: "success",
        size: "md",
        message: "Searching done",
      });
      }

      
    } catch (e) {
      console.log("error" + e);
      addToast({
        type: "failure",
        size: "md",
        message: "Vector search failed",
      });
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleVectorSearch();
    }
    if (event.key === "Escape") {
      setSearchInput("");
      setPosts([]);
      fetchRecentPosts();
    }
    if (event.key === "/") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="relative inline-block ml-85">
      <span
        className="absolute z-15 text-2xl bottom-3 left-2 text-whiteOrange dark:text-blackOrange"
        onMouseEnter={() => setShortcut("search")}
        onMouseLeave={() => setShortcut("")}
      >
        <IoSearchOutline />
        {shortcut === "search" && (
          <span className="absolute top-7 left-0 text-sm font-bold bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-md text-gray-500 dark:text-gray-200/60 border-1">
            /
          </span>
        )}
      </span>
      <InputBox
        variant="auth"
        placeholder="Search.."
        type="text"
        name="search"
        Icon={true}
        onChange={(e) => {
          const v = e.target.value;
          setSearchInput(v);
          if (v === "") {
            fetchRecentPosts();
          }
        }}
        inputRef={inputRef}
        value={searchInput}
      />
      {searchInput.length > 0 && (
        <span
          className="absolute text-2xl  z-15 bottom-3 right-2 text-gray-700 dark:text-white hover:text-red-600 cursor-pointer"
          onClick={() => {
            setSearchInput("");
            setShortcut("");
            fetchRecentPosts();
          }}
          onMouseEnter={() => setShortcut("remove")}
          onMouseLeave={() => setShortcut("")}
        >
          <RxCrossCircled />
          {shortcut === "remove" && (
            <span className="absolute top-0 left-7 text-sm font-bold bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-md text-gray-500 dark:text-gray-200/60 border-1">
              Esc
            </span>
          )}
        </span>
      )}
    </div>
  );
};
