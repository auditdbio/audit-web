export type User = {
  name: string
  email: string
  role?: UserRole
  accountType: AccountType
  created: string
  updated: string
}

export type UserRole = 'admin' | 'user'

export type AccountType = 'auditor' | 'client'
