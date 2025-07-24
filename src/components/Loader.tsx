"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loader() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        <DotLottieReact
          src="/Loading.json"
          autoplay
          loop
          style={{
            width: "200px",
            height: "200px",
          }}
        />
      </AnimatePresence>
    </motion.div>
  );
}
