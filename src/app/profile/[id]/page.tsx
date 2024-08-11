"use client";

import { getUserDataById } from "@/app/action";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const ProfileById = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [logOutLoading, setLogOutLoading] = useState<boolean | null>(null);
  const [logOutError, setLogOutError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter for redirecting
  const { isAuthenticated, logout } = useAuth();

  const { id } = params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserDataById(Number(id));
        if (userData) {
          setUser(userData);
          setError(null);
        } else {
          setError("User not found");
        }
      } catch (err: any) {
        setError("An error occurred while fetching user data.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleLogout = async () => {
    setLogOutLoading(true);
    try {
      const response = await fetch("/api/users/logout");

      if (response.ok) {
        logout();
        setLogOutLoading(false);
        router.push("/sign-in"); // Redirect to login page after logout
        toast.success("User logged out successfully");
      } else {
        throw new Error("Failed to log out");
      }
    } catch (error: any) {
      console.error(error.message);
      setLogOutError("An error occurred during logout. Please try again.");
      setLogOutLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {isAuthenticated ? (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform transition-all duration-500">
          {/* Dashboard Heading */}
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            User Profile
          </h1>

          {loading ? (
            <p className="text-lg font-medium text-gray-700">
              Loading user data...
            </p>
          ) : error ? (
            <p className="text-red-500 font-medium">{error}</p>
          ) : (
            user && (
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                  Hello, {user.username}
                </h1>
                <p className="text-lg text-gray-600">
                  User ID:{" "}
                  <span className="font-medium text-gray-800">{id}</span>
                </p>
                <p className="text-lg text-gray-600">
                  Email:{" "}
                  <span className="font-medium text-gray-800">
                    {user.email}
                  </span>
                </p>
                {/* Add more user details here */}

                {/* Log Out Button */}
                <button
                  onClick={handleLogout}
                  className={`mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 ${
                    logOutLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={logOutLoading ? true : false} // Disable button during logout process
                >
                  {logOutLoading ? "Logging Out..." : "Log Out"}
                </button>

                {logOutError && (
                  <p className="text-red-500 font-medium mt-4">{logOutError}</p>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        "please sign in first"
      )}
    </div>
  );
};

export default ProfileById;
