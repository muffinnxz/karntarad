"use client";

import type React from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    distance?: number;
    once?: boolean;
    threshold?: number;
}

export function AnimatedSection({
    children,
    className = "",
    delay = 0,
    direction = "up",
    distance = 50,
    once = true,
    threshold = 0.1,
}: AnimatedSectionProps) {

    const getDirection = () => {
        switch (direction) {
            case "up":
                return { y: distance };
            case "down":
                return { y: -distance };
            case "left":
                return { x: distance };
            case "right":
                return { x: -distance };
            default:
                return { y: distance };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...getDirection() }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, amount: threshold }}
            transition={{ duration: 0.6, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
