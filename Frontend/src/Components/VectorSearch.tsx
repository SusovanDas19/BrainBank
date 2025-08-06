import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { InputBox } from "./UI/InputBox";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { recentSectionPosts } from "../store/atoms/recentSection";
import { ResponseStr } from "./Tabs/Youtube";
import { useToast } from "./UI/ToastProvider";
import { useMediaQuery } from "../customHooks/useMediaQuery";

export const Search = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [shortcut, setShortcut] = useState<string>("");
  const setPosts = useSetRecoilState<ResponseStr[]>(recentSectionPosts);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("tokenBB");
  const { addToast } = useToast();

  const [isShowingSearchResults, setIsShowingSearchResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const isDesktop = useMediaQuery("(min-width: 768px)")
  

  const fetchRecentPosts = async () => {
    try {
      const token = localStorage.getItem("tokenBB");
      const api = "https://api.brainbank.cv/v1/content/fetch/recent";

      const response = await axios.get(api, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setPosts(response.data.recentPosts);
      }
    } catch (e) {
      console.log("Error fetching recent posts:", e);
      addToast({
        type: "failure",
        size: "md",
        message: "Content fetch failed",
      });
    }
  };

  const handleVectorSearch = async () => {
    const query = inputRef.current?.value;
    if (!query || isSearching) return;

    setIsSearching(true); 
    try {
      addToast({
        type: "progress",
        size: "md",
        message: "Searching...",
      });

      const response = await axios.post(
        "https://api.brainbank.cv/v1/search/relevent",
        { query: query },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.data && response.data.data.length > 0) {
          setPosts(response.data.data);
          setIsShowingSearchResults(true);
          addToast({
            type: "success",
            size: "md",
            message: "Search complete",
          });
        } else {
          addToast({
            type: "failure",
            size: "md",
            message: "No relevant content found. Showing recent items.",
          });
          fetchRecentPosts();
          setIsShowingSearchResults(false);
        }
      }
    } catch (e) {
      console.log("error" + e);
      addToast({
        type: "failure",
        size: "md",
        message: "Vector search failed",
      });
    } finally {
      setIsSearching(false); 
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    if (isShowingSearchResults) {
      fetchRecentPosts();
      setIsShowingSearchResults(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const isInputFocused = document.activeElement === inputRef.current;

    if (isInputFocused && event.key === "Enter") {
      handleVectorSearch();
    }
    if (isInputFocused && event.key === "Delete") {
      event.preventDefault();
      clearSearch();
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
  }, [isShowingSearchResults, isSearching]); 

  return (
    <div className="relative inline-block ml-85 ">
      <span
        className="absolute z-15 md:text-2xl bottom-2 md:bottom-4 left-2 text-whiteOrange dark:text-blackOrange"
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
        variant="recentSearch"
        placeholder="Search.."
        type="text"
        name="search"
        Icon={true}
        onChange={(e) => {
          const v = e.target.value;
          setSearchInput(v);
          if (v === "") {
            clearSearch();
          }
        }}
        inputRef={inputRef}
        value={searchInput}
        disabled={isSearching} 
      />
      {(searchInput.length > 0 && isDesktop) && (
        <span
          className="absolute text-2xl z-15 bottom-3 right-2 text-gray-700 dark:text-white hover:text-red-600 cursor-pointer"
          onClick={() => {
            if (isSearching) return; 
            setShortcut("");
            clearSearch();
          }}
          onMouseEnter={() => setShortcut("remove")}
          onMouseLeave={() => setShortcut("")}
        >
          <RxCrossCircled />
          {shortcut === "remove" && (
            <span className="absolute top-0 left-7 text-sm font-bold bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-md text-gray-500 dark:text-gray-200/60 border-1">
              Delete
            </span>
          )}
        </span>
      )}
    </div>
  );
};
