"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"id" | "password">("id");
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function addDigit(digit: string) {
    setInput((prev) => prev + digit);
  }

  function clearAll() {
    setInput("");
    setEmployeeId("");
    setMode("id");
    setError("");
  }

  function deleteOne() {
    setInput((prev) => prev.slice(0, -1));
  }

  async function handleEnter() {
    console.log("Enter clicked, mode:", mode, "input:", input);
    
    if (!input) {
      setError("Please enter a value");
      return;
    }

    if (mode === "id") {
      // Save employee ID and switch to password mode
      console.log("Switching to password mode");
      setEmployeeId(input);
      setInput("");
      setMode("password");
      setError("");
      return;
    }

    // mode === "password", attempt login
    console.log("Attempting login with ID:", employeeId, "and password:", input);
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password: input }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        console.log("Login successful, redirecting...");
        window.location.href = "/home";
      } else {
        setError(data.error || "Login failed");
        setInput("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please try again.");
      setInput("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Employee Login</h1>

      {/* Display */}
      <div className="w-full max-w-xs mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          {mode === "id" ? "Employee ID" : "Password"}
        </label>
        <input
          value={mode === "password" ? input.replace(/./g, "•") : input}
          readOnly
          className="w-full text-center text-2xl p-3 border rounded bg-white"
          placeholder={mode === "id" ? "Enter ID" : "Enter Password"}
        />
      </div>

      {/* Show saved employee ID when in password mode */}
      {mode === "password" && (
        <div className="w-full max-w-xs mb-2 text-sm text-gray-600">
          Employee ID: {employeeId}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-xs mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => addDigit(String(n))}
            className="p-4 text-xl bg-white border rounded hover:bg-gray-100"
            disabled={isLoading}
          >
            {n}
          </button>
        ))}
        <button
          onClick={clearAll}
          className="p-4 bg-red-100 rounded hover:bg-red-200"
          disabled={isLoading}
        >
          Clear
        </button>
        <button
          onClick={() => addDigit("0")}
          className="p-4 text-xl bg-white border rounded hover:bg-gray-100"
          disabled={isLoading}
        >
          0
        </button>
        <button
          onClick={deleteOne}
          className="p-4 bg-yellow-100 rounded hover:bg-yellow-200"
          disabled={isLoading}
        >
          Del
        </button>
      </div>

      <button
        onClick={handleEnter}
        disabled={isLoading}
        className="mt-6 w-full max-w-xs py-3 bg-blue-600 text-white rounded text-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Logging in..." : mode === "id" ? "Next" : "Login"}
      </button>

      {/* Debug info - remove later */}
      <div className="mt-4 text-xs text-gray-500">
        Mode: {mode} | Input length: {input.length}
      </div>
    </div>
  );
}