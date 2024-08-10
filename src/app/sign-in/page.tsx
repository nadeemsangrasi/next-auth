"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, use, useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/users/sign-in", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      setLoading(false);
      console.log(res);
      if (res.status !== 200) {
        setError(true);
      }
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
      setError(true);
    }

    if (!error) {
      router.push("/profile");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 ${
            loading ? "bg-gray-400" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && (
          <p className="mt-4 text-red-500 text-center">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default SignIn;
