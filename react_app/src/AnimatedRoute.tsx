// AnimatedRoute.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {useLocation } from "react-router-dom";
interface AnimatedRouteProps {
  children: React.ReactNode;
}


const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children }) => {
    const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoute;