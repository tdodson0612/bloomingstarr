"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [input, setInput] = useState("");
  const router = useRouter();

  function addDigit(digit: string) {
    setInput((prev) => prev + digit);
  }

  function clearAll() {
    setInput("");
  }

  function deleteOne() {
    setInput((prev) => prev.slice(0, -1));
  }

  function handleEnter() {
    // TEMP: no auth yet
    // Later: verify employee ID + PIN
    router.push("/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Employee Login</h1>

      {/* Display */}
      <div className="w-full max-w-xs mb-4">
        <input
          value={input.replace(/./g, "•")}
          readOnly
          className="w-full text-center text-2xl p-3 border rounded bg-white"
        />
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button
            key={n}
            onClick={() => addDigit(String(n))}
            className="p-4 text-xl bg-white border rounded hover:bg-gray-100"
          >
            {n}
          </button>
        ))}

        <button
          onClick={clearAll}
          className="p-4 bg-red-100 rounded"
        >
          Clear
        </button>

        <button
          onClick={() => addDigit("0")}
          className="p-4 text-xl bg-white border rounded hover:bg-gray-100"
        >
          0
        </button>

        <button
          onClick={deleteOne}
          className="p-4 bg-yellow-100 rounded"
        >
          Del
        </button>
      </div>

      <button
        onClick={handleEnter}
        className="mt-6 w-full max-w-xs py-3 bg-blue-600 text-white rounded text-lg hover:bg-blue-700"
      >
        Enter
      </button>
    </div>
  );
}
