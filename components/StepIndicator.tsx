"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1
        const isCompleted = step < currentStep
        const isActive = step === currentStep

        return (
          <div key={step} className="flex items-center">
            {/* Step bubble */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={
                  isActive
                    ? { 
                        scale: [1, 1.15, 1.1], 
                        boxShadow: [
                          "0 0 0 0px rgba(16,188,169,0)",
                          "0 0 0 6px rgba(16,188,169,0.2)",
                          "0 0 0 4px rgba(16,188,169,0.25)"
                        ]
                      }
                    : { scale: 1, boxShadow: "0 0 0 0px rgba(16,188,169,0)" }
                }
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors duration-300 relative",
                  isCompleted && "bg-teal-600 border-teal-600 text-white",
                  isActive && "bg-transparent border-teal-500 text-teal-400",
                  !isCompleted && !isActive && "bg-white/5 border-white/10 text-slate-600"
                )}
              >
                {/* Pulse effect for active step */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-teal-500"
                    animate={{ 
                      scale: [1, 1.4, 1.4],
                      opacity: [0.5, 0, 0]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
                
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <span>{step}</span>
                )}
              </motion.div>
              
              <motion.span
                className={cn(
                  "text-[10px] mt-1.5 font-medium whitespace-nowrap",
                  isActive ? "text-teal-400" : isCompleted ? "text-slate-400" : "text-slate-600"
                )}
                animate={{
                  y: isActive ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {labels[i]}
              </motion.span>
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div className="relative w-16 h-[2px] mx-1 mb-5 bg-white/10 overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-600 to-teal-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: step < currentStep ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                
                {/* Shimmer effect */}
                {step === currentStep && (
                  <motion.div
                    className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-32, 64] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
