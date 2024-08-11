"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const VerifyEmail = ({ searchParams }: { searchParams: { token: string } }) => {
  const { token } = searchParams;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(false); // Reset error state before making a new request
      const res = await fetch("/api/users/verifyToken?token=" + token);
      setLoading(false);
      console.log(res);
    } catch (error: any) {
      setLoading(false);
      setError(true);
      console.log(error.message);
    }
    if (!error) {
      toast.success("Your account verified successfully");
      router.push("/sign-in");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {loading ? (
        <h1 className="text-xl font-semibold mb-4">
          Verification in progress...
        </h1>
      ) : (
        <h1 className="text-xl font-semibold mb-4">
          {error
            ? "Error in verifying. Please try again."
            : "Click the button below to verify your email."}
        </h1>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } transition-colors duration-300`}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>
    </div>
  );
};

export default VerifyEmail;
