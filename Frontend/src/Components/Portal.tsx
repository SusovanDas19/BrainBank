import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
}

export const Portal = ({ children, onClose }: ModalProps) => {
  const el = document.createElement("div");

  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative"
        onClick={e => e.stopPropagation() }
      >
        {children}
      </div>
    </div>,
    el
  );
};
