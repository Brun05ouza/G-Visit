"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import StepIndicator from "@/components/StepIndicator"
import Step1Personal from "./Step1Personal"
import Step2Schedule from "./Step2Schedule"
import Step3Property from "./Step3Property"
import { saveVisit } from "@/lib/firestore"
import type { Step1Data, Step2Data, Step3Data } from "@/lib/schema"

const STEP_LABELS = ["Dados", "Agenda", "Imóvel"]

// Slide variants (offset menor para não cortar em containers com padding)
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -24 : 24,
    opacity: 0,
  }),
}

export default function VisitForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({})

  const goNext = (data: Partial<Step1Data & Step2Data & Step3Data>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setDirection(1)
    setStep((s) => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  const handleFinalSubmit = async (step3Data: Step3Data) => {
    const fullData = { ...formData, ...step3Data } as Step1Data & Step2Data & Step3Data
    setLoading(true)
    try {
      const id = await saveVisit(fullData)
      router.push(`/success?id=${id}&name=${encodeURIComponent(fullData.name)}&date=${fullData.preferredDate}&time=${fullData.preferredTime}&property=${encodeURIComponent(fullData.propertyInterest)}`)
    } catch {
      toast.error("Erro ao enviar agendamento. Tente novamente.")
      setShake(true)
      setTimeout(() => setShake(false), 400)
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StepIndicator currentStep={step} totalSteps={3} labels={STEP_LABELS} />
      </motion.div>

      <motion.div
        className="overflow-hidden"
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {step === 1 && (
              <Step1Personal
                defaultValues={formData}
                onNext={(data) => goNext(data)}
              />
            )}
            {step === 2 && (
              <Step2Schedule
                defaultValues={formData}
                onNext={(data) => goNext(data)}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <Step3Property
                defaultValues={formData}
                onSubmit={handleFinalSubmit}
                onBack={goBack}
                loading={loading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="mt-2 flex justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === step ? "w-8 bg-[#10BCA9]" : s < step ? "w-4 bg-[#10BCA9]/50" : "w-4 bg-white/10"
            }`}
            animate={{ scale: s === step ? 1 : 0.9 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.div>
    </>
  )
}
