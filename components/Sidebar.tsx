"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Home, X } from 'lucide-react';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    setMatches(m.matches);
    const handler = () => setMatches(m.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isVisible = isLg || open;

  const menuItems = [
    { title: 'Visitas', path: '/', Icon: Home },
    { title: 'Agenda', path: '/agendar', Icon: CalendarDays },
  ];

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Overlay mobile/tablet */}
      <AnimatePresence>
        {!isLg && open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isVisible ? 0 : '-100%',
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          fixed left-0 top-0 z-50 flex h-full w-[260px] max-w-[85vw] shrink-0 flex-col justify-between border-r border-[#283842] bg-[#202C33]
          lg:relative lg:z-auto lg:translate-x-0 lg:max-w-none
        `}
      >
        <div className="flex flex-col">
          {/* Logo + close (mobile) */}
          <div className="flex h-[60px] items-center justify-between border-b border-[#283842] px-4 lg:h-[76px] lg:border-b-0 lg:px-8">
            <motion.div
              className="flex items-center text-[24px] font-bold tracking-tight text-white lg:text-[28px]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <span>Gê</span>
              <span className="font-semibold opacity-90">Visit</span>
            </motion.div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8A9BA8] transition-colors hover:bg-[#2A3C46] hover:text-white lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>

          <nav className="mt-2 flex flex-col gap-1 px-4 py-4">
            {menuItems.map(({ title, path, Icon }, index) => {
              const isActive = pathname === path;
              return (
                <Link key={path} href={path} onClick={handleLinkClick}>
                  <motion.div
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[14px] font-semibold text-white cursor-pointer relative overflow-hidden sm:py-[14px] sm:text-[15px] ${
                      isActive ? 'bg-[#183A40]' : 'hover:bg-[#2A3C46]'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                      animate={{ color: isActive ? '#10BCA9' : '#ffffff' }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-[20px] w-[20px] opacity-90" strokeWidth={2.5} />
                    </motion.div>
                    <span className={isActive ? 'text-white' : 'text-slate-300'}>{title}</span>
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
      </motion.aside>
    </>
  );
}
