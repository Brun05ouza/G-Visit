export interface VisitFormData {
  name: string
  phone: string
  email: string
  preferredDate: string
  preferredTime: string
  timeFlexibility: "fixed" | "flexible"
  propertyInterest: string
  message?: string
}

export interface VisitDocument extends VisitFormData {
  createdAt: Date
  status: "pending"
}
