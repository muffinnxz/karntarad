"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FeatureCardAdvancedProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCardAdvanced({ icon, title, description, delay = 0 }: FeatureCardAdvancedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <motion.div
        className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
