"use client";


import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRouteCom = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

 // Still checking authentication
if (isAuthenticated === null) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center">

        {/* Animated logo / loader */}
        <div className="relative flex items-center justify-center h-16 w-16">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-800 border-t-violet-500 animate-spin" />

          {/* Inner pulse */}
          <div className="h-8 w-8 rounded-full bg-violet-500/20 animate-pulse" />

          {/* Center dot */}
          <div className="absolute h-3 w-3 rounded-full bg-violet-500" />
        </div>

        {/* Text */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-white">
            Checking your session
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Please wait a moment...
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-4">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce" />
        </div>

      </div>
    </div>
  );
}

  // Not authenticated
  if (isAuthenticated === false) {
    return null;
  }

  // Authenticated
  return children;
};

export default ProtectedRouteCom;