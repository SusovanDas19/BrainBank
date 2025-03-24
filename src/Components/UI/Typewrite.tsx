import { useEffect, useState, useRef } from "react";
import { RiDvdAiFill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

interface TypewriteProps {
  data: string;
  speed?: number;
}

export const Typewrite = ({ data, speed = 15 }: TypewriteProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!data) return;

    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    
    setDisplayedText("");
    let currentIndex = -1;

    const typeNext = () => {
      if (currentIndex < data.length-1) {
        setDisplayedText((prev) => prev + data[currentIndex]);
        currentIndex++;
        timerRef.current = setTimeout(typeNext, speed);
      }
    };

    typeNext();

  
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, speed]);

  return (
    <p className="relative mb-2.5 text-md font-light font-Ai text-black dark:text-white tracking-wider">
      
      <ReactMarkdown >{displayedText}
        
      </ReactMarkdown>
      {displayedText.length < data.length && (
        <span className="animate-pulse inline-block ml-1">
          <RiDvdAiFill className="w-4 h-4 text-blackOrange" />
        </span>
      )}
      
    </p>
  );
};
