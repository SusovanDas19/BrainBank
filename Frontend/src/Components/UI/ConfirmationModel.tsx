import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50">
          <motion.div
            className="bg-gray-100 border-1 border-gray-400 dark:border-gray-600 dark:bg-gray-800 rounded-lg p-8 w-full max-w-md mx-4 dark:text-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{title}</h2>
            <p className="dark:text-gray-300 mb-8">{message}</p>
            <div className="flex justify-end gap-4">
              <Button
                variant="dashbutton1"
                text="Cancel"
                onClick={onClose}
                size="md"
              />
              <Button
                variant="dashbutton2" 
                text="Confirm"
                onClick={onConfirm}
                size="md"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
