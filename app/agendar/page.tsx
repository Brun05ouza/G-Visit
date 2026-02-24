"use client"

import HomeLayout from "@/app/home-layout";
import VisitForm from "@/components/VisitForm";
import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AgendarPage() {
  return (
    <HomeLayout>
      {/* Conteúdo direto no main: header + form + footer com gap */}
      <motion.div
        className="mx-auto flex w-full max-w-lg flex-col gap-6 px-0 py-4 sm:py-6 md:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <motion.div
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg sm:mb-4 sm:h-14 sm:w-14 sm:rounded-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 30px rgba(16, 188, 169, 0.4)",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
            >
              <CalendarCheck className="h-7 w-7 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-white sm:text-3xl"
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
            className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Preencha os dados abaixo e nossa equipe entrará em contato para confirmar.
          </motion.p>
        </div>

        {/* Formulário solto no main */}
        <VisitForm />

        <motion.p
          className="mt-6 text-center text-xs text-slate-600 sm:mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Seus dados estão seguros e serão usados apenas para agendamento.
        </motion.p>
      </motion.div>
    </HomeLayout>
  );
}
