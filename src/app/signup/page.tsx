"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/landing-page/animated-section";

export default function KarntaradModernLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <AnimatedSection
                delay={0.1}
                direction="up"
                className="flex flex-col items-center justify-center gap-6 p-8 bg-white rounded-lg shadow-md"
            >
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome to Karntarad
                </h1>
                <p className="text-base text-gray-600 text-center max-w-md">
                    Your journey to mastering social marketing starts here. Sign
                    in with Google to continue.
                </p>
                <Button
                    variant="outline"
                    className="w-full max-w-xs flex items-center justify-center gap-3 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 256 262"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#4285F4"
                            d="M255.7 131.3c0-9.4-.8-18.5-2.4-27.3H130v51.7h70.1c-3.1 16.7-12.3 30.9-26.4 40.4v33h42.7c25 23 62 18.1 78.1-4.7 5.4-8.6 8.5-18.7 8.5-32.1z"
                        />
                        <path
                            fill="#34A853"
                            d="M130 261.6c35.1 0 64.7-11.6 86.2-31.5l-42.7-33c-11.8 7.9-27 12.7-43.5 12.7-33.4 0-61.8-22.5-72-52.7H14.7v32.8C36.2 233.4 78.1 261.6 130 261.6z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M58 154.1c-2.9-8.6-4.6-17.8-4.6-27.1 0-9.3 1.7-18.5 4.6-27.1V67H14.7C5.3 86.1 0 107.1 0 127c0 19.9 5.3 40 14.7 60L58 154.1z"
                        />
                        <path
                            fill="#EA4335"
                            d="M130 51.3c18.9 0 32 8.2 39.3 15.2l29.4-29.4C195 20 164.3 0 130 0 78.1 0 36.2 28.2 14.7 67l43.3 33.4c11.2-30.3 39.6-52.1 71.3-52.1z"
                        />
                    </svg>
                    <Link href="/api/auth/google">Sign in with Google</Link>
                </Button>
            </AnimatedSection>
        </div>
    );
}
