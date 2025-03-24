import { IoIosAddCircle } from "react-icons/io";
import { Button } from "./UI/Button";
import { Form } from "../Components/UI/Form";
import { useRecoilState } from "recoil";

import { AnimatePresence, motion } from "motion/react";
import { showFormState } from "../store/atoms/formAtom";

export const Header = () => {
  const [showForm, setShowForm] = useRecoilState(showFormState);

  return (
    <div className="absolute ">
      <div className="flex justify-end fixed top-30 right-0 mr-20 z-10">
        <Button
          variant="primary"
          size="md"
          text="Add Content"
          startIcon={<IoIosAddCircle className="text-xl" />}
          onClick={() => setShowForm((prev) => !prev)}
        />
      </div>
      
      {/* Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{x:550,y:-200,opacity: 0, scale: 0.1, filter: "blur(10px)"}}
            animate={{x:0,y:0, opacity: 1, scale: 1, filter: "blur(0px)"}}
            transition={{duration: 1, type: 'spring'}}
            exit={{x:550,y:-200,opacity: 0, scale: 0.1, filter: "blur(10px)"}}
          >
            
            <div className=" absolute inset-0 bg-gray-700/70 dark:bg-primaryBlack/70 filter blur-lg" onClick={() => setShowForm(false)}></div>
            
            
            <motion.div
              className="relative p-8 rounded-xl border border-gray-700 bg-white dark:bg-primaryBlack"
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
