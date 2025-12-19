"use client";

type Props = {
  confirmText: string;
  children: React.ReactNode;
};

export default function ConfirmSubmitButton({ confirmText, children }: Props) {
  return (
    <button
      type="submit"
      className="text-red-600 hover:underline"
      onClick={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
