import { createPortal } from "react-dom";
import { Toast, ToastProps } from "./Toast";
import { AnimatePresence, motion } from "motion/react";
import { useRecoilState } from "recoil";
import { allToasts } from "../../store/atoms/toastAtom";

export const ToastProvider = () => {
  
  const {allToast, removeToast} = useToast();
 

  return (
    <>
      {createPortal(
        <motion.div className="fixed top-0 right-0 p-4 space-y-2 z-10000000">
          <AnimatePresence>
            {allToast.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ x: 100, opacity: 0, filter: "blur(0px)" }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0, filter: "blur(5px)" }}
                transition={{ ease: "easeIn" }}
              >
                <Toast
                  key={toast.id}
                  {...toast}
                  removeToast={() => removeToast(toast.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>,
        document.body
      )}
    </>
  );
};


let toastId = 0;

export const useToast = ()=>{
  const [allToast, setAllToasts] = useRecoilState(allToasts);

  const addToast = (toast: Omit<ToastProps, "id">)=>{
    const newToast = {...toast , id: toastId++};
    setAllToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(()=> removeToast(newToast.id), 5000);
  };

  const removeToast = (id:number)=>{

    setAllToasts((prevToast)=> prevToast.filter((toast)=> toast.id !== id));

  }

  return {allToast, addToast, removeToast};
}
