import { IoIosAddCircle } from "react-icons/io";
import { Button } from "./UI/Button";
import { Form } from "../Components/UI/Form";
import { useState } from "react";
import {AnimatePresence, motion} from "motion/react";

export const Header = () => {
  const [showForm, setShowForm]  = useState<boolean>(false);
  return (
    <div className="flex flex-col pt-10 ">
      <div className="flex justify-end mr-20">
        <Button
          variant="primary"
          size="md"
          text="Add Content"
          startIcon={<IoIosAddCircle className="text-xl" />}
          onClick={()=>setShowForm(!showForm)}
        />
      </div>
      <div className="h-full w-full flex justify-center items-center ">
        <AnimatePresence>
        {
          showForm && 
          <motion.div 
            className=" p-8  top-0 rounded-xl  border-1 border-gray-700"
            initial={{x:550,y:-200,opacity: 0, scale: 0.1, filter: "blur(10px)"}}
            animate={{x:0,y:0, opacity: 1, scale: 1, filter: "blur(0px)"}}
            transition={{duration: 1, type: "spring"}}
            exit={{x:550,y:-200,opacity: 0, scale: 0.1, filter: "blur(10px)"}}
          >
            <Form setShowForm={setShowForm}/>
          </motion.div>
        }
        </AnimatePresence>
        
      </div>
      
    </div>
  );
};
