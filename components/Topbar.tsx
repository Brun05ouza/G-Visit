"use client"

import { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, User, ArrowLeft, Camera, Menu } from 'lucide-react';

type ModalView = 'menu' | 'settings' | 'profile';

interface TopbarProps {
  onOpenSidebar?: () => void;
}

export default function Topbar({ onOpenSidebar }: TopbarProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('menu');
  const modalRef = useRef<HTMLDivElement>(null);

  const formattedDate = useMemo(() => {
    const str = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  const shortDate = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsProfileModalOpen(false);
        setModalView('menu');
      }
    }
    if (isProfileModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileModalOpen]);

  const openModal = () => {
    setIsProfileModalOpen(true);
    setModalView('menu');
  };

  const closeModal = () => {
    setIsProfileModalOpen(false);
    setModalView('menu');
  };

  return (
    <>
      <motion.header 
        className="flex h-[60px] shrink-0 items-center justify-between gap-2 border-b border-[#283842] bg-[#202C33] px-4 sm:h-[76px] sm:px-6 lg:px-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {onOpenSidebar && (
            <motion.button
              type="button"
              onClick={onOpenSidebar}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#183A40] text-[#10BCA9] transition-colors hover:bg-[#1E454C] lg:hidden"
              aria-label="Abrir menu"
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            </motion.button>
          )}
          <motion.h1 
            className="truncate text-[14px] font-bold tracking-tight text-white sm:text-[17px]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            title="Olá, Bruno Soares de Souza!"
          >
            <span className="hidden sm:inline">Olá, Bruno Soares de Souza!</span>
            <span className="sm:hidden">Olá, Bruno!</span>
          </motion.h1>
          <motion.span 
            className="hidden shrink-0 text-[13px] font-semibold text-[#10BCA9] sm:inline sm:text-[15px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {formattedDate}
          </motion.span>
          <motion.span 
            className="shrink-0 text-[12px] font-semibold text-[#10BCA9] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {shortDate}
          </motion.span>
        </div>

        <motion.div 
          className="flex shrink-0 items-center gap-1 sm:gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <motion.button 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#183A40] text-[#10BCA9] relative sm:h-[40px] sm:w-[40px]"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "#1E454C",
              boxShadow: "0 0 20px rgba(16, 188, 169, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Bell className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" strokeWidth={2.5} />
            <motion.span
              className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
          
          <motion.button 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#183A40] text-[#10BCA9] sm:h-[40px] sm:w-[40px]"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "#1E454C",
              boxShadow: "0 0 20px rgba(16, 188, 169, 0.2)",
              rotate: 30
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" strokeWidth={2.5} />
          </motion.button>
          
          <motion.button
            type="button"
            onClick={openModal}
            className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#10BCA9] text-[13px] font-bold text-white shadow-sm cursor-pointer sm:ml-1 sm:h-[40px] sm:w-[40px] sm:text-[15px]"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 25px rgba(16, 188, 169, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            BS
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Modal de perfil */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-start sm:justify-end sm:pt-[84px] sm:pr-4 md:pr-[calc(2.5rem+80px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden />
            <motion.div
              ref={modalRef}
              className="relative w-full max-h-[85vh] overflow-y-auto max-w-[380px] rounded-t-2xl border border-b-0 border-[#283842] bg-[#202C33] shadow-xl sm:max-h-none sm:rounded-2xl sm:border-b"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <AnimatePresence mode="wait">
                {modalView === 'menu' && (
                  <motion.div
                    key="menu"
                    className="p-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 pb-4 border-b border-[#283842]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10BCA9] text-lg font-bold text-white">
                        BS
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-white">Bruno Soares</p>
                        <p className="text-[13px] text-[#8A9BA8]">bruno@email.com</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-1">
                      <motion.button
                        type="button"
                        onClick={() => setModalView('settings')}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium text-white transition-colors hover:bg-[#2A3C46]"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#183A40] text-[#10BCA9]">
                          <Settings className="h-[18px] w-[18px]" strokeWidth={2.5} />
                        </div>
                        Configurações
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setModalView('profile')}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium text-white transition-colors hover:bg-[#2A3C46]"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#183A40] text-[#10BCA9]">
                          <User className="h-[18px] w-[18px]" strokeWidth={2.5} />
                        </div>
                        Ver Perfil
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {modalView === 'settings' && (
                  <motion.div
                    key="settings"
                    className="p-4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      type="button"
                      onClick={() => setModalView('menu')}
                      className="mb-4 flex items-center gap-2 text-[14px] font-medium text-[#10BCA9] hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar
                    </button>
                    <h3 className="text-[17px] font-bold text-white mb-4">Configurações</h3>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-[#283842] bg-[#19242A] p-4">
                        <p className="text-[13px] font-medium text-[#8A9BA8] mb-1">Notificações</p>
                        <p className="text-[14px] text-white">Gerencie alertas e lembretes.</p>
                      </div>
                      <div className="rounded-xl border border-[#283842] bg-[#19242A] p-4">
                        <p className="text-[13px] font-medium text-[#8A9BA8] mb-1">Privacidade</p>
                        <p className="text-[14px] text-white">Controle de dados e visibilidade.</p>
                      </div>
                      <div className="rounded-xl border border-[#283842] bg-[#19242A] p-4">
                        <p className="text-[13px] font-medium text-[#8A9BA8] mb-1">Tema</p>
                        <p className="text-[14px] text-white">Aparência do sistema.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {modalView === 'profile' && (
                  <ProfileForm
                    key="profile"
                    onBack={() => setModalView('menu')}
                    onClose={closeModal}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProfileForm({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-[14px] font-medium text-[#10BCA9] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>
      <h3 className="text-[17px] font-bold text-white mb-4">Meu Perfil</h3>

      <div className="space-y-4">
        {/* Foto */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#183A40] text-3xl font-bold text-[#10BCA9] border-2 border-[#283842]">
              BS
            </div>
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-8 w-8 text-white" />
              <input type="file" accept="image/*" className="sr-only" />
            </label>
          </div>
          <span className="text-[13px] text-[#8A9BA8]">Clique para alterar foto</span>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#8A9BA8]">Nome</label>
          <input
            type="text"
            defaultValue="Bruno Soares de Souza"
            className="w-full rounded-xl border border-[#283842] bg-[#19242A] px-4 py-3 text-[15px] text-white placeholder:text-[#5C6B78] focus:border-[#10BCA9] focus:outline-none focus:ring-1 focus:ring-[#10BCA9]"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#8A9BA8]">E-mail</label>
          <input
            type="email"
            defaultValue="bruno@email.com"
            className="w-full rounded-xl border border-[#283842] bg-[#19242A] px-4 py-3 text-[15px] text-white placeholder:text-[#5C6B78] focus:border-[#10BCA9] focus:outline-none focus:ring-1 focus:ring-[#10BCA9]"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#8A9BA8]">Nova senha</label>
          <input
            type="password"
            className="w-full rounded-xl border border-[#283842] bg-[#19242A] px-4 py-3 text-[15px] text-white placeholder:text-[#5C6B78] focus:border-[#10BCA9] focus:outline-none focus:ring-1 focus:ring-[#10BCA9]"
            placeholder="Deixe em branco para não alterar"
          />
        </div>

        <motion.button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#10BCA9] px-4 py-3 text-[15px] font-bold text-white shadow-lg transition-colors hover:bg-[#0EA998]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Salvar alterações
        </motion.button>
      </div>
    </motion.div>
  );
}
