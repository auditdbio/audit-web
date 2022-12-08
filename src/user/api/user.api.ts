import axios, { Axios, AxiosError, AxiosResponse } from 'axios'

import { SERVER, PORT_USERS, MOCK_API } from 'app.constants'
import { RegistrationData } from 'user/helpers/RegistrationDataCheck'
import { LoginData } from 'user/helpers/LoginDataCheck'
import { User } from 'shared/models/User'
import { ServerUser, userAdaptor } from './adaptors/userAdaptor'

export const axiosNoAuth = axios.create({
  baseURL: SERVER + ':' + PORT_USERS + '/api',
})

export const axiosForUsers = axios.create({
  baseURL: SERVER + ':' + PORT_USERS + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosForUsers.interceptors.request.use(
  (config: any) => {
    if (!config.headers['Authorization']) {
      const token = localStorage.getItem('token')
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: any) => Promise.reject(error),
)

export const registration = async (user: RegistrationData): Promise<User> => {
  if (MOCK_API) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          name: user.name,
          role: user.role,
          email: user.email,
          requestedAccountType: user.requestedAccountType,
          created: '2021-01-01',
          updated: '2021-01-01',
        })
      }, 1000)
    })
  }
  try {
    const response = await axiosNoAuth.post('/users', user)
    return response.data
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}

export const login = async (data: LoginData): Promise<User> => {
  if (MOCK_API) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          name: data.email,
          email: 'maksim.peg@gmail.com',
          requestedAccountType: 'auditor',
          created: '2021-01-01',
          updated: '2021-01-01',
        })
      }, 1000)
    })
  }
  try {
    const response = await axiosNoAuth.post<{ token: string; user: ServerUser }>(
      '/auth/login',
      data,
    )
    localStorage.setItem('token', response.data.token)

    return userAdaptor(response.data.user)
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}

export const changeName = (name: string, email: string): Promise<User> =>
  MOCK_API
    ? new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          resolve({
            name: name,
            email: 'test@gmail.com',
            requestedAccountType: 'auditor',
            created: '2021-01-01',
            updated: '2021-01-01',
          })
        }, 1000)
      })
    : axiosForUsers.put('/users/name', { name }).then((response) => response.data)

export const changePassword = (password: string, email: string): Promise<User> =>
  MOCK_API
    ? new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          resolve({
            name: 'test',
            email: 'test@gmail.com',
            requestedAccountType: 'auditor',
            created: '2021-01-01',
            updated: '2021-01-01',
          })
        }, 1000)
      })
    : axiosForUsers.put('/users/password', { password }).then((response) => response.data)

export const userDelete = async (): Promise<any> => {
  if (MOCK_API) {
    new Promise<null>((resolve, reject) => {
      setTimeout(() => {
        resolve(null)
      }, 1000)
    })
  }
  try {
    // return await axiosForUsers.delete('/users').then((response) => response.data)
    return fetch(SERVER + ':' + PORT_USERS + '/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
  } catch (e: any) {
    throw new Error(e.response?.data?.message || `Can't delete user`)
  }
}
