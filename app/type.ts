export default interface AlertType {
  id: number
  title: string
  description: string
  severity: "low" | 'medium' | 'high'
  timestamp: string | number
  status: 'active' | 'resolved' | 'ignored' | 'under_review' | 'escalated'
  amount?: number
  merchant?: string
  cardLast4?: string
  userId?: string
  riskScore: number
  device?: string
  location?: string
  transactionId?: string
  message?: string // ← make this optional
  resolution?: string 
  feedback?: string
}
