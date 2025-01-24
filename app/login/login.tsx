"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authenticate } from "@lib/actions";
import toast from "react-hot-toast";
import { validateLoginKey } from "@lib/loginKeyUtils";

const Login = () => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loginKeyError, setLoginKeyError] = useState<string>("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const loginKeyValidationError = validateLoginKey(key);

    if (loginKeyValidationError) {
        setLoginKeyError(loginKeyValidationError);
      } else {
        setLoginKeyError("");
  
        toast.promise(authenticate(key), {
          loading: "Logging in...",
          success: (response) => {
            if (response && response.error) {
              throw new Error(response.error); // Throwing the error to be caught by the error handler
            }
            return "Logged in successfully!";
          },
          error: (err) => {
            return err.message || "Failed to log in";
          },
        });
      }


    // try {
    //     const response = await fetch("/api/auth/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ uniqueKey: key }),
    //     });
    //     if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     console.log("Response status:", response.status);
    //     const data = await response.json();
    //     console.log("Response data:", data);

    //     if (data.success) {
    //     window.location.href = `/dashboard/${data.judgeId}`;
    //     } else {
    //     setError(data.message || "Invalid unique key. Please try again.");
    //     }
    // } catch (error) {
    //     console.error("Error during login:", error);
    //     setError("An unexpected error occurred. Please try again.");
    // }
  };

  return (
    <div className="flex h-screen">
      <div className="bg-gray-900 text-white flex flex-col justify-center items-start w-full sm:w-1/2 min-w-[300px] px-8 sm:px-12 lg:px-24 xl:px-40 2xl:px-[13%]">
        <h2 className="mt-2 mb-2 text-left text-4xl font-bold">Welcome</h2>
        <p className="mb-6 mt-3 text-left">Log in to the GeeseHacks judging portal!</p>
        <form className="flex flex-col gap-4 w-full" noValidate>
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
          {loginKeyError && (
            <p role="alert" className="text-red-500 text-sm mt-2">
              {loginKeyError}
            </p>
          )}
          <Button type="submit" onClick={handleSubmit} className={`py-2 mt-4`}>
            Log in
          </Button>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
      <div
        className="bg-cover bg-center w-0 sm:w-1/2"
        style={{ backgroundImage: "url('/static/images/background.png')" }}
      ></div>
    </div>
  );
};
export default Login;