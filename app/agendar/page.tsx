"use client"

import HomeLayout from "@/app/home-layout";
import VisitForm from "@/components/VisitForm";
import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AgendarPage() {
  return (
    <HomeLayout>
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative z-10 w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15, 
                delay: 0.1 
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 30px rgba(16, 188, 169, 0.4)"
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              >
                <CalendarCheck className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Agendar{" "}
              <motion.span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #2dd4bf, #0d9488)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Visita
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="mt-2 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Preencha os dados abaixo e nossa equipe entrará em contato para confirmar.
            </motion.p>
          </div>

          {/* Card do Formulário */}
          <motion.div
            className="rounded-2xl border border-white/10 p-6 sm:p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.3, 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            <VisitForm />
          </motion.div>

          <motion.p 
            className="mt-6 text-center text-xs text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Seus dados estão seguros e serão usados apenas para agendamento.
          </motion.p>
        </div>
      </motion.div>
    </HomeLayout>
  );
}
