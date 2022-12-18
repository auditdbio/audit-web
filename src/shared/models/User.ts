export type User = {
  name: string
  email: string
  role?: UserRole
  accountType: AccountType
  created: string
  updated: string
}

export type UserRole = 'admin' | 'user'

export type AccountType = 'auditor' | 'customer'

export const mockedUser: User = {
  name: 'Jon Doe',
  email: 'jon.doe@gmail.com',
  role: 'user',
  accountType: 'auditor',
  created: '2020-01-01',
  updated: '2020-01-01',
}
