"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const [logOutLoading, setLogOutLoading] = useState<boolean | null>(null);
  const [logOutError, setLogOutError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    setLogOutLoading(true);
    try {
      const response = await fetch("/api/users/logout");

      if (response.ok) {
        logout();
        setLogOutLoading(false);
        router.push("/sign-in");
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
    <nav className="bg-blue-500 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AuthApp
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              {isClient && (
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ${
                    logOutLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={logOutLoading ? true : false}
                >
                  {logOutLoading ? "Logging Out..." : "Log Out"}
                </button>
              )}
              {logOutError && (
                <p className="text-red-500 font-medium mt-4">{logOutError}</p>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/sign-up")}
                className={`px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300 ${
                  logOutLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => router.push("/sign-in")}
                className={`px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ${
                  logOutLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
