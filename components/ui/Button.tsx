"use client"

import { ButtonHTMLAttributes, forwardRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost"
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", loading, children, disabled, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
      setIsHovered(false)
      setRipple(null)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setRipple({ x, y })
      setTimeout(() => setRipple(null), 600)
      props.onClick?.(e)
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" &&
cn(
            "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
            "shadow-lg shadow-teal-500/25"
          ),
          variant === "ghost" &&
            "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white",
          className
        )}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {/* Ripple effect */}
        {ripple && variant === "primary" && (
          <motion.span
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              marginLeft: -5,
              marginTop: -5,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 20, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Hover glow for primary */}
        {variant === "primary" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Loading spinner */}
        {loading && (
          <motion.span 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </motion.svg>
          </motion.span>
        )}
        
        <span className={loading ? "invisible" : "relative z-10"}>{children}</span>
      </motion.button>
    )
  }
)
Button.displayName = "Button"
export default Button
