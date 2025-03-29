"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/firebase-auth";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

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
      <Button
        size="icon"
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden relative">
          {user?.photoURL ? (
            <Image src={user.photoURL} alt="Profile" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white">
              {user?.displayName?.[0] || user?.email?.[0] || "U"}
            </div>
          )}
        </div>
      </Button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link
            href="/my-game"
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            My Game
          </Link>
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
