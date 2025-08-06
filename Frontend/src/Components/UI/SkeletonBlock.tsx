
interface SkeletonBlockProps {
  type: "primary" | "secondary";
}

const blockTypeStyle = {
  primary: "",
  secondary: "w-50 md:w-80",
};

const BlockDefaultStyle =
  "dark:bg-gray-300/15 bg-gray-200 p-4 md:p-8 border-1 border-gray-400 dark:border-gray-300 rounded-2xl flex flex-col justify-center items-center font-primary cursor-pointer";

export const SkeletonBlock = ({ type }: SkeletonBlockProps) => {
  return (
    <div
      className={`${BlockDefaultStyle} ${blockTypeStyle[type]} animate-pulse`}
    >
      <div className="h-5 w-5 md:h-8 md:w-8 bg-gray-400 rounded-full mb-4" />

      <div className="h-4 w-10 md:h-8 md:w-16 bg-gray-400 rounded mb-2" />

      <div className="h-3 w-20 md:h-4 md:w-24 bg-gray-400 rounded" />
    </div>
  );
};

export const SkeletonRow = () => (
  <div className="flex justify-between items-center px-4 py-3 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="h-4 w-4 md:h-8 md:w-8 dark:bg-gray-600 bg-gray-300 rounded-full" />
      <div className="h-2 w-20 md:h-5 md:w-32 dark:bg-gray-600 bg-gray-400/20 rounded" />
    </div>
    <div className="flex space-x-4">
      <div className="h-4 w-20 md:h-8 md:w-24 dark:bg-gray-600 bg-gray-400/20 rounded" />
      <div className="md:h-8 md:w-24 dark:bg-gray-600 bg-gray-400/20 rounded" />
    </div>
  </div>
);
