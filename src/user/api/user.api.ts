import axios, { Axios, AxiosError, AxiosResponse } from 'axios'

import { SERVER, PORT_USERS, MOCK_API } from 'app.constants'
import { RegistrationData } from 'user/helpers/RegistrationDataCheck'
import { LoginData } from 'user/helpers/LoginDataCheck'
import { mockedUser, User } from 'shared/models/User'
import { ServerUser, userAdaptor } from './adaptors/userAdaptor'

export const axiosNoAuth = axios.create({
  baseURL: SERVER + ':' + PORT_USERS + '/api',
})

export const axiosForUsers = axios.create({
  baseURL: SERVER + ':' + PORT_USERS + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
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

export const create = async (user: RegistrationData): Promise<User> => {
  if (MOCK_API) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedUser,
          name: user.name,
          role: user.role,
          email: user.email,
          accountType: user.requestedAccountType,
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
          ...mockedUser,
          name: data.email,
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

export const logout = (): void => {
  localStorage.removeItem('token')
}

export const changeName = async (name: string): Promise<any> => {
  if (MOCK_API) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...mockedUser,
          name,
        })
      }, 1000)
    })
  }
  // return axiosForUsers.put('/users/name', { name }).then((response) => response.data)
  return await fetch(SERVER + ':' + PORT_USERS + '/api/users', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return Promise.reject(response.statusText)
      }
    })
    .catch((e) => {
      return Promise.reject(e.response?.data?.message || `Can't change user name`)
    })
}

export const changePassword = (password: string, email: string): Promise<User> =>
  MOCK_API
    ? new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          resolve(mockedUser)
        }, 1000)
      })
    : axiosForUsers.put('/users/password', { password }).then((response) => response.data)

export const remove = async (): Promise<any> => {
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

export const restore = async (): Promise<User> => {
  if (MOCK_API) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        resolve(mockedUser)
      }, 1000)
    })
  }

  try {
    const token = localStorage.getItem('token')

    if (!token) throw new Error('No token in the storage')

    return await axiosForUsers.post('/auth/restore').then((response) => {
      localStorage.setItem('token', response.data.token)

      return response.data.user
    })
  } catch (e: any) {
    throw new Error(e.response?.data?.message || `Can't restore user`)
  }
}
