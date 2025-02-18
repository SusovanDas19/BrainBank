import {useEffect} from "react";
import { useRecoilState } from "recoil";
import { motion } from "motion/react";
import { themeState } from "../../store/atoms/themeAtom";
import { IoIosSunny } from "react-icons/io";
import { IoMoonSharp } from "react-icons/io5";




const ThemeToggle = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, [setTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="w-18 h-8 rounded-2xl bg-gray-200 dark:bg-black text-gray-500 dark:border-gray-800 border-gray-400 border-1 cursor-pointer"
    >
      {theme === "light" ? (
        <motion.div
          initial={{
            x: 50,
            opacity: 1
          }}
          animate={{
            x: 8,
            opacity: 1,
          }}
      
        >
          <IoMoonSharp className="text-gray-500 text-xl"/>
        </motion.div>
      ) : (
        <motion.div
          initial={{
            x: 10,
            opacity: 1
          }}
          animate={{
            x: 42,
            opacity: 1,
          }}
        >
          <IoIosSunny className="text-orange-400 text-2xl"/>
        </motion.div>
      )}
    </button>
  );
};





export default ThemeToggle;
