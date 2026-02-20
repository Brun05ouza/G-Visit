"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Phone, Mail } from "lucide-react"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { step1Schema, type Step1Data } from "@/lib/schema"

interface Props {
  defaultValues?: Partial<Step1Data>
  onNext: (data: Step1Data) => void
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ""
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function Step1Personal({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <Input
        id="name"
        label="Nome completo"
        placeholder="Seu nome completo"
        icon={<User className="w-4 h-4" />}
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        id="phone"
        label="Telefone / WhatsApp"
        placeholder="(99) 99999-9999"
        icon={<Phone className="w-4 h-4" />}
        error={errors.phone?.message}
        {...register("phone", {
          onChange: (e) => {
            const formatted = formatPhone(e.target.value)
            setValue("phone", formatted, { shouldValidate: false })
          },
        })}
      />
      <Input
        id="email"
        label="E-mail"
        placeholder="seu@email.com"
        type="email"
        icon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary">
          Próximo
        </Button>
      </div>
    </form>
  )
}
