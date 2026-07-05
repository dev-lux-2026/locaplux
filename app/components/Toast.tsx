"use client";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  const base =
    "fixed bottom-4 right-4 px-4 py-3 rounded shadow text-sm text-white z-50";
  const colors =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-gray-800";

  return (
    <div className={`${base} ${colors}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-xs underline text-white/80"
        >
          Fermer
        </button>
      )}
    </div>
  );
}
