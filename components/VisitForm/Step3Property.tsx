"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Home, MessageSquare } from "lucide-react"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import Button from "@/components/ui/Button"
import { step3Schema, type Step3Data } from "@/lib/schema"

interface Props {
  defaultValues?: Partial<Step3Data>
  onSubmit: (data: Step3Data) => void
  onBack: () => void
  loading?: boolean
}

export default function Step3Property({ defaultValues, onSubmit, onBack, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="propertyInterest"
        label="Imóvel de interesse"
        placeholder="Ex: Rua das Flores, 123 — Apto 45 ou código AP-0023"
        icon={<Home className="w-4 h-4" />}
        error={errors.propertyInterest?.message}
        {...register("propertyInterest")}
      />

      <Textarea
        id="message"
        label="Mensagem / Observações (opcional)"
        placeholder="Alguma dúvida ou informação adicional para o corretor..."
        icon={<MessageSquare className="w-4 h-4" />}
        error={errors.message?.message}
        {...register("message")}
      />

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} disabled={loading}>
          Voltar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Confirmar agendamento
        </Button>
      </div>
    </form>
  )
}
