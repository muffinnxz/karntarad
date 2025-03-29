"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/firebase-auth";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileButton() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" className="flex items-center gap-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white">
              {user?.displayName?.[0] || user?.email?.[0] || "U"}
            </div>
          )}
        </div>
        <span className="hidden md:inline">{user?.displayName || "Profile"}</span>
      </Button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
