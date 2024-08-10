"use client";
import React from "react";
import Image from "next/image";

const HomeSection = () => {
  return (
    <div className="bg-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-center h-screen  p-4 w-[90%] mx-auto">
        <div className="text-center md:text-left md:mr-8 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Welcome to MyAuthApp</h1>
          <p className="text-lg mb-6">
            Secure and easy authentication for your needs. Our platform
            prioritizes your privacy and provides reliable security to safeguard
            your data.
          </p>
        </div>
        <div className="relative w-full md:w-1/2 h-80">
          <Image
            src="https://images.hindustantimes.com/tech/rf/image_size_960x540/HT/p2/2020/01/03/Pictures/security-technology-background-security-abstract-keyboard-computer_45da544c-2e2a-11ea-96cb-8d9426408fe0.jpg" // Placeholder image URL
            alt="Authentication Illustration"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
