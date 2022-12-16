export type CustomerContacts = {
  email: string
  telegram: string
}

export type Customer = {
  _id?: string
  about: string
  company: string
  contacts: CustomerContacts
  fname: string
  lname: string
}
