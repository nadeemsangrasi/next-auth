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
      console.log(error.message);
      setLoading(false);
      setError("Failed to fetch data.");
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "Click to see your data"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProfilePage;
