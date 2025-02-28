import React, { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Toast, ToastProps } from "./Toast";
import { AnimatePresence, motion } from "motion/react";

interface ToastContextProps {
  addToast: (toast: ToastProps) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: number } & ToastProps>>([]);

  const addToast = (toast: ToastProps) => {
    const id = toastId++;
    setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <motion.div className="fixed top-0 right-0 p-4 space-y-2 z-50">
          <AnimatePresence>
            {toasts.map((toast) => (
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
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
