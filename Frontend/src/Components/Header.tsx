import { IoIosAddCircle } from "react-icons/io";
import { Button } from "./UI/Button";
import { Form } from "../Components/UI/Form";
import { useRecoilState } from "recoil";

import { AnimatePresence, motion } from "motion/react";
import { showFormState } from "../store/atoms/formAtom";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery } from "../customHooks/useMediaQuery";

export const Header = () => {
  const [showForm, setShowForm] = useRecoilState(showFormState);
  const [searchParams] = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const mode = searchParams.get("mode");

  const initialX = isDesktop ? 550 : 100;
  const initialY = isDesktop ? -200 : -100;
  const dur = isDesktop ? 1 : 0;

  return (
    <div className="absolute ">
      <div className="flex justify-end fixed top-40 md:top-30 right-0 mr-8 md:mr-20 z-10">
        <Button
          variant="primary"
          size="md"
          text="Add Content"
          startIcon={<IoIosAddCircle className="text-xl" />}
          onClick={() => setShowForm((prev) => !prev)}
          disabled={mode === "org-signup" ? true : false}
        />
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{
              x: initialX,
              y: initialY,
              opacity: 0,
              scale: 0.1,
              filter: "blur(10px)",
            }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: dur, type: "spring" }}
            exit={{
              x: initialX,
              y: initialY,
              opacity: 0,
              scale: 0.1,
              filter: "blur(10px)",
            }}
          >
            <div
              className=" absolute inset-0 bg-gray-700/70 dark:bg-primaryBlack/70 filter blur-lg"
              onClick={() => setShowForm(false)}
            ></div>

            <motion.div
              className="relative p-4 md:p-8 rounded-xl border border-gray-700 bg-white dark:bg-primaryBlack"
              initial={{ scale: 0.1, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.1, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Form setShowForm={setShowForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
