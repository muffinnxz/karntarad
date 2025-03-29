"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/firebase-auth";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Reusable sign-out function
  const handleSignOut = async () => {
    try {
      await signOut(); // your firebase-auth sign out
      setOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col">
        <nav className="flex flex-col gap-4 mt-8">
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="#features"
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    Features
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="#pricing"
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    Pricing
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="#contact"
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    Contact
                  </Link>
                </motion.div>

                {/* Sign In or My Game + Sign Out, depending on user state */}
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/my-game"
                        className="text-lg font-medium transition-colors hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        My Game
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4"
                    >
                      <Button variant="outline" className="w-full" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4"
                  >
                    <Button asChild className="w-full" onClick={() => setOpen(false)}>
                      <Link href="/signin">Sign In with Google</Link>
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
