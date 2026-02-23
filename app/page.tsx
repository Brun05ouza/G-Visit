"use client"

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeLayout from "./home-layout";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { CalendarCheck, Clock, MapPin, User, Plus } from "lucide-react";
import { getVisitsByDate } from "@/lib/firestore";
import type { FullFormData } from "@/lib/schema";
import DatePicker from "@/components/ui/DatePicker";

type VisitWithId = FullFormData & { id: string };
type TimeFilter = 'all' | 'manha' | 'tarde';

function getLocalToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const TIME_LABELS: Record<TimeFilter, string> = {
  all: 'Todos',
  manha: 'Manhã',
  tarde: 'Tarde',
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
};

export default function Home() {
  const today = getLocalToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [visits, setVisits] = useState<VisitWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVisitsByDate(selectedDate)
      .then(setVisits)
      .catch(err => console.error("Erro ao carregar visitas:", err))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      if (timeFilter === 'manha') return v.preferredTime < '13:00';
      if (timeFilter === 'tarde') return v.preferredTime >= '13:00';
      return true;
    });
  }, [visits, timeFilter]);

  const isToday = selectedDate === today;

  return (
    <HomeLayout>
      {/* Page Header with animation */}
      <motion.div 
        className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="min-w-0 flex-1">
          <motion.h2 
            className="text-[24px] font-bold tracking-tight text-white sm:text-[28px] lg:text-[32px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Visitas
          </motion.h2>
          <motion.p 
            className="mt-1 text-[13px] font-medium text-[#788894] sm:mt-[4px] sm:text-[15px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {isToday ? 'Confira a sua agenda de clientes para o dia' : 'Visitas agendadas para a data selecionada'}
          </motion.p>
        </div>
        <Link href="/agendar" className="w-full sm:w-auto">
          <motion.button 
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10BCA9] px-4 py-3 text-[14px] font-bold text-white shadow-lg transition-colors hover:bg-[#0EA998] sm:px-6 sm:py-[14px] sm:text-[15px]"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(16, 188, 169, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Plus className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" strokeWidth={2.5} />
            Agendar Nova Visita
          </motion.button>
        </Link>
      </motion.div>

      {/* Filter bar with staggered animation */}
      <motion.div 
        className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Date picker */}
        <motion.div variants={filterVariants}>
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
        </motion.div>

        {/* Time filter */}
        <motion.div className="flex flex-wrap gap-1.5 sm:gap-2" variants={filterVariants}>
          {(Object.keys(TIME_LABELS) as TimeFilter[]).map((f, index) => (
            <motion.button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`rounded-lg px-3 py-2 text-[13px] font-semibold border transition-colors sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[14px] ${
                timeFilter === f
                  ? 'bg-[#183A40] text-white border-[#10BCA9]/40'
                  : 'bg-[#202C33] text-[#8A9BA8] border-[#283842] hover:bg-[#2A3C46]'
              }`}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              {TIME_LABELS[f]}
            </motion.button>
          ))}
        </motion.div>

        {/* Visit count */}
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.span 
              key={filteredVisits.length}
              className="w-full text-[13px] font-medium text-[#8A9BA8] sm:ml-auto sm:w-auto sm:text-[14px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {filteredVisits.length} visita{filteredVisits.length !== 1 ? 's' : ''}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <motion.div 
            className="rounded-full h-8 w-8 border-b-2 border-[#10BCA9]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : filteredVisits.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center rounded-2xl border border-[#2D3941] bg-[#212E35] px-4 py-16 text-center shadow-sm sm:rounded-[24px] sm:px-6 sm:py-[120px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div 
            className="mb-6 flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#18393F]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <CalendarCheck className="h-[38px] w-[38px] text-[#10BCA9]" strokeWidth={2} />
          </motion.div>
          <motion.h3 
            className="mb-3 text-[22px] font-bold tracking-tight text-white sm:mb-4 sm:text-[26px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Agenda Livre
          </motion.h3>
          <motion.p 
            className="mb-6 max-w-[540px] text-[14px] leading-[1.6] font-medium text-[#8A9BA8] sm:mb-8 sm:text-[16px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {timeFilter !== 'all'
              ? `Nenhuma visita no período da ${TIME_LABELS[timeFilter].toLowerCase()} para esta data.`
              : isToday
                ? 'Você não tem nenhum agendamento marcado para a data de hoje. Aproveite o dia para fazer prospecção ou organizar seus imóveis.'
                : 'Nenhum agendamento encontrado para a data selecionada.'
            }
          </motion.p>
          <Link href="/agendar">
            <motion.button 
              className="rounded-xl border border-[#405461] bg-[#2E3D46] px-8 py-[14px] text-[15px] font-bold text-[#E6EEF3] transition-colors hover:bg-[#384A54]"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Registrar uma Visita
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredVisits.map((visit, index) => (
            <motion.div
              key={visit.id}
              variants={itemVariants}
              whileHover={{ 
                y: -6, 
                scale: 1.01,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              layout
            >
              <Card className="relative overflow-hidden group h-full">
                {/* Animated gradient border */}
                <motion.div 
                  className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#10BCA9] to-[#0EA998]"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  style={{ originY: 0 }}
                />

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 188, 169, 0.06), transparent 40%)"
                  }}
                />

                <div className="mb-3 flex items-start justify-between sm:mb-4">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <motion.span 
                      className="flex items-center gap-1 rounded-md bg-[#10BCA9]/20 px-2 py-0.5 text-xs font-semibold text-[#10BCA9] sm:px-2.5 sm:py-1 sm:text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {visit.preferredTime}
                    </motion.span>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300 sm:px-2.5 sm:py-1 sm:text-xs">
                      {visit.timeFlexibility === 'flexible' ? 'Flexível' : 'Fixo'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#10BCA9]/10">
                      <User className="w-4 h-4 text-[#10BCA9]" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{visit.name}</div>
                      <div className="text-slate-400 text-sm">{visit.phone}</div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-slate-300 text-sm line-clamp-2">
                      {visit.propertyInterest}
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3 sm:mt-5 sm:pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <motion.button
                    onClick={() => window.open(`https://wa.me/55${visit.phone.replace(/\D/g, '')}`, '_blank')}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold text-white transition-colors hover:bg-[#0EA998] sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </motion.button>
                  <motion.button 
                    className="flex flex-1 items-center justify-center rounded-lg border border-[#405461] bg-[#2E3D46] px-3 py-2 text-xs font-semibold text-[#E6EEF3] transition-colors hover:bg-[#384A54] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Ver Detalhes
                  </motion.button>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </HomeLayout>
  );
}
