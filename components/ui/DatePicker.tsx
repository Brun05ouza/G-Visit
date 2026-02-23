"use client"

import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getLocalToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function parseYMD(dateStr: string): [number, number, number] {
  const [y, m, d] = dateStr.split('-').map(Number);
  return [y, m, d];
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const today = useMemo(() => getLocalToday(), []);
  const [open, setOpen] = useState(false);

  const [viewYear, setViewYear] = useState(() => parseYMD(value || today)[0]);
  const [viewMonth, setViewMonth] = useState(() => parseYMD(value || today)[1] - 1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync view when value changes externally
  useEffect(() => {
    if (value && !open) {
      const [y, m] = parseYMD(value);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value, open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const displayDate = useMemo(() => {
    if (!value) return 'Selecionar data';
    const [y, m, d] = parseYMD(value);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(y, m - 1, d));
  }, [value]);

  const cells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const prevMonthNum = viewMonth === 0 ? 12 : viewMonth;
    const prevMonthYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const nextMonthNum = viewMonth === 11 ? 1 : viewMonth + 2;
    const nextMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    const result: { date: string; day: number; thisMonth: boolean }[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      result.push({
        date: `${prevMonthYear}-${String(prevMonthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        thisMonth: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      result.push({
        date: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        thisMonth: true,
      });
    }

    const total = result.length <= 35 ? 35 : 42;
    let nextDay = 1;
    while (result.length < total) {
      result.push({
        date: `${nextMonthYear}-${String(nextMonthNum).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`,
        day: nextDay,
        thisMonth: false,
      });
      nextDay++;
    }

    return result;
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function selectDate(date: string) {
    onChange(date);
    setOpen(false);
  }

  function goToToday() {
    onChange(today);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex min-w-0 items-center gap-1.5 rounded-lg border px-3 py-2 transition-colors sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 ${
          open
            ? 'border-[#10BCA9]/40 bg-[#183A40]'
            : 'border-[#283842] bg-[#202C33] hover:bg-[#2A3C46]'
        }`}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0 text-[#10BCA9] sm:h-4 sm:w-4" strokeWidth={2.5} />
        <span className="truncate text-[12px] font-semibold text-white sm:text-[14px]">{displayDate}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-[min(288px,calc(100vw-2rem))] rounded-xl border border-[#283842] bg-[#202C33] p-3 shadow-2xl sm:rounded-2xl sm:p-4">
          {/* Month navigation */}
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8A9BA8] transition-colors hover:bg-[#2A3C46] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <span className="truncate text-[13px] font-semibold text-white sm:text-[14px]">
              {MONTHS_PT[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8A9BA8] transition-colors hover:bg-[#2A3C46] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS_PT.map((d, i) => (
              <div key={i} className="text-center text-[11px] font-bold text-[#4A5A64] py-1 tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {cells.map(({ date, day, thisMonth }) => {
              const isSelected = date === value;
              const isToday = date === today;

              return (
                <button
                  key={date}
                  onClick={() => selectDate(date)}
                  className={[
                    'flex h-8 w-full items-center justify-center rounded-md text-[12px] transition-colors sm:h-9 sm:rounded-lg sm:text-[13px]',
                    isSelected
                      ? 'bg-[#10BCA9] text-white font-bold'
                      : isToday
                      ? 'text-[#10BCA9] font-bold ring-1 ring-[#10BCA9]/40 hover:bg-[#183A40]'
                      : thisMonth
                      ? 'text-white font-medium hover:bg-[#2A3C46]'
                      : 'text-[#3D5060] hover:bg-[#2A3C46]/50',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-[#283842] flex justify-between">
            <button
              onClick={() => setOpen(false)}
              className="text-[13px] font-semibold text-[#8A9BA8] hover:text-white transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={goToToday}
              className="text-[13px] font-semibold text-[#10BCA9] hover:text-[#0EA998] transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
