import axios from 'axios'

import { SERVER, PORT_USERS, MOCK_API } from 'app.constants'
import { RegistrationData } from 'user/helpers/RegistrationDataCheck'
import { LoginData } from 'user/helpers/LoginDataCheck'
import { User } from 'shared/models/User'

export const axiosNoAuth = axios.create({
  baseURL: SERVER + ':' + PORT_USERS + '/api',
})

export const axiosForUsers = axios.create({
  baseURL: SERVER + ':' + PORT_USERS + '/api',
  headers: { 'Content-Type': 'application/json' },
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
          _id: 1,
          name: user.userName,
          role: user.role,
          email: user.email,
          created: '2021-01-01',
          updated: '2021-01-01',
        })
      }, 1000)
    })
  }

  const response = await axios.post('/users', user)

  return response.data.user
}

export const login = (data: LoginData): Promise<User> =>
  MOCK_API
    ? new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          resolve({
            _id: 1,
            name: data.email,
            email: 'maksim.peg@gmail.com',
            created: '2021-01-01',
            updated: '2021-01-01',
          })
        }, 1000)
      })
    : axiosNoAuth.post('/user/login', data).then((response) => response.data)

export const changeName = (name: string, email: string): Promise<User> =>
  MOCK_API
    ? new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          resolve({
            _id: 1,
            name: name,
            email: 'test@gmail.com',
            created: '2021-01-01',
            updated: '2021-01-01',
          })
        }, 1000)
      })
    : axiosForUsers.put('/users/name', { name }).then((response) => response.data)

export const changePassword = (password: string, id: number): Promise<User> =>
  MOCK_API
    ? new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          resolve({
            _id: 1,
            name: 'test',
            email: 'test@gmail.com',
            // password: password,
            created: '2021-01-01',
            updated: '2021-01-01',
          })
        }, 1000)
      })
    : axiosForUsers.put('/users/password', { password }).then((response) => response.data)

export const userDelete = (email: string): Promise<User> =>
  MOCK_API
    ? new Promise<null>((resolve, reject) => {
        setTimeout(() => {
          resolve(null)
        }, 1000)
      })
    : axiosForUsers.delete('/users').then((response) => response.data)
