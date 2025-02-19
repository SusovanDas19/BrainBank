import { useState,useRef, useEffect } from "react";
import { InputBox } from "./InputBox";
import { IoIosArrowDown } from "react-icons/io";


export const Form: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="flex justify-center items-center font-primary">
      <form className="flex flex-col justify-center items-center gap-10">
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
        <CustomDropdown
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <InputBox variant="atForm" placeholder="Link" type="text" name="link" />
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

  useEffect(()=>{
    const handleClickOutside = (event: MouseEvent)=>{
      if(listref.current && !listref.current.contains(event.target as Node)){
        setIsOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return ()=>{
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [listref, setIsOpen])

  return (
    <div className="relative w-full" ref={listref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-row justify-between px-4 py-3 text-2xl font-medium text-white bg-white dark:bg-primaryBlack border-2 rounded-lg border-gray-800 text-left focus:border-whiteOrange dark:focus:border-blackOrange"
      >
        {selectedOption || "Select"} <IoIosArrowDown className={`${isOpen ? "text-whiteOrange dark:text-blackOrange text-3xl":"text-black dark:text-white"}`}/>
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
