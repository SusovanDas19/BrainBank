import { motion } from "framer-motion";
import { TbDatabaseOff } from "react-icons/tb";

// Define a specific type for the content categories for better type safety
type ContentType = "YouTube" | "Twitter" | "LinkedIn" | "Github" | "Notion" | "Notes" | "Recent" | "AI Chat" | "Random";

interface NoContentProps {
  type: ContentType | string; // Allow specific types but also fallback to string
  message?: string;
}

// A more complete map of types to their corresponding brand colors
const typeStyles: Record<string, { color: string; icon?: React.ReactNode }> = {
  YouTube:    { color: "text-red-600" },
  Twitter:    { color: "dark:text-white text-black" },
  LinkedIn:   { color: "text-blue-600" },
  Github:     { color: "dark:text-white text-black" },
  Notion:     { color: "dark:text-white text-black" },
  Notes:      { color: "text-green-600" },
  "AI Chat's":  { color: "text-purple-600 dark:text-purple-400" },
  Random:     { color: "text-pink-600" },
  Recent:     { color: "text-whiteOrange dark:text-blackOrange" },
};

export const NoContent = ({ message, type }: NoContentProps) => {
  // Get the style object for the current type, or a default if not found
  const style = typeStyles[type] || { color: "dark:text-gray-300 text-gray-700" };

  return (
    <motion.div
      className="flex flex-col justify-center font-primary items-center text-center p-10 mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TbDatabaseOff className="text-6xl md:text-7xl text-gray-400 dark:text-gray-600 mb-6 hover:text-whiteOrange dark:hover:text-blackOrange" />
      <h2 className={`text-2xl md:text-3xl font-semibold ${style.color} mb-2`}>
        No {type} Content Saved Yet
      </h2>
      <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400">
        {message || "Save your first link or note to see it here!"}
      </p>
    </motion.div>
  );
};
