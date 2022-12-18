import { AccountType, User, UserRole } from 'shared/models/User'

export type ServerUser = {
  name: string
  email: string
  role: UserRole
  requestedAccountType: AccountType
  createdAt: string
  updatedAt: string
}

export const userAdaptor = (user: ServerUser): User => ({
  name: user.name,
  email: user.email,
  role: user.role,
  accountType: user.requestedAccountType,
  created: user.createdAt,
  updated: user.updatedAt,
})
