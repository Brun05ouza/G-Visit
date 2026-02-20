import { z } from "zod"

export const step1Schema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  phone: z
    .string()
    .min(14, "Telefone inválido")
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato: (99) 99999-9999"),
  email: z.string().email("E-mail inválido"),
})

export const step2Schema = z.object({
  preferredDate: z.string().min(1, "Selecione uma data"),
  preferredTime: z.string().min(1, "Selecione um horário"),
  timeFlexibility: z.enum(["fixed", "flexible"]),
})

export const step3Schema = z.object({
  propertyInterest: z.string().min(3, "Informe o imóvel de interesse"),
  message: z.string().optional(),
})

export const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema)

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type FullFormData = z.infer<typeof fullSchema>
