export type CustomerContacts = {
  email: string
  telegram?: string
}

export type Customer = {
  _id?: string
  about: string
  company?: string
  contacts: CustomerContacts
  fname: string
  lname: string
  created?: string
  updated?: string
}

export const mockedCustomer: Customer = {
  about:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nunc nisl aliquam nisl, quis aliquam nunc nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nunc nisl aliquam nisl, quis aliquam nunc nisl sit amet nisl.',
  company: 'My Company',
  fname: 'Jon',
  lname: 'Doe',
  contacts: {
    email: 'jon.doe@gmail.com',
    telegram: '@jon_doe',
  },
  created: '2020-01-01',
  updated: '2020-01-01',
}
