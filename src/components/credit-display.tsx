"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CreditDisplay() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (session) {
      fetchCredits();
    }
  }, [session]);

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/user/credits");
      if (response.ok) {
        const data = await response.json();
        
        // Store previous credits for animation
        if (credits !== null && data.credits !== credits) {
          setIsAnimating(true);
          
          // Reset animation after delay
          setTimeout(() => {
            setIsAnimating(false);
          }, 2000);
        }
        
        setCredits(data.credits);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to trigger credit animation (can be called externally)
  const animateCreditsUsed = (amount: number) => {
    if (credits === null) return;
    
    setIsAnimating(true);
    
    // Animate counter decreasing
    let currentCredits = credits;
    const interval = setInterval(() => {
      if (currentCredits > credits - amount) {
        currentCredits--;
        setCredits(currentCredits);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }
    }, 100);
  };

  // Expose the animation function globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).animateCreditsUsed = animateCreditsUsed;
    }
  }, [credits]);

  if (!session || loading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Coins className="h-3 w-3" />
        --
      </Badge>
    );
  }

  const isLowCredits = (credits ?? 0) < 10;

  return (
    <motion.div
      className={`credit-display flex items-center gap-2 ${isAnimating ? 'animate-pulse' : ''}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Badge 
        variant={isLowCredits ? "destructive" : "secondary"} 
        className={`flex items-center gap-1 px-3 py-1 ${
          isAnimating ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : ''
        }`}
      >
        <motion.div
          animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isAnimating ? (
            <Zap className="h-3 w-3" />
          ) : (
            <Coins className="h-3 w-3" />
          )}
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.span
            key={credits}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {credits ?? 0}
          </motion.span>
        </AnimatePresence>
        
        <span className="text-xs">Credits</span>
      </Badge>
      
      {isLowCredits && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-red-500 font-medium"
        >
          Low balance!
        </motion.div>
      )}
    </motion.div>
  );
}