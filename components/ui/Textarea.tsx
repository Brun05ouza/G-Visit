"use client"

import { TextareaHTMLAttributes, forwardRef, ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
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
            scale: isFocused ? 1.005 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon && (
            <motion.span 
              className="absolute left-3.5 top-3.5"
              animate={{
                color: isFocused ? "#10BCA9" : "#64748b",
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.span>
          )}
          
          <textarea
            ref={ref}
            id={id}
            rows={4}
            className={cn(
              "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all duration-200 resize-none",
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

          {/* Character count (optional) */}
          {props.maxLength && (
            <motion.div
              className="absolute bottom-2 right-2 text-xs text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: isFocused ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {String(props.value || "").length}/{props.maxLength}
            </motion.div>
          )}
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
Textarea.displayName = "Textarea"
export default Textarea
