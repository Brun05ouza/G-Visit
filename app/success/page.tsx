"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, CalendarCheck, Clock, Home, ArrowLeft, Sparkles } from "lucide-react"
import CanvasBackground from "@/components/CanvasBackground"

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

// Confetti component - pre-computed random values
function Confetti() {
  // Pre-compute random values to avoid impure function calls during render
  const confettiItems = useMemo(() => {
    const colors = ["#10BCA9", "#2dd4bf", "#0d9488", "#5eead4", "#99f6e4"]
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${(i * 2) % 100}%`,
      duration: 2 + (i % 4) * 0.5,
      delay: (i % 10) * 0.05,
      xOffset: ((i % 5) - 2) * 50,
      rotate: (i % 8) * 90,
    }))
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confettiItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: item.color,
            left: item.left,
            top: -10,
          }}
          animate={{
            y: [0, 800],
            x: [0, item.xOffset],
            rotate: [0, item.rotate],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

function SuccessContent() {
  const params = useSearchParams()
  const name = params.get("name") ?? ""
  const date = params.get("date") ?? ""
  const time = params.get("time") ?? ""
  const property = params.get("property") ?? ""

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
  }

  return (
    <div className="relative z-10 w-full max-w-md text-center">
      <Confetti />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/30 mb-6 relative"
        >
          {/* Pulse rings */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-teal-500/30"
            animate={{ 
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-teal-500/20"
            animate={{ 
              scale: [1, 1.8, 1.8],
              opacity: [0.3, 0, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3
            }}
          />
          
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <CheckCircle className="w-10 h-10 text-teal-400" />
          </motion.div>
          
          {/* Sparkles */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ 
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-5 h-5 text-teal-300" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants}>
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            Visita agendada!
          </motion.h1>
          <p className="text-slate-400 text-sm">
            {name ? `Obrigado, ${name.split(" ")[0]}!` : "Obrigado!"} Sua solicitação foi recebida.
            Em breve um corretor entrará em contato para confirmar.
          </p>
        </motion.div>

        {/* Summary card */}
        <AnimatePresence>
          {(date || time || property) && (
            <motion.div
              variants={itemVariants}
              className="mt-8 rounded-2xl border border-white/10 p-6 text-left overflow-hidden relative"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
              whileHover={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                y: -2
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2
                }}
              />
              
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 relative z-10">
                Resumo do agendamento
              </h2>
              
              <ul className="flex flex-col gap-3 relative z-10">
                {date && (
                  <motion.li 
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span 
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <CalendarCheck className="w-4 h-4" />
                    </motion.span>
                    <span className="text-slate-300">{formatDate(date)}</span>
                  </motion.li>
                )}
                
                {time && (
                  <motion.li 
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.span 
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Clock className="w-4 h-4" />
                    </motion.span>
                    <span className="text-slate-300">{time}</span>
                  </motion.li>
                )}
                
                {property && (
                  <motion.li 
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.span 
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Home className="w-4 h-4" />
                    </motion.span>
                    <span className="text-slate-300 break-words">{property}</span>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mt-6">
          <Link href="/">
            <motion.span
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 cursor-pointer"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.span>
              Agendar outra visita
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      <CanvasBackground />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(20,184,166,0.08) 0%, transparent 70%)",
        }}
      />
      <Suspense>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
