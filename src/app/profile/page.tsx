"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me");
      setLoading(false);

      if (res.status !== 200) {
        const { error } = await res.json();
        setError(error);
        return;
      }

      const data = await res.json();
      router.push(`/profile/${data.data.id}`);
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
      setError("Failed to fetch data.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-6 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Loading..." : "View Your Profile"}
      </button>
      {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default ProfilePage;
