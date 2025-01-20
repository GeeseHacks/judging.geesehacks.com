"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
const Login = () => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
        const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueKey: key }),
        });
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Response status:", response.status); // Log response status
        const data = await response.json();
        console.log("Response data:", data); // Log response data

        if (data.success) {
        window.location.href = `/dashboard/${data.judgeId}`;
        } else {
        setError(data.message || "Invalid unique key. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        setError("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="flex h-screen">
      <div className="bg-gray-900 text-white flex flex-col justify-center items-start w-full sm:w-1/2 min-w-[300px] px-8 sm:px-12 lg:px-24 xl:px-40 2xl:px-[13%]">
        <h2 className="mt-2 mb-2 text-left text-4xl font-bold">Welcome</h2>
        <p className="mb-6 mt-3 text-left">Log in to the GeeseHacks judging portal!</p>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit} noValidate>
          <Label className="text-xl" htmlFor="key">
            Unique Key
          </Label>
          <Input
            type="text"
            id="key"
            name="key"
            placeholder="Your unique key"
            required
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Button type="submit" className={`py-2 mt-4`}>
            Log in
          </Button>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};
export default Login;