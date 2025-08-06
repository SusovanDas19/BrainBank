import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { motion } from "motion/react";
import { themeState } from "../../store/atoms/themeAtom";
import { IoIosSunny } from "react-icons/io";
import { IoMoonSharp } from "react-icons/io5";
import { useMediaQuery } from "../../customHooks/useMediaQuery";

const ThemeToggle = () => {
  const [theme, setTheme] = useRecoilState(themeState);
  
  // The hook returns true if the viewport is 768px or wider else return false
  const isDesktop = useMediaQuery('(min-width: 768px)');

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

  const moonConfig = {
    initialX: isDesktop ? 50 : 30, 
    animateX: isDesktop ? 8 : 4,   
  };

  const sunConfig = {
    initialX: isDesktop ? 10 : 4,  // Starting position (from the left)
    animateX: isDesktop ? 42 : 20, // Final position (right side)
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-6 md:w-18 md:h-8 rounded-2xl bg-gray-200 dark:bg-black text-gray-500 dark:border-gray-800 border-gray-400 border-1 cursor-pointer"
    >
      {theme === "light" ? (
        <motion.div
          initial={{ x: moonConfig.initialX, opacity: 1 }}
          animate={{ x: moonConfig.animateX, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <IoMoonSharp className="text-gray-500 text-sm md:text-xl" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: sunConfig.initialX, opacity: 1 }}
          animate={{ x: sunConfig.animateX, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <IoIosSunny className="text-orange-400 text-lg md:text-2xl" />
        </motion.div>
      )}
    </button>
  );
};

export default ThemeToggle;