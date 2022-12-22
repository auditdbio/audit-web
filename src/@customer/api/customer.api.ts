import { AxiosInstance } from 'axios'

import { MOCK_API, PORT_FOR_CUSTOMERS } from 'app.constants'
import { Customer, mockedCustomer } from 'shared/models/customer'
import api from 'app.api'

let http: AxiosInstance
const buildApi = () => (http = api(PORT_FOR_CUSTOMERS))

export const create = async (customer: Customer): Promise<Customer> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Customer>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedCustomer,
          fname: customer.fname,
          lname: customer.lname,
          company: customer.company,
          about: customer.about,
          contacts: customer.contacts,
        })
      }, 1000)
    })
  }

  try {
    const response = await http.post('/customers', customer)

    return response.data
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}

export const get = async (): Promise<Customer | null> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Customer>((resolve, reject) => {
      setTimeout(() => {
        resolve(mockedCustomer)
      }, 1000)
    })
  }

  try {
    const response = await http.get('/customers')

    return response.data
  } catch (e: any) {
    if (e.response.status === 404) {
      return null
    }

    throw new Error(e.response.data.message)
  }
}

export const update = async (customer: Customer): Promise<Customer> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<Customer>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedCustomer,
          fname: customer.fname,
          lname: customer.lname,
          company: customer.company,
          about: customer.about,
          contacts: customer.contacts,
        })
      }, 1000)
    })
  }

  try {
    const response = await http.patch('/customers', customer)

    return response.data
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}
