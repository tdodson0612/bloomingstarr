"use client";

import { useState } from "react";

export default function TimeClockPage() {
  const [status, setStatus] = useState("Not Clocked In");

  function action(label: string) {
    setStatus(label);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Time Clock</h1>

      <div className="mb-6">
        <p className="text-lg">
          Status: <span className="font-medium">{status}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-sm">
        <button
          onClick={() => action("Clocked In")}
          className="clock-btn bg-green-600"
        >
          Clock In
        </button>

        <button
          onClick={() => action("On Break")}
          className="clock-btn bg-yellow-500"
        >
          Break
        </button>

        <button
          onClick={() => action("At Lunch")}
          className="clock-btn bg-orange-500"
        >
          Lunch
        </button>

        <button
          onClick={() => action("Clocked Out")}
          className="clock-btn bg-red-600"
        >
          Clock Out
        </button>
      </div>
    </div>
  );
}
