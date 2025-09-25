"use client";

import { useState, useEffect } from "react";
import Lottie from "react-lottie-player";
import fallingLeaves from "@/../../public/lottieFiles/fallingLeaves.json";

export default function FallingLeavesOverlay() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const playAnimation = () => {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 10000); // animation plays for 10 seconds
    };

    const initialDelay = 1 * 60 * 1000; 

    const initialTimeout = setTimeout(() => {
      playAnimation();

      const interval = setInterval(playAnimation, 2 * 60 * 1000); 

      cleanupFns.push(() => clearInterval(interval));
    }, initialDelay);

    const cleanupFns: (() => void)[] = [() => clearTimeout(initialTimeout)];

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  if (!showAnimation) return null;

  return (
    <div className="fixed top-0 left-0 w-[100vw] h-full pointer-events-none z-50">
      <Lottie
        animationData={fallingLeaves}
        play
        loop={false}
        className="w-full h-full"
      />
    </div>
  );
}
