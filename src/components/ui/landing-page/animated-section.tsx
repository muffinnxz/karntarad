"use client";

import React, { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
    // Check if user prefers reduced motion
    const prefersReducedMotion = useReducedMotion();
    
    // Use ref instead of state for better performance
    const hasAnimated = useRef(false);
    const isMounted = useRef(false);
    
    useEffect(() => {
        isMounted.current = true;
        
        // Cleanup
        return () => {
            isMounted.current = false;
        };
    }, []);

    const getDirection = () => {
        if (prefersReducedMotion) return {};
        
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

    // Optimize animations
    const variants = {
        hidden: { 
            opacity: 0, 
            ...getDirection() 
        },
        visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: {
                duration: 0.5,
                delay: delay,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ 
                once, 
                amount: threshold,
                margin: "-50px 0px" 
            }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
