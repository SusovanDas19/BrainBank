import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { inpDefaultStyle, InputBox } from "./InputBox";
import { IoIosArrowDown } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { IoInformationCircle } from "react-icons/io5";
import { motion } from "motion/react";
import { Button } from "./Button";
import axios from "axios";
import { useToast } from "./ToastProvider";
import { useRecoilState, useSetRecoilState } from "recoil";
import { callBackend } from "../../store/atoms/backednCallAtom";
import { selectOpt } from "../../store/atoms/formAtom";
import { Loader } from "./Loading";


interface formProps {
  setShowForm: (option: boolean) => void;
}

interface formDataInterface {
  title: string;
  description: string;
  type: string;
  date: string;
  link: string;
  tags: string[];
}

export const Form = (props: formProps) => {
  const [selectedOption, setSelectedOption] = useRecoilState(selectOpt);
  const today = new Date().toLocaleDateString("en-CA");

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [date, setDate] = useState(today);
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setShowForm = props.setShowForm;
  const token: string = localStorage.getItem("tokenBB") || "";
  const setCallBackend = useSetRecoilState(callBackend);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const { addToast } = useToast();

  // Keydown event handler (Memoized)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const tagValue = e.currentTarget.value.trim();
      if (!tagValue || tags.length >= 3) return;
      setTags((prevTags) => [...prevTags, tagValue]);
      e.currentTarget.value = "";
    },
    [tags]
  );

  // Remove tag handler (Memoized)
  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }, []);

  // Memoize tags rendering
  const renderedTags = useMemo(() => {
    return tags.map((tag, index) => (
      <div
        key={index}
        className="flex items-center justify-center max-w-24 md:max-w-[110px]  bg-transparent px-2 py-1 rounded-full text-black border-1 dark:text-white font-primary text-sm md:text-lg font-bold border-gray-700  group"
      >
        <p className="truncate">
          <span className="text-blackOrange">#</span>
          {tag}
        </p>

        <button
          onClick={() => removeTag(tag)}
          type="button"
          className="ml-1 md:ml-2 text-red-500 font-bold opacity-55 md:opacity-0 group-hover:opacity-100"
        >
          <RxCrossCircled className="cursor-pointer" />
        </button>
      </div>
    ));
  }, [tags, removeTag]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowLoader(true);

    const form = e.currentTarget;

    const formData: formDataInterface = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLInputElement).value,
      type: selectedOption,
      date,
      link: (form.elements.namedItem("link") as HTMLInputElement).value,
      tags,
    };
   
    try {
      const response = await axios.post("https://api.brainbank.cv/v1/content/add", formData, {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 201) {
        addToast({
          type: "success",
          size: "md",
          message: "Content added successfully",
        });
        form.reset();
        setSelectedOption("");
        setTags([]);
        setCallBackend(true)
      
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          addToast({
            type: "error",
            size: "md",
            message: "Title, description, and type are required.",
          });
        } else {
          addToast({
            type: "failure",
            size: "md",
            message: "Internal server error",
          });
        }
      }
      
    }finally{
      setShowLoader(false);
    }
  };

  return (
    <div className="flex justify-center items-center font-primary relative">
      <form className="flex flex-col justify-center items-center gap-5" onSubmit={handleSubmit}>
        <InputBox variant="atForm" placeholder="Title" type="text" name="title" />
        <InputBox variant="atForm" placeholder="Description" type="text" name="description" />
        <div className="flex flex-row gap-10 w-full">
          <CustomDropdown selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-2 py-1 md:px-4 md:py-3 text-2xl cursor-pointer font-medium dark:text-white bg-transparent dark:bg-primaryBlack border-2 rounded-lg border-gray-800"
          />
        </div>
        <InputBox variant="atForm" placeholder="Link" type="text" name="link" />

        <div className="w-full flex  items-center relative gap-2 border-2 border-gray-800 rounded-lg p-2">
          {renderedTags}
          {tags.length < 3 && (
            <>
              <input
                type="text"
                placeholder="Tags"
                className={`outline-none bg-transparent  text-center w-15 md:w-20 ${inpDefaultStyle} text-lg md:text-2xl font-medium `}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
              <IoInformationCircle
                className="dark:text-white text-lg cursor-pointer hover:text-blackOrange"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              />
              {showInfo && (
                <div className="absolute -bottom-7 right-1 dark:text-white text-lg">
                  Please press <strong className="text-blackOrange">Enter</strong> after one tag
                </div>
              )}
            </>
          )}
        </div>
        <Button type="submit" text="Submit" size="md" variant="primary" disabled={showLoader}/>
      </form>
      {showLoader && <div className="absolute bottom-2 right-15 md:right-20"><Loader/></div>}
      <motion.div
        initial={{ opacity: 0.6 }}
        whileHover={{ scale: 1.2, opacity: 1 }}
        className="absolute group -bottom-1 -right-1 md:-bottom-7 md:-right-7 cursor-pointer text-red-600 text-2xl font-primary"
        onClick={() => {setShowForm(false)}}
      >
        <MdOutlineCancelPresentation />
        <div className="opacity-0 group-hover:opacity-70 absolute -bottom-10 -right-5 border-2 px-1 rounded-md border-red-700 text-red-600 font-semibold bg-gray-200 dark:bg-gray-800">Cancel</div>
      </motion.div>
    </div>
  );
};

const optionStyle =
  "text-black dark:text-white hover:bg-whiteOrange dark:hover:bg-blackOrange px-4 py-2 cursor-pointer text-xl font-medium";

const options: string[] = [
  "Youtube",
  "Facebook",
  "Twitter/X",
  "Linkedin",
  "Notion",
  "Github",
  "Ai Chats",
  "Random",
  "Notes",
];

// Define props for the CustomDropdown component
interface CustomDropdownProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const listref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listref.current && !listref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={listref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-row justify-between items-center px-2 py-1 md:px-4 md:py-3 text-xl md:text-2xl font-medium dark:text-white bg-white dark:bg-primaryBlack border-2 rounded-lg border-gray-800 text-left focus:border-whiteOrange dark:focus:border-blackOrange"
      >
        {selectedOption || "Select"}
        <IoIosArrowDown
          className={`${
            isOpen ? "text-whiteOrange dark:text-blackOrange text-3xl" : "text-black dark:text-white"
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute w-full bg-white dark:bg-primaryBlack border-2 border-gray-800 rounded-lg mt-1 max-h-40 overflow-y-auto z-50">
          {options.map((option) => (
            <li
              key={option}
              className={optionStyle}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
