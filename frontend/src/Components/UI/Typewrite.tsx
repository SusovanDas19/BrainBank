import React, { useEffect, useState, useRef } from "react";
import { RiDvdAiFill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

interface TypewriteProps {
  data: string;
  speed?: number;
  setDone?: (done: boolean) => void;
}

export const Typewrite = ({ data, speed = 15,setDone }: TypewriteProps) => {
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
      }else{
        if (setDone) setDone(true);
      }
      
    };

    typeNext();

  
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, speed]);

  return (
    <p className="relative mb-2.5 text-md font-light font-Ai text-black dark:text-white tracking-wider">
      
      <ReactMarkdown 
         components={{
          strong({ children, ...props }) {
            // children[0] is the label text, e.g. "Neutral"
            const arr = React.Children.toArray(children)
            const lbl = String(arr[0]).toLowerCase();
            const colorClass =
              lbl === "positive" ? "text-green-500 font-bold" :
              lbl === "negative" ? "text-red-500 font-bold" :
                     "text-blue-500 font-bold";
            return <strong className={colorClass} {...props}>{children}</strong>;
          }
        }}
      >{displayedText}
        
      </ReactMarkdown>
      {displayedText.length < data.length && (
        <span className="animate-pulse inline-block ml-1">
          <RiDvdAiFill className="w-4 h-4 text-blackOrange" />
        </span>
      )}
      
    </p>
  );
};
