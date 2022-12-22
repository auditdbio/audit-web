export type AuditorContacts = {
  email: string
  telegram?: string
}

export type Auditor = {
  _id?: string
  about: string
  tags: string
  contacts: AuditorContacts
  fname: string
  lname: string
  createdAt?: string
  updatedAt?: string
}

export const mockedAuditor: Auditor = {
  about:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nunc nisl aliquam nisl, quis aliquam nunc nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nunc nisl aliquam nisl, quis aliquam nunc nisl sit amet nisl.',
  tags: 'bitcoin,crypto,audit',
  fname: 'Jon',
  lname: 'Doe',
  contacts: {
    email: 'auditor@dot.com',
    telegram: '@jon_doe_auditor',
  },
  createdAt: '2020-01-01',
  updatedAt: '2020-01-01',
}
