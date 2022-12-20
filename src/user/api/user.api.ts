import { AxiosInstance } from 'axios'

import { SERVER, PORT_FOR_USERS, MOCK_API } from 'app.constants'
import { ServerUser, userAdaptor } from 'user/api/user.adaptor'
import { RegistrationData } from 'user/helpers/RegistrationDataCheck'
import { mockedUser, User } from 'shared/models/User'
import { LoginData } from 'user/helpers/LoginDataCheck'
import api from 'app.api'

let http: AxiosInstance
const httpNoAuth = api(PORT_FOR_USERS, false)
const buildApi = () => (http = api(PORT_FOR_USERS))

export const create = async (user: RegistrationData): Promise<User> => {
  if (!http) buildApi()
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
    const response = await httpNoAuth.post('/users', user)
    return response.data
  } catch (e: any) {
    throw new Error(e.response.data.message)
  }
}

export const login = async (data: LoginData): Promise<User> => {
  if (!http) buildApi()
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
    const response = await httpNoAuth.post<{ token: string; user: ServerUser }>(
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
  if (!http) buildApi()
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
  return await fetch(SERVER + ':' + PORT_FOR_USERS + '/api/users', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then(userAdaptor)
      } else {
        return Promise.reject(response.statusText)
      }
    })
    .catch((e) => {
      return Promise.reject(e.response?.data?.message || `Can't change user name`)
    })
}

export const changePassword = (password: string, email: string): Promise<User> => {
  if (!http) buildApi()
  if (MOCK_API) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        resolve(mockedUser)
      }, 1000)
    })
  }

  return http
    .put('/users/password', { password })
    .then((response) => userAdaptor(response.data))
}

export const remove = async (): Promise<any> => {
  if (!http) buildApi()
  if (MOCK_API) {
    new Promise<null>((resolve, reject) => {
      setTimeout(() => {
        resolve(null)
      }, 1000)
    })
  }
  try {
    return await http.delete('/users').then((response) => response.data)
    // return fetch(SERVER + ':' + PORT_FOR_USERS + '/api/users', {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // })
  } catch (e: any) {
    throw new Error(e.response?.data?.message || `Can't delete user`)
  }
}

export const restore = async (): Promise<User> => {
  if (!http) buildApi()
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

    return await http.post('/auth/restore').then((response) => {
      localStorage.setItem('token', response.data.token)

      return userAdaptor(response.data.user)
    })
  } catch (e: any) {
    throw new Error(e.response?.data?.message || `Can't restore user`)
  }
}
