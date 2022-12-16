export type CustomerContacts = {
  email: string
  telegram: string
}

export type Customer = {
  _id: string
  fname: string
  lname: string
  contacts: CustomerContacts
  createdAt: string
  updatedAt: string
}
