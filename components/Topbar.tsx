"use client"

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings } from 'lucide-react';

export default function Topbar() {
  const formattedDate = useMemo(() => {
    const str = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  return (
    <motion.header 
      className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#283842] bg-[#202C33] px-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-3">
        <motion.h1 
          className="text-[17px] font-bold tracking-tight text-white"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Olá, Bruno Soares de Souza!
        </motion.h1>
        <motion.span 
          className="text-[15px] font-semibold text-[#10BCA9]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {formattedDate}
        </motion.span>
      </div>

      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <motion.button 
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#183A40] text-[#10BCA9] relative"
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: "#1E454C",
            boxShadow: "0 0 20px rgba(16, 188, 169, 0.2)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Bell className="h-[20px] w-[20px]" strokeWidth={2.5} />
          {/* Notification dot */}
          <motion.span
            className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
        
        <motion.button 
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#183A40] text-[#10BCA9]"
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: "#1E454C",
            boxShadow: "0 0 20px rgba(16, 188, 169, 0.2)",
            rotate: 30
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Settings className="h-[20px] w-[20px]" strokeWidth={2.5} />
        </motion.button>
        
        <motion.div 
          className="ml-1 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#10BCA9] text-[15px] font-bold text-white shadow-sm cursor-pointer"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 25px rgba(16, 188, 169, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          BS
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
