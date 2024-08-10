"use client";

import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";

const ProfileById = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  const getUserDataById = async () => {
    setLoading(true);
    try {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user[0]) {
        setError("User not found.");
      } else {
        setUser(user[0]);
      }
    } catch (error: any) {
      console.error(error.message);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDataById();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {loading ? (
        <p className="text-lg font-medium">Loading user data...</p>
      ) : error ? (
        <p className="text-red-500 font-medium">{error}</p>
      ) : (
        user && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Hello, {user.username}</h1>
            <p className="text-lg">
              User ID: <span className="font-medium">{id}</span>
            </p>
            <p className="text-lg">
              Email: <span className="font-medium">{user.email}</span>
            </p>
            {/* Add more user details here */}
          </div>
        )
      )}
    </div>
  );
};

export default ProfileById;
