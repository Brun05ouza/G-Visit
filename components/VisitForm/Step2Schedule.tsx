"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Clock } from "lucide-react"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"
import { step2Schema, type Step2Data } from "@/lib/schema"
import { cn } from "@/lib/utils"

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
]

interface Props {
  defaultValues?: Partial<Step2Data>
  onNext: (data: Step2Data) => void
  onBack: () => void
}

export default function Step2Schedule({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { timeFlexibility: "fixed", ...defaultValues },
  })

  const flexibility = watch("timeFlexibility")

  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5 px-4 sm:px-6">
      <Input
        id="preferredDate"
        label="Data preferida"
        type="date"
        min={today}
        icon={<Calendar className="w-4 h-4" />}
        error={errors.preferredDate?.message}
        {...register("preferredDate")}
      />

      <Select
        id="preferredTime"
        label="Horário preferido"
        icon={<Clock className="w-4 h-4" />}
        options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
        error={errors.preferredTime?.message}
        {...register("preferredTime")}
      />

      {/* Flexibility radio */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-400">Flexibilidade de horário</span>
        <div className="flex gap-3">
          {(["fixed", "flexible"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue("timeFlexibility", val)}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all duration-200",
                flexibility === val
                  ? "bg-teal-600/20 border-teal-500/60 text-teal-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              )}
            >
              {val === "fixed" ? "Horário fixo" : "Sou flexível"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" variant="primary">
          Próximo
        </Button>
      </div>
    </form>
  )
}
