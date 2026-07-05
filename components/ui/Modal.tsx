import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#18181A] p-6 rounded-xl w-full max-w-md border border-gray-200 dark:border-white/10 shadow-xl">
        {children}

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-[#1F1F22]"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
