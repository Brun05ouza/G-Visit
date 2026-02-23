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
    <div className="flex w-full items-center justify-center gap-0 overflow-x-auto">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1
        const isCompleted = step < currentStep
        const isActive = step === currentStep

        return (
          <div key={step} className="flex shrink-0 items-center">
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
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-300 relative sm:h-9 sm:w-9 sm:text-sm",
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
                  "mt-1 whitespace-nowrap text-[9px] font-medium sm:mt-1.5 sm:text-[10px]",
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
              <div className="relative mx-0.5 mb-5 h-[2px] w-8 overflow-hidden rounded-full bg-white/10 sm:mx-1 sm:w-16">
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
