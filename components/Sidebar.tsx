"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarDays, Home } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Visitas', path: '/', Icon: Home },
    { title: 'Agenda', path: '/agendar', Icon: CalendarDays },
  ];

  return (
    <motion.aside 
      className="flex w-[260px] shrink-0 flex-col justify-between border-r border-[#283842] bg-[#202C33]"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex flex-col">
        {/* Logo */}
        <motion.div 
          className="flex h-[76px] items-center px-8 text-[28px] font-bold tracking-tight text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Gê
          </motion.span>
          <motion.span 
            className="font-semibold opacity-90"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            Visit
          </motion.span>
        </motion.div>

        {/* Navigation */}
        <nav className="mt-2 flex flex-col gap-1 px-4">
          {menuItems.map(({ title, path, Icon }, index) => {
            const isActive = pathname === path;
            return (
              <Link key={path} href={path}>
                <motion.div
                  className={`flex items-center gap-3 rounded-lg px-4 py-[14px] text-[15px] font-semibold text-white cursor-pointer relative overflow-hidden ${
                    isActive ? 'bg-[#183A40]' : 'hover:bg-[#2A3C46]'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#10BCA9]"
                      layoutId="activeIndicator"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  <motion.div
                    animate={{
                      color: isActive ? "#10BCA9" : "#ffffff",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-[20px] w-[20px] opacity-90" strokeWidth={2.5} />
                  </motion.div>
                  
                  <span className={isActive ? "text-white" : "text-slate-300"}>
                    {title}
                  </span>
                  
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#10BCA9]/0 via-[#10BCA9]/5 to-[#10BCA9]/0"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '100%', opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile (Bottom) */}
      <motion.div 
        className="border-t border-[#283842] p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <motion.button 
          className="flex w-full items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[#2A3C46] relative overflow-hidden group"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#11161A] text-[16px] font-bold text-[#8A9BA8]"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "#183A40",
              color: "#10BCA9"
            }}
            transition={{ duration: 0.2 }}
          >
            N
          </motion.div>
          <span className="text-[15px] font-semibold text-white">Perfil</span>
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
