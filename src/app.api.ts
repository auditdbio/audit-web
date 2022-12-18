import axios from 'axios'

import { SERVER, PORT_FOR_USERS } from 'app.constants'

// export const axiNoAuth = axios.create({
//   baseURL: SERVER + ':' + PORT_FOR_USERS + '/api',
// })

const axi = (port: string, auth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (auth) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  }

  const axiosService = axios.create({
    baseURL: SERVER + ':' + port + '/api',
    headers,
  })

  if (auth) {
    axiosService.interceptors.request.use(
      (config: any) => {
        if (!config.headers['Authorization']) {
          const token = localStorage.getItem('token')
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error: any) => Promise.reject(error),
    )
  }

  return axiosService
}

export default axi
