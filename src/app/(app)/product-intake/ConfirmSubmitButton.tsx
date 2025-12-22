// app/product-intake/ConfirmSubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export default function ConfirmSubmitButton({
  children,
  confirmText,
}: {
  children: React.ReactNode;
  confirmText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-600 hover:underline disabled:opacity-50"
      onClick={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "Deleting..." : children}
    </button>
  );
}