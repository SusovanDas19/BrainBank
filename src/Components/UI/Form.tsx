import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { inpDefaultStyle, InputBox } from "./InputBox";
import { IoIosArrowDown } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { IoInformationCircle } from "react-icons/io5";

export const Form: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const today = new Date().toLocaleDateString("en-CA");
  console.log(today)
  const [showInfo, setShowInfo] = useState(false);
  const [date, setDate] = useState(today);
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keydown event handler (Memoized)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const tagValue = e.currentTarget.value.trim(); // Get value directly from event
      if (e.key === "Enter" && tagValue !== "") {
        e.preventDefault();
        if (tags.length < 3) {
          setTags((prevTags) => [...prevTags, tagValue]);
          e.currentTarget.value = ""; // Clear input
        }
      }
    },
    [tags]
  );

  // Remove tag handler (Memoized)
  const removeTag = useCallback((e: React.MouseEvent, tagToRemove: string) => {
    e.preventDefault();
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }, []);

  // Memoize tags rendering
  const renderedTags = useMemo(() => {
    return tags.map((tag, index) => (
      <div
        key={index}
        className="flex items-center justify-center max-w-[110px]  bg-transparent px-2 py-1 rounded-full text-black border-1 dark:text-white font-primary text-lg font-bold border-gray-700  group"
      >
        <p className="truncate">
          <span className="text-blackOrange">#</span>
          {tag}
        </p>

        <button
          onClick={(e) => removeTag(e, tag)}
          type="button"
          className="ml-2 text-red-500 font-bold opacity-0 group-hover:opacity-100"
        >
          <RxCrossCircled className="cursor-pointer" />
        </button>
      </div>
    ));
  }, [tags, removeTag]);

  return (
    <div className="flex justify-center items-center font-primary">
      <form
        className="flex flex-col justify-center items-center gap-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <InputBox
          variant="atForm"
          placeholder="Title"
          type="text"
          name="title"
        />
        <InputBox
          variant="atForm"
          placeholder="Description"
          type="text"
          name="description"
        />
        <div className="flex flex-row gap-10 w-full">
          <CustomDropdown
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 text-2xl cursor-pointer font-medium dark:text-white bg-transparent dark:bg-primaryBlack border-2 rounded-lg border-gray-800 text-left focus:border-whiteOrange dark:focus:border-blackOrange"
          />
        </div>
        <InputBox variant="atForm" placeholder="Link" type="text" name="link" />

        {/* Tags Input */}
        <div className="w-full flex  items-center relative gap-2 border-2 border-gray-800 rounded-lg p-2">
          {renderedTags}
          {tags.length < 3 && (
            <>
              <input
                type="text"
                placeholder="Tags"
                className={`outline-none bg-transparent   ${inpDefaultStyle} text-2xl font-medium `}
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
                  Please press <strong>Enter</strong> after one tag
                </div>
              )}
            </>
          )}
        </div>
      </form>
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

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  selectedOption,
  setSelectedOption,
}) => {
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
  }, [listref, setIsOpen]);

  return (
    <div className="relative w-full" ref={listref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-row justify-between px-4 py-3 text-2xl font-medium dark:text-white bg-white dark:bg-primaryBlack border-2 rounded-lg border-gray-800 text-left focus:border-whiteOrange dark:focus:border-blackOrange"
      >
        {selectedOption || "Select"}{" "}
        <IoIosArrowDown
          className={`${
            isOpen
              ? "text-whiteOrange dark:text-blackOrange text-3xl"
              : "text-black dark:text-white"
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
