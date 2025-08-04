export const mockAlerts = [
  {
    id: 1,
    title: "Suspicious Card Transaction",
    description: "High-value transaction detected from unusual location with new device",
    severity: "high",
    status: "active",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    amount: 2500,
    merchant: "Electronics Store NYC",
    cardLast4: "4567",
    userId: "USR-789123",
    riskScore: 85,
    device: "Android 12 - Samsung Galaxy S22",
    location: "Brooklyn, NY, USA",
    transactionId: "TXN-001-2024"
  },
  {
    id: 2,
    title: "Multiple Failed Login Attempts",
    description: "15 consecutive failed login attempts from different IP addresses",
    severity: "high",
    status: "active",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    amount: null,
    merchant: null,
    cardLast4: null,
    userId: "USR-456789",
    riskScore: 92,
    device: "Chrome Browser - Windows 11",
    location: "Moscow, Russia",
    transactionId: null
  },
  {
    id: 3,
    title: "Unusual Spending Pattern",
    description: "Transaction amount 300% higher than user's typical spending",
    severity: "medium",
    status: "active",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    amount: 850,
    merchant: "Luxury Fashion Boutique",
    cardLast4: "8901",
    userId: "USR-234567",
    riskScore: 65,
    device: "iPhone 14 - iOS 16.2",
    location: "Los Angeles, CA, USA",
    transactionId: "TXN-002-2024"
  },
  {
    id: 4,
    title: "Velocity Check Failed",
    description: "5 transactions within 10 minutes across different merchants",
    severity: "medium",
    status: "under_review",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    amount: 1200,
    merchant: "Various Merchants",
    cardLast4: "2345",
    userId: "USR-345678",
    riskScore: 72,
    device: "Safari - macOS Ventura",
    location: "San Francisco, CA, USA",
    transactionId: "TXN-003-2024"
  },
  {
    id: 5,
    title: "Geolocation Anomaly",
    description: "Transaction from location 2000+ miles from last known location",
    severity: "low",
    status: "active",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    amount: 45,
    merchant: "Coffee Shop Miami",
    cardLast4: "6789",
    userId: "USR-567890",
    riskScore: 35,
    device: "iPhone 13 - iOS 15.7",
    location: "Miami, FL, USA",
    transactionId: "TXN-004-2024"
  },
  {
    id: 6,
    title: "Account Takeover Attempt",
    description: "Password change requested from unrecognized device",
    severity: "high",
    status: "escalated",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    amount: null,
    merchant: null,
    cardLast4: null,
    userId: "USR-678901",
    riskScore: 88,
    device: "Firefox - Ubuntu Linux",
    location: "Lagos, Nigeria",
    transactionId: null
  },
  {
    id: 7,
    title: "Merchant Category Mismatch",
    description: "Card used at high-risk merchant category for first time",
    severity: "low",
    status: "resolved",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    amount: 125,
    merchant: "Online Gaming Platform",
    cardLast4: "3456",
    userId: "USR-789012",
    riskScore: 42,
    device: "Chrome - Windows 10",
    location: "Chicago, IL, USA",
    transactionId: "TXN-005-2024",
    resolution: "marked_safe",
    feedback: "User confirmed this was a legitimate purchase for their gaming hobby."
  }
]
