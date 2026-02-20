"use client"

import { InputHTMLAttributes, forwardRef, ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e)
    }

    return (
      <div className="flex flex-col gap-1.5">
        <AnimatePresence>
          {label && (
            <motion.label
              htmlFor={id}
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                error ? "text-red-400" : isFocused ? "text-teal-400" : "text-slate-400"
              )}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}
        </AnimatePresence>
        
        <motion.div 
          className="relative"
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon && (
            <motion.span 
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              animate={{
                color: isFocused ? "#10BCA9" : "#64748b",
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.span>
          )}
          
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all duration-200",
              "focus:outline-none focus:ring-2",
              error
                ? "border-red-500/60 focus:ring-red-500/40 focus:border-red-500/60"
                : isFocused
                  ? "border-teal-500/60 focus:ring-teal-500/40 shadow-lg shadow-teal-500/10"
                  : "border-white/10 hover:border-white/20",
              icon && "pl-10",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          
          {/* Focus glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: isFocused
                ? "0 0 20px rgba(16, 188, 169, 0.15)"
                : "0 0 0px rgba(16, 188, 169, 0)",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
Input.displayName = "Input"
export default Input
